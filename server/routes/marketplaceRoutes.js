const express = require('express');
const MarketplaceItem = require('../models/MarketplaceItem');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/marketplace
router.get('/', auth, async (req, res) => {
    try {
        const items = await MarketplaceItem.find({ stock: { $gt: 0 } })
            .populate('sellerId', 'name')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/marketplace – Add item (recycler)
router.post('/', auth, requireRole('recycler'), async (req, res) => {
    try {
        const { name, description, category, priceInCredits, stock, image } = req.body;
        const item = new MarketplaceItem({
            name, description, category, priceInCredits, stock,
            image: image || '', sellerId: req.user._id,
        });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/marketplace/:id/redeem – Redeem with credits
router.post('/:id/redeem', auth, async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        if (item.stock <= 0) return res.status(400).json({ error: 'Out of stock' });

        const user = await User.findById(req.user._id);
        if (user.walletBalance < item.priceInCredits) {
            return res.status(400).json({ error: 'Insufficient credits' });
        }

        user.walletBalance -= item.priceInCredits;
        item.stock -= 1;
        await user.save();
        await item.save();

        await WalletTransaction.create({
            userId: user._id,
            amount: item.priceInCredits,
            type: 'debit',
            description: `Redeemed: ${item.name}`,
            referenceId: item._id,
            referenceType: 'marketplace',
        });

        res.json({ message: `Successfully redeemed ${item.name}`, newBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
