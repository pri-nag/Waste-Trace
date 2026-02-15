const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    capacity: { type: Number, default: 100 }, // tons per day
    currentUtilization: { type: Number, default: 0 },
    recoveryEfficiencyMap: {
        type: Map,
        of: Number,
        default: {
            'RCC': 0.9,
            'Brick Mix': 0.7,
            'Mixed Waste': 0.5,
            'Heavily Contaminated': 0.3,
        },
    },
    totalWasteReceived: { type: Number, default: 0 },
    totalCreditsIssued: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
