import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiTruck, HiCamera, HiClock, HiMapPin, HiCube, HiArrowRight, HiCheckCircle } from 'react-icons/hi2';

const wasteTypes = ['RCC', 'Brick Mix', 'Mixed Waste', 'Heavily Contaminated'];

// Estimate credits client-side for preview
function estimateCreditsClient(quantity, wasteType) {
    const R = { 'RCC': 0.9, 'Brick Mix': 0.7, 'Mixed Waste': 0.5, 'Heavily Contaminated': 0.3 }[wasteType] || 0.5;
    return (Number(quantity) * 0.8 * R * 1.0).toFixed(2);
}

export default function RequestPickup() {
    const [plants, setPlants] = useState([]);
    const [form, setForm] = useState({ wasteType: 'RCC', quantity: '', plantId: '', pickupTime: '' });
    const [estimated, setEstimated] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [plantsLoading, setPlantsLoading] = useState(true);

    useEffect(() => {
        setPlantsLoading(true);
        api.get('/plants/all')
            .then(res => {
                console.log('Fetched plants:', res.data);
                if (Array.isArray(res.data)) {
                    setPlants(res.data);
                } else {
                    console.error('Expected array for plants, got:', typeof res.data);
                    setPlants([]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch plants:', err);
                setError('Could not load recycling plants. Please try again.');
            })
            .finally(() => setPlantsLoading(false));
    }, []);

    useEffect(() => {
        setEstimated(estimateCreditsClient(form.quantity, form.wasteType));
    }, [form.quantity, form.wasteType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/waste', {
                wasteType: form.wasteType,
                quantity: Number(form.quantity),
                plantId: form.plantId,
                pickupTime: form.pickupTime || undefined,
            });
            setSuccess(true);
            setForm({ wasteType: 'RCC', quantity: '', plantId: '', pickupTime: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-eco-gradient flex items-center justify-center">
                        <HiTruck className="text-white text-xl" />
                    </div>
                    Request Pickup
                </h1>
                <p className="text-concrete-500 mt-1">Schedule a waste pickup from your construction site</p>
            </div>

            {success && (
                <div className="bg-eco-50 border border-eco-200 text-eco-800 px-5 py-4 rounded-xl flex items-center gap-3 animate-slide-up">
                    <HiCheckCircle className="text-xl flex-shrink-0" />
                    Pickup request submitted successfully! Check the Tracking page for status updates.
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">{error}</div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                <form onSubmit={handleSubmit} className="lg:col-span-2 card space-y-5">
                    <div>
                        <label className="label">Waste Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {wasteTypes.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, wasteType: type }))}
                                    className={`p-3 rounded-xl border-2 text-sm font-semibold text-center transition-all ${form.wasteType === type ? 'border-eco-500 bg-eco-50 text-eco-800' : 'border-concrete-200 text-concrete-600 hover:border-concrete-300'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">Estimated Quantity (tons)</label>
                        <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className="input" placeholder="e.g. 50" min="0.1" step="0.1" required />
                    </div>

                    <div>
                        <label className="label">Select Recycling Plant</label>
                        <select
                            value={form.plantId}
                            onChange={e => setForm(f => ({ ...f, plantId: e.target.value }))}
                            className="input"
                            required
                            disabled={plantsLoading}
                        >
                            <option value="">{plantsLoading ? 'Loading plants...' : 'Choose a plant...'}</option>
                            {plants.map(p => (
                                <option key={p._id} value={p._id}>{p.name} – {p.address || 'No address'}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label flex items-center gap-2"><HiClock className="text-concrete-400" /> Preferred Pickup Time</label>
                        <input type="datetime-local" value={form.pickupTime} onChange={e => setForm(f => ({ ...f, pickupTime: e.target.value }))} className="input" />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                        {loading ? 'Submitting...' : <><span>Submit Pickup Request</span><HiArrowRight /></>}
                    </button>
                </form>

                {/* Estimated Credits Card */}
                <div className="space-y-4">
                    <div className="card-eco text-center">
                        <HiCube className="text-3xl mx-auto mb-3 text-eco-200" />
                        <p className="text-sm text-eco-200 mb-1">Estimated Green Credits</p>
                        <p className="text-4xl font-black">{form.quantity ? estimated : '0.00'}</p>
                        <p className="text-xs text-eco-300 mt-2">Based on P=0.8 (assumed purity)</p>
                    </div>

                    <div className="card text-sm space-y-3">
                        <h4 className="font-bold text-concrete-800">Credit Formula</h4>
                        <p className="text-concrete-500">GC = Q × P × R × L</p>
                        <div className="space-y-2 text-concrete-600">
                            <div className="flex justify-between">
                                <span>Q (Quantity)</span>
                                <span className="font-semibold">{form.quantity || '—'} t</span>
                            </div>
                            <div className="flex justify-between">
                                <span>P (Purity)</span>
                                <span className="font-semibold">0.8 (est.)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>R (Recovery)</span>
                                <span className="font-semibold">{{ 'RCC': 0.9, 'Brick Mix': 0.7, 'Mixed Waste': 0.5, 'Heavily Contaminated': 0.3 }[form.wasteType]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>L (Logistics)</span>
                                <span className="font-semibold">1.0 (est.)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
