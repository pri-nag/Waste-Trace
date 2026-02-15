const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
        type: String,
        enum: ['Aggregates', 'Pavers', 'Sand', 'Bricks', 'Other'],
        required: true,
    },
    priceInCredits: { type: Number, required: true },
    image: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
