const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    description: { type: String, default: '' },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceType: { type: String, enum: ['waste_request', 'marketplace', 'transfer', 'sell'], default: 'waste_request' },
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
