import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { HiInboxArrowDown, HiBeaker, HiTruck, HiMapPin, HiScale, HiDocumentText } from 'react-icons/hi2';

export default function IncomingLoads() {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/waste/incoming').then(res => { setLoads(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/waste/${id}/status`, { status });
            setLoads(loads.map(l => l._id === id ? { ...l, status } : l));
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;

    const pending = loads.filter(l => l.status !== 'QC Completed');
    const completed = loads.filter(l => l.status === 'QC Completed');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                        <HiInboxArrowDown className="text-xl" />
                    </div>
                    Incoming Loads
                </h1>
                <p className="text-concrete-500 mt-1">View and manage waste loads arriving at your plant</p>
            </div>

            {loads.length === 0 ? (
                <div className="card text-center py-12">
                    <HiTruck className="text-5xl text-concrete-300 mx-auto mb-4" />
                    <p className="text-concrete-500">No incoming waste loads yet.</p>
                </div>
            ) : (
                <>
                    {/* Pending loads */}
                    {pending.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-concrete-800 mb-3">Pending ({pending.length})</h2>
                            <div className="space-y-4">
                                {pending.map(load => (
                                    <div key={load._id} className="card border-l-4 border-l-orange-400 animate-slide-up">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${load.wasteType === 'RCC' ? 'bg-eco-100 text-eco-800' :
                                                        load.wasteType === 'Brick Mix' ? 'bg-orange-100 text-orange-800' :
                                                            load.wasteType === 'Mixed Waste' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {load.wasteType.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-concrete-900">{load.generatorId?.name || 'Generator'}</p>
                                                    <p className="text-sm text-concrete-500">{load.wasteType} • {load.quantity} tons declared</p>
                                                    <div className="flex items-center gap-4 mt-1 text-xs text-concrete-400">
                                                        <span className="flex items-center gap-1"><HiMapPin /> {load.distance?.toFixed(1) || '?'} km away</span>
                                                        <span className="flex items-center gap-1"><HiScale /> Est. {load.estimatedCredits || '—'} GC</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`badge ${load.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        load.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                                            load.status === 'En Route' ? 'bg-indigo-100 text-indigo-800' :
                                                                load.status === 'Picked' ? 'bg-purple-100 text-purple-800' :
                                                                    'bg-eco-100 text-eco-800'
                                                    }`}>
                                                    {load.status}
                                                </span>

                                                {load.status === 'Pending' && (
                                                    <button onClick={() => updateStatus(load._id, 'Assigned')} className="btn-secondary text-xs !py-1.5 !px-3">Assign</button>
                                                )}
                                                {load.status === 'Assigned' && (
                                                    <button onClick={() => updateStatus(load._id, 'En Route')} className="btn-secondary text-xs !py-1.5 !px-3">Mark En Route</button>
                                                )}
                                                {load.status === 'En Route' && (
                                                    <button onClick={() => updateStatus(load._id, 'Picked')} className="btn-secondary text-xs !py-1.5 !px-3">Picked Up</button>
                                                )}
                                                {load.status === 'Picked' && (
                                                    <button onClick={() => updateStatus(load._id, 'Delivered')} className="btn-secondary text-xs !py-1.5 !px-3">Delivered</button>
                                                )}
                                                {load.status === 'Delivered' && (
                                                    <button onClick={() => navigate(`/recycler/qc/${load._id}`)} className="btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1">
                                                        <HiBeaker /> Start QC
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed */}
                    {completed.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-concrete-800 mb-3">Completed ({completed.length})</h2>
                            <div className="space-y-3">
                                {completed.map(load => (
                                    <div key={load._id} className="card border-l-4 border-l-eco-500 opacity-80">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-concrete-800">{load.generatorId?.name} – {load.wasteType}</p>
                                                <p className="text-xs text-concrete-500">{load.actualWeight || load.quantity} tons • Contamination: {load.contamination}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-eco-800">{load.creditIssued} GC</p>
                                                <a
                                                    href={`/api/certificate/${load._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-eco-600 hover:underline flex items-center gap-1 justify-end"
                                                >
                                                    <HiDocumentText /> Download Certificate
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
