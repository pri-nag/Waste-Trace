require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Plant = require('./models/Plant');
const MarketplaceItem = require('./models/MarketplaceItem');
const WasteRequest = require('./models/WasteRequest');
const WalletTransaction = require('./models/WalletTransaction');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Plant.deleteMany({});
        await MarketplaceItem.deleteMany({});
        await WasteRequest.deleteMany({});
        await WalletTransaction.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create generator
        const generator = await User.create({
            name: 'Priyanshi Naghera',
            email: 'priyanshi@wastetrace.com',
            password: 'password123',
            role: 'generator',
            walletBalance: 45.5,
            totalCreditsEarned: 95.5,
            totalWasteSent: 120,
            co2Saved: 60,
            segregationScores: [1.0, 0.8, 1.0, 0.8, 0.6],
        });

        const generator2 = await User.create({
            name: 'Raj Patel',
            email: 'raj@builder.com',
            password: 'password123',
            role: 'generator',
            walletBalance: 22.0,
            totalCreditsEarned: 52.0,
            totalWasteSent: 80,
            co2Saved: 40,
            segregationScores: [0.8, 0.6, 0.8],
        });

        // Create recycler
        const recycler = await User.create({
            name: 'GreenBuild Recyclers',
            email: 'greenbuild@wastetrace.com',
            password: 'password123',
            role: 'recycler',
        });

        console.log('👥 Created users');

        // Create plant
        const plant = await Plant.create({
            ownerId: recycler._id,
            name: 'GreenBuild C&D Recycling Facility',
            address: 'Sarkhej-Gandhinagar Highway, Ahmedabad',
            location: { lat: 23.0733, lng: 72.5177 },
            capacity: 200,
            currentUtilization: 35,
            totalWasteReceived: 120,
            totalCreditsIssued: 95.5,
            totalRevenue: 12000,
        });

        console.log('🏭 Created plant');

        // Create marketplace items
        await MarketplaceItem.insertMany([
            {
                name: 'Recycled Aggregate (20mm)',
                description: 'High-quality recycled coarse aggregate suitable for non-structural concrete and road sub-base.',
                category: 'Aggregates',
                priceInCredits: 5,
                stock: 50,
                sellerId: recycler._id,
            },
            {
                name: 'Eco Paver Blocks',
                description: 'Interlocking concrete pavers made from 80% recycled C&D waste. Available in grey and red.',
                category: 'Pavers',
                priceInCredits: 8,
                stock: 200,
                sellerId: recycler._id,
            },
            {
                name: 'Manufactured Sand (M-Sand)',
                description: 'Fine aggregate manufactured from recycled concrete waste. IS 383 compliant.',
                category: 'Sand',
                priceInCredits: 4,
                stock: 100,
                sellerId: recycler._id,
            },
            {
                name: 'Recycled Bricks',
                description: 'Compressed bricks made from processed C&D waste. Suitable for partition walls.',
                category: 'Bricks',
                priceInCredits: 3,
                stock: 500,
                sellerId: recycler._id,
            },
            {
                name: 'Recycled Fine Aggregate (4mm)',
                description: 'Fine recycled aggregate for plastering, masonry, and non-structural use.',
                category: 'Aggregates',
                priceInCredits: 3,
                stock: 80,
                sellerId: recycler._id,
            },
        ]);

        console.log('🛒 Created marketplace items');

        // Create sample waste requests
        const req1 = await WasteRequest.create({
            generatorId: generator._id,
            recyclerId: recycler._id,
            plantId: plant._id,
            wasteType: 'RCC',
            quantity: 50,
            actualWeight: 48,
            contamination: 8,
            distance: 12,
            creditIssued: 34.56,
            status: 'QC Completed',
            purityFactor: 0.8,
            recoveryEfficiency: 0.9,
            logisticsMultiplier: 1.0,
            siteLocation: { lat: 23.0225, lng: 72.5714 },
            pickupTime: new Date('2026-02-10'),
        });

        await WasteRequest.create({
            generatorId: generator._id,
            recyclerId: recycler._id,
            plantId: plant._id,
            wasteType: 'Brick Mix',
            quantity: 30,
            actualWeight: 28,
            contamination: 12,
            distance: 8,
            creditIssued: 18.82,
            status: 'QC Completed',
            purityFactor: 0.8,
            recoveryEfficiency: 0.7,
            logisticsMultiplier: 1.2,
            siteLocation: { lat: 23.0395, lng: 72.5660 },
            pickupTime: new Date('2026-02-08'),
        });

        await WasteRequest.create({
            generatorId: generator._id,
            recyclerId: recycler._id,
            plantId: plant._id,
            wasteType: 'Mixed Waste',
            quantity: 20,
            distance: 15,
            estimatedCredits: 8.0,
            status: 'Delivered',
            siteLocation: { lat: 23.0125, lng: 72.5514 },
            pickupTime: new Date('2026-02-13'),
        });

        await WasteRequest.create({
            generatorId: generator2._id,
            recyclerId: recycler._id,
            plantId: plant._id,
            wasteType: 'RCC',
            quantity: 40,
            distance: 22,
            estimatedCredits: 28.8,
            status: 'En Route',
            siteLocation: { lat: 23.0502, lng: 72.5907 },
            pickupTime: new Date('2026-02-13'),
        });

        // Create wallet transactions
        await WalletTransaction.insertMany([
            {
                userId: generator._id, amount: 34.56, type: 'credit',
                description: 'Green Credits for RCC waste (48 tons)',
                referenceId: req1._id, referenceType: 'waste_request',
            },
            {
                userId: generator._id, amount: 18.82, type: 'credit',
                description: 'Green Credits for Brick Mix waste (28 tons)',
                referenceType: 'waste_request',
            },
            {
                userId: generator._id, amount: 5, type: 'debit',
                description: 'Redeemed: Recycled Aggregate (20mm)',
                referenceType: 'marketplace',
            },
            {
                userId: generator._id, amount: 2.88, type: 'debit',
                description: 'Sold 2.88 GC for ₹144.00',
                referenceType: 'sell',
            },
        ]);

        console.log('📦 Created sample waste requests & transactions');
        console.log('\n✅ Seed complete!');
        console.log('---');
        console.log('Generator login: priyanshi@wastetrace.com / password123');
        console.log('Recycler login: greenbuild@wastetrace.com / password123');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
}

seed();
