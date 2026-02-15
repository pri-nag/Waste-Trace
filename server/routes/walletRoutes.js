const express = require('express');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/wallet/balance
router.get('/balance', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('walletBalance totalCreditsEarned');
        res.json({ balance: user.walletBalance, totalEarned: user.totalCreditsEarned });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/wallet/transactions
router.get('/transactions', auth, async (req, res) => {
    try {
        const transactions = await WalletTransaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/wallet/transfer – Transfer credits to another user
router.post('/transfer', auth, async (req, res) => {
    try {
        const { toEmail, amount } = req.body;
        if (!toEmail || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid toEmail and amount required' });
        }
        const sender = await User.findById(req.user._id);
        if (sender.walletBalance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        const recipient = await User.findOne({ email: toEmail });
        if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
        if (recipient._id.equals(sender._id)) {
            return res.status(400).json({ error: 'Cannot transfer to yourself' });
        }

        sender.walletBalance -= amount;
        recipient.walletBalance += amount;
        await sender.save();
        await recipient.save();

        await WalletTransaction.create({
            userId: sender._id, amount, type: 'debit',
            description: `Transferred to ${recipient.name}`,
            referenceId: recipient._id, referenceType: 'transfer',
        });
        await WalletTransaction.create({
            userId: recipient._id, amount, type: 'credit',
            description: `Received from ${sender.name}`,
            referenceId: sender._id, referenceType: 'transfer',
        });

        res.json({ message: 'Transfer successful', newBalance: sender.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/wallet/sell – Convert credits to ₹ (mock)
router.post('/sell', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: 'Valid amount required' });

        const user = await User.findById(req.user._id);
        if (user.walletBalance < amount) return res.status(400).json({ error: 'Insufficient balance' });

        const inrValue = (amount * 50).toFixed(2); // 1 GC = ₹50
        user.walletBalance -= amount;
        await user.save();

        await WalletTransaction.create({
            userId: user._id, amount, type: 'debit',
            description: `Sold ${amount} GC for ₹${inrValue}`,
            referenceType: 'sell',
        });

        res.json({ message: `Sold ${amount} GC for ₹${inrValue}`, inrValue, newBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
