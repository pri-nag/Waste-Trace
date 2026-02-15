const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/leaderboard
router.get('/', auth, async (req, res) => {
    try {
        const leaders = await User.find({ role: 'generator', totalCreditsEarned: { $gt: 0 } })
            .select('name totalCreditsEarned totalWasteSent co2Saved segregationScores')
            .sort({ totalCreditsEarned: -1 })
            .limit(20);

        const leaderboard = leaders.map((u, i) => ({
            rank: i + 1,
            name: u.name,
            totalCreditsEarned: u.totalCreditsEarned,
            totalWasteSent: u.totalWasteSent,
            co2Saved: u.co2Saved,
            segregationGrade: u.segregationGrade,
        }));

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
