/**
 * Green Credit Calculation Engine
 * GC = Q × P × R × L
 *
 * Q = Quantity (tons)
 * P = Purity Factor (based on contamination %)
 * R = Recovery Efficiency (based on waste type)
 * L = Logistics Multiplier (based on distance in km)
 */

function getPurityFactor(contamination) {
    if (contamination <= 5) return 1.0;
    if (contamination <= 15) return 0.8;
    if (contamination <= 30) return 0.6;
    return 0.3;
}

function getRecoveryEfficiency(wasteType) {
    const map = {
        'RCC': 0.9,
        'Brick Mix': 0.7,
        'Mixed Waste': 0.5,
        'Heavily Contaminated': 0.3,
    };
    return map[wasteType] || 0.5;
}

function getLogisticsMultiplier(distance) {
    if (distance < 10) return 1.2;
    if (distance <= 25) return 1.0;
    return 0.8;
}

function calculateGreenCredit({ quantity, contamination, wasteType, distance }) {
    const Q = Number(quantity) || 0;
    const P = getPurityFactor(Number(contamination) || 0);
    const R = getRecoveryEfficiency(wasteType);
    const L = getLogisticsMultiplier(Number(distance) || 0);
    const gc = parseFloat((Q * P * R * L).toFixed(2));

    return {
        gc,
        Q,
        P,
        R,
        L,
        breakdown: `GC = ${Q} × ${P} × ${R} × ${L} = ${gc}`,
    };
}

function estimateCredits({ quantity, wasteType }) {
    // Estimate using assumed purity=0.8 and distance multiplier=1.0
    const Q = Number(quantity) || 0;
    const P = 0.8;
    const R = getRecoveryEfficiency(wasteType);
    const L = 1.0;
    return parseFloat((Q * P * R * L).toFixed(2));
}

// Mock distance calculation (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
}

module.exports = {
    calculateGreenCredit,
    estimateCredits,
    calculateDistance,
    getPurityFactor,
    getRecoveryEfficiency,
    getLogisticsMultiplier,
};
