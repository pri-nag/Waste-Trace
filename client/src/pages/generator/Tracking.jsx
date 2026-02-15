import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiClipboardDocumentList, HiTruck, HiCheckCircle, HiClock, HiArrowPath, HiBeaker, HiQrCode } from 'react-icons/hi2';

const statusSteps = ['Pending', 'Assigned', 'En Route', 'Picked', 'Delivered', 'QC Completed'];
const statusIcons = {
    'Pending': HiClock,
    'Assigned': HiClipboardDocumentList,
    'En Route': HiTruck,
    'Picked': HiArrowPath,
    'Delivered': HiCheckCircle,
    'QC Completed': HiBeaker,
};

function StatusTimeline({ currentStatus }) {
    const currentIdx = statusSteps.indexOf(currentStatus);

    return (
        <div className="flex items-center gap-1 w-full">
            {statusSteps.map((step, i) => {
                const Icon = statusIcons[step];
                const isComplete = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                    <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${isCurrent ? 'bg-eco-gradient text-white shadow-lg shadow-eco-200 scale-110' :
                                    isComplete ? 'bg-eco-100 text-eco-800' : 'bg-concrete-100 text-concrete-400'
                                }`}>
                                <Icon className="text-sm" />
                            </div>
                            <span className={`text-[10px] mt-1 text-center leading-tight ${isCurrent ? 'font-bold text-eco-800' : isComplete ? 'text-eco-700' : 'text-concrete-400'}`}>
                                {step}
                            </span>
                        </div>
                        {i < statusSteps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 rounded ${i < currentIdx ? 'bg-eco-400' : 'bg-concrete-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function Tracking() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQr, setShowQr] = useState(null);

    useEffect(() => {
        api.get('/waste/my').then(res => { setRequests(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <HiClipboardDocumentList className="text-xl" />
                    </div>
                    Waste Tracking
                </h1>
                <p className="text-concrete-500 mt-1">Track the status of all your pickup requests</p>
            </div>

            {requests.length === 0 ? (
                <div className="card text-center py-12">
                    <HiTruck className="text-5xl text-concrete-300 mx-auto mb-4" />
                    <p className="text-concrete-500">No pickup requests yet. Create one from the Request Pickup page!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(r => (
                        <div key={r._id} className="card animate-slide-up">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${r.wasteType === 'RCC' ? 'bg-eco-100 text-eco-800' :
                                            r.wasteType === 'Brick Mix' ? 'bg-orange-100 text-orange-800' :
                                                r.wasteType === 'Mixed Waste' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                        {r.wasteType.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-concrete-900">{r.wasteType}</p>
                                        <p className="text-xs text-concrete-500">{r.actualWeight || r.quantity} tons • {r.plantId?.name || 'Plant'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {r.qrCode && (
                                        <button onClick={() => setShowQr(showQr === r._id ? null : r._id)} className="btn-secondary text-xs !py-2 !px-3 flex items-center gap-1">
                                            <HiQrCode /> QR
                                        </button>
                                    )}
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-eco-800">{r.creditIssued || r.estimatedCredits || 0} GC</p>
                                        <p className="text-xs text-concrete-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>

                            <StatusTimeline currentStatus={r.status} />

                            {showQr === r._id && r.qrCode && (
                                <div className="mt-4 flex justify-center animate-scale-in">
                                    <div className="bg-white p-4 rounded-xl border border-concrete-200 text-center">
                                        <img src={r.qrCode} alt="QR Code" className="w-32 h-32 mx-auto" />
                                        <p className="text-xs text-concrete-500 mt-2">Waste Passport QR</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
