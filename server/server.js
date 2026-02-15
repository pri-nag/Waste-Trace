require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const plantRoutes = require('./routes/plantRoutes');
const walletRoutes = require('./routes/walletRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/certificate', certificateRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB & start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => {
            console.log(`🚀 Waste-Trace server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
