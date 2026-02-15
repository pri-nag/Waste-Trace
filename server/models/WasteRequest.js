const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema({
    generatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recyclerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
    wasteType: {
        type: String,
        enum: ['RCC', 'Brick Mix', 'Mixed Waste', 'Heavily Contaminated'],
        required: true,
    },
    quantity: { type: Number, required: true }, // tons
    actualWeight: { type: Number },
    contamination: { type: Number }, // percentage 0-100
    distance: { type: Number }, // km
    creditIssued: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'En Route', 'Picked', 'Delivered', 'QC Completed'],
        default: 'Pending',
    },
    image: { type: String, default: '' },
    qrCode: { type: String, default: '' },
    pickupTime: { type: Date },
    estimatedCredits: { type: Number, default: 0 },
    qcNotes: { type: String, default: '' },
    purityFactor: { type: Number },
    recoveryEfficiency: { type: Number },
    logisticsMultiplier: { type: Number },
    siteLocation: {
        lat: { type: Number },
        lng: { type: Number },
    },
}, { timestamps: true });

module.exports = mongoose.model('WasteRequest', wasteRequestSchema);
