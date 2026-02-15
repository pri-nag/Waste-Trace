const express = require('express');
const Plant = require('../models/Plant');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/plants – Register plant
router.post('/', auth, requireRole('recycler'), async (req, res) => {
    try {
        const { name, address, location, capacity, recoveryEfficiencyMap } = req.body;
        if (!name || !location?.lat || !location?.lng) {
            return res.status(400).json({ error: 'name and location (lat, lng) are required' });
        }
        const plant = new Plant({
            ownerId: req.user._id,
            name,
            address: address || '',
            location,
            capacity: capacity || 100,
            recoveryEfficiencyMap: recoveryEfficiencyMap || undefined,
        });
        await plant.save();
        res.status(201).json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/plants/my – Get recycler's plants
router.get('/my', auth, requireRole('recycler'), async (req, res) => {
    try {
        const plants = await Plant.find({ ownerId: req.user._id });
        res.json(plants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/plants/all – List all plants (for generators to pick)
router.get('/all', auth, async (req, res) => {
    try {
        console.log('[API] /all route hit. Plant model check:', !!Plant);
        const plants = await Plant.find().populate('ownerId', 'name email');
        console.log('[API] Query result type:', typeof plants);
        console.log(`[API] Found ${plants?.length || 0} plants for /all`);
        res.json(plants || []);
    } catch (err) {
        console.error('[API] Error in /api/plants/all:', err);
        res.status(500).json({ error: 'Failed to fetch plants', details: err.message });
    }
});

// PUT /api/plants/:id – Update plant
router.put('/:id', auth, requireRole('recycler'), async (req, res) => {
    try {
        const plant = await Plant.findOne({ _id: req.params.id, ownerId: req.user._id });
        if (!plant) return res.status(404).json({ error: 'Plant not found' });
        Object.assign(plant, req.body);
        await plant.save();
        res.json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
