const express = require('express');
const QRCode = require('qrcode');
const WasteRequest = require('../models/WasteRequest');
const Plant = require('../models/Plant');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const { auth, requireRole } = require('../middleware/auth');
const { calculateGreenCredit, estimateCredits, calculateDistance } = require('../utils/greenCredit');

const router = express.Router();

// POST /api/waste – Create pickup request (generator)
router.post('/', auth, requireRole('generator'), async (req, res) => {
    try {
        const { wasteType, quantity, plantId, pickupTime, siteLocation, image } = req.body;
        if (!wasteType || !quantity || !plantId) {
            return res.status(400).json({ error: 'wasteType, quantity, and plantId are required' });
        }

        const plant = await Plant.findById(plantId);
        if (!plant) return res.status(404).json({ error: 'Plant not found' });

        // Calculate distance
        const siteLat = siteLocation?.lat || 23.0225;
        const siteLng = siteLocation?.lng || 72.5714;
        const distance = calculateDistance(siteLat, siteLng, plant.location.lat, plant.location.lng);

        const estimated = estimateCredits({ quantity, wasteType });

        const request = new WasteRequest({
            generatorId: req.user._id,
            recyclerId: plant.ownerId,
            plantId: plant._id,
            wasteType,
            quantity,
            distance,
            estimatedCredits: estimated,
            pickupTime: pickupTime || new Date(),
            siteLocation: { lat: siteLat, lng: siteLng },
            image: image || '',
            status: 'Pending',
        });

        // Generate QR code
        const qrData = JSON.stringify({
            id: request._id,
            wasteType,
            quantity,
            generator: req.user.name,
        });
        request.qrCode = await QRCode.toDataURL(qrData);

        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/waste/my – List generator's requests
router.get('/my', auth, requireRole('generator'), async (req, res) => {
    try {
        const requests = await WasteRequest.find({ generatorId: req.user._id })
            .populate('plantId', 'name address')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/waste/incoming – List incoming loads (recycler)
router.get('/incoming', auth, requireRole('recycler'), async (req, res) => {
    try {
        const requests = await WasteRequest.find({ recyclerId: req.user._id })
            .populate('generatorId', 'name email')
            .populate('plantId', 'name address')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/waste/:id/status – Update status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Assigned', 'En Route', 'Picked', 'Delivered', 'QC Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const request = await WasteRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!request) return res.status(404).json({ error: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/waste/:id/qc – Submit QC & issue credits (recycler)
router.post('/:id/qc', auth, requireRole('recycler'), async (req, res) => {
    try {
        const { actualWeight, contamination, wasteType, qcNotes } = req.body;
        const request = await WasteRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        const qty = actualWeight || request.quantity;
        const dist = request.distance || 15;
        const type = wasteType || request.wasteType;

        const result = calculateGreenCredit({
            quantity: qty,
            contamination,
            wasteType: type,
            distance: dist,
        });

        // Update request
        request.actualWeight = qty;
        request.contamination = contamination;
        request.wasteType = type;
        request.creditIssued = result.gc;
        request.purityFactor = result.P;
        request.recoveryEfficiency = result.R;
        request.logisticsMultiplier = result.L;
        request.status = 'QC Completed';
        request.qcNotes = qcNotes || '';
        await request.save();

        // Credit generator wallet
        const generator = await User.findById(request.generatorId);
        generator.walletBalance += result.gc;
        generator.totalCreditsEarned += result.gc;
        generator.totalWasteSent += qty;
        generator.co2Saved += parseFloat((qty * 0.5).toFixed(2)); // mock: 0.5 tons CO2 per ton diverted
        generator.segregationScores.push(result.P);
        await generator.save();

        // Record transaction
        await WalletTransaction.create({
            userId: generator._id,
            amount: result.gc,
            type: 'credit',
            description: `Green Credits for ${type} waste (${qty} tons)`,
            referenceId: request._id,
            referenceType: 'waste_request',
        });

        // Update plant stats
        const plant = await Plant.findById(request.plantId);
        if (plant) {
            plant.totalWasteReceived += qty;
            plant.totalCreditsIssued += result.gc;
            plant.currentUtilization = Math.min(100, plant.currentUtilization + (qty / plant.capacity) * 100);
            await plant.save();
        }

        res.json({ request, creditResult: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/waste/stats – Generator stats
router.get('/stats', auth, requireRole('generator'), async (req, res) => {
    try {
        const requests = await WasteRequest.find({ generatorId: req.user._id });
        const thisMonth = requests.filter(r => {
            const d = new Date(r.createdAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const user = await User.findById(req.user._id);
        res.json({
            totalRequests: requests.length,
            wasteSentThisMonth: thisMonth.reduce((sum, r) => sum + (r.actualWeight || r.quantity), 0),
            creditsAvailable: user.walletBalance,
            totalCreditsEarned: user.totalCreditsEarned,
            totalWasteSent: user.totalWasteSent,
            co2Saved: user.co2Saved,
            segregationGrade: user.segregationGrade,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/waste/recycler-stats – Recycler dashboard stats
router.get('/recycler-stats', auth, requireRole('recycler'), async (req, res) => {
    try {
        const plants = await Plant.find({ ownerId: req.user._id });
        const plantIds = plants.map(p => p._id);
        const requests = await WasteRequest.find({ plantId: { $in: plantIds } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRequests = requests.filter(r => new Date(r.createdAt) >= today);

        res.json({
            totalWasteReceived: plants.reduce((s, p) => s + p.totalWasteReceived, 0),
            wasteReceivedToday: todayRequests.reduce((s, r) => s + (r.actualWeight || r.quantity), 0),
            capacityUtilization: plants.length ? plants.reduce((s, p) => s + p.currentUtilization, 0) / plants.length : 0,
            creditsIssued: plants.reduce((s, p) => s + p.totalCreditsIssued, 0),
            totalRevenue: plants.reduce((s, p) => s + p.totalRevenue, 0),
            totalRequests: requests.length,
            completedRequests: requests.filter(r => r.status === 'QC Completed').length,
            pendingRequests: requests.filter(r => r.status !== 'QC Completed').length,
            wasteSources: requests.map(r => ({
                lat: r.siteLocation?.lat,
                lng: r.siteLocation?.lng,
                quantity: r.actualWeight || r.quantity,
                type: r.wasteType,
            })).filter(s => s.lat && s.lng),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
