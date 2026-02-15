import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { HiBeaker, HiCheckCircle, HiScale, HiArrowLeft } from 'react-icons/hi2';

const wasteTypes = ['RCC', 'Brick Mix', 'Mixed Waste', 'Heavily Contaminated'];

function getPurityFactor(c) { if (c <= 5) return 1.0; if (c <= 15) return 0.8; if (c <= 30) return 0.6; return 0.3; }
function getRecovery(t) { return { 'RCC': 0.9, 'Brick Mix': 0.7, 'Mixed Waste': 0.5, 'Heavily Contaminated': 0.3 }[t] || 0.5; }
function getLogistics(d) { if (d < 10) return 1.2; if (d <= 25) return 1.0; return 0.8; }

export default function QualityCheck() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [load, setLoad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ actualWeight: '', contamination: '', wasteType: '', qcNotes: '' });
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        api.get('/waste/incoming').then(res => {
            const found = res.data.find(r => r._id === id);
            if (found) {
                setLoad(found);
                setForm(f => ({ ...f, actualWeight: String(found.quantity), wasteType: found.wasteType }));
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    // Live calculate
    useEffect(() => {
        if (form.actualWeight && form.contamination) {
            const Q = Number(form.actualWeight);
            const P = getPurityFactor(Number(form.contamination));
            const R = getRecovery(form.wasteType);
            const L = getLogistics(load?.distance || 15);
            const gc = parseFloat((Q * P * R * L).toFixed(2));
            setResult({ gc, Q, P, R, L });
        } else {
            setResult(null);
        }
    }, [form, load]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/waste/${id}/qc`, {
                actualWeight: Number(form.actualWeight),
                contamination: Number(form.contamination),
                wasteType: form.wasteType,
                qcNotes: form.qcNotes,
            });
            setDone(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;
    if (!load) return <div className="card text-center py-12"><p className="text-concrete-500">Load not found.</p></div>;

    if (done) {
        return (
            <div className="max-w-lg mx-auto text-center py-16 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-eco-100 flex items-center justify-center mx-auto mb-6">
                    <HiCheckCircle className="text-4xl text-eco-700" />
                </div>
                <h2 className="text-2xl font-black text-concrete-900 mb-2">QC Completed!</h2>
                <p className="text-concrete-500 mb-2">Green Credits have been issued to the generator's wallet.</p>
                <p className="text-3xl font-black text-eco-800 mb-6">{result?.gc} GC</p>
                <button onClick={() => navigate('/recycler/incoming')} className="btn-primary">Back to Incoming Loads</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-concrete-500 hover:text-concrete-700 transition-colors">
                <HiArrowLeft /> Back to loads
            </button>

            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <HiBeaker className="text-xl" />
                    </div>
                    Quality Check
                </h1>
                <p className="text-concrete-500 mt-1">Inspect, grade, and issue credits for this waste load</p>
            </div>

            {/* Load info */}
            <div className="card bg-concrete-50 border-concrete-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-concrete-400">Generator</p>
                        <p className="font-bold text-concrete-800">{load.generatorId?.name}</p>
                    </div>
                    <div>
                        <p className="text-concrete-400">Declared Type</p>
                        <p className="font-bold text-concrete-800">{load.wasteType}</p>
                    </div>
                    <div>
                        <p className="text-concrete-400">Declared Qty</p>
                        <p className="font-bold text-concrete-800">{load.quantity} tons</p>
                    </div>
                    <div>
                        <p className="text-concrete-400">Distance</p>
                        <p className="font-bold text-concrete-800">{load.distance?.toFixed(1)} km</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 card space-y-5">
                    <h3 className="font-bold text-concrete-900 text-lg">QC Inspection</h3>

                    <div>
                        <label className="label flex items-center gap-2"><HiScale /> Actual Weight (tons)</label>
                        <input type="number" value={form.actualWeight} onChange={e => setForm(f => ({ ...f, actualWeight: e.target.value }))} className="input" min="0.1" step="0.1" required />
                    </div>

                    <div>
                        <label className="label">Contamination (%)</label>
                        <input type="number" value={form.contamination} onChange={e => setForm(f => ({ ...f, contamination: e.target.value }))} className="input" min="0" max="100" step="1" required />
                        <div className="flex gap-2 mt-2">
                            {[3, 10, 20, 40].map(v => (
                                <button key={v} type="button" onClick={() => setForm(f => ({ ...f, contamination: String(v) }))} className="btn-secondary text-xs !py-1 !px-2">{v}%</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">Final Waste Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {wasteTypes.map(type => (
                                <button key={type} type="button" onClick={() => setForm(f => ({ ...f, wasteType: type }))}
                                    className={`p-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${form.wasteType === type ? 'border-eco-500 bg-eco-50 text-eco-800' : 'border-concrete-200 text-concrete-600 hover:border-concrete-300'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">QC Notes (optional)</label>
                        <textarea value={form.qcNotes} onChange={e => setForm(f => ({ ...f, qcNotes: e.target.value }))} className="input" rows={3} placeholder="Any observations..." />
                    </div>

                    <button type="submit" disabled={submitting || !result} className="btn-primary w-full flex items-center justify-center gap-2">
                        {submitting ? 'Processing...' : <><HiCheckCircle /> Approve & Issue {result?.gc || 0} Credits</>}
                    </button>
                </form>

                {/* Credit calculation */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="card-eco text-center">
                        <p className="text-sm text-eco-200 mb-1">Calculated Green Credits</p>
                        <p className="text-5xl font-black">{result?.gc || '—'}</p>
                        <p className="text-xs text-eco-300 mt-2">GC = Q × P × R × L</p>
                    </div>

                    {result && (
                        <div className="card space-y-3 animate-slide-up">
                            <h4 className="font-bold text-concrete-800">Breakdown</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center p-2 rounded-lg bg-concrete-50">
                                    <span className="text-concrete-500">Q (Quantity)</span>
                                    <span className="font-bold text-concrete-800">{result.Q} t</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg bg-concrete-50">
                                    <span className="text-concrete-500">P (Purity Factor)</span>
                                    <span className={`font-bold ${result.P >= 0.8 ? 'text-eco-700' : result.P >= 0.6 ? 'text-yellow-700' : 'text-red-600'}`}>{result.P}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg bg-concrete-50">
                                    <span className="text-concrete-500">R (Recovery)</span>
                                    <span className="font-bold text-concrete-800">{result.R}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded-lg bg-concrete-50">
                                    <span className="text-concrete-500">L (Logistics)</span>
                                    <span className="font-bold text-concrete-800">{result.L}</span>
                                </div>
                                <div className="border-t border-concrete-200 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-concrete-800">Final Credits</span>
                                    <span className="font-black text-eco-800 text-lg">{result.gc} GC</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card text-xs text-concrete-500 space-y-1">
                        <h4 className="font-bold text-concrete-700 text-sm">Purity Factor Table</h4>
                        <p>0-5% contamination → P = 1.0</p>
                        <p>5-15% → P = 0.8</p>
                        <p>15-30% → P = 0.6</p>
                        <p>&gt;30% → P = 0.3</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
