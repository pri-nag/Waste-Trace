import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiShoppingCart, HiCube, HiCheckCircle } from 'react-icons/hi2';

const categoryColors = {
    Aggregates: 'bg-eco-100 text-eco-800',
    Pavers: 'bg-blue-100 text-blue-800',
    Sand: 'bg-yellow-100 text-yellow-800',
    Bricks: 'bg-orange-100 text-orange-800',
    Other: 'bg-purple-100 text-purple-800',
};

export default function Marketplace() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [redeeming, setRedeeming] = useState(null);

    useEffect(() => {
        api.get('/marketplace').then(res => { setItems(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const redeem = async (id) => {
        setMsg(''); setErr(''); setRedeeming(id);
        try {
            const res = await api.post(`/marketplace/${id}/redeem`);
            setMsg(res.data.message);
            setItems(items.map(i => i._id === id ? { ...i, stock: i.stock - 1 } : i));
        } catch (e) {
            setErr(e.response?.data?.error || 'Redemption failed');
        } finally {
            setRedeeming(null);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <HiShoppingCart className="text-xl" />
                    </div>
                    Marketplace
                </h1>
                <p className="text-concrete-500 mt-1">Redeem Green Credits for recycled construction materials</p>
            </div>

            {msg && <div className="bg-eco-50 border border-eco-200 text-eco-800 px-5 py-3 rounded-xl text-sm flex items-center gap-2"><HiCheckCircle /> {msg}</div>}
            {err && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">{err}</div>}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item._id} className="card group hover:border-eco-200 animate-slide-up">
                        <div className="h-40 bg-gradient-to-br from-concrete-100 to-concrete-50 rounded-xl mb-4 flex items-center justify-center">
                            <HiCube className="text-5xl text-concrete-300 group-hover:text-eco-300 transition-colors" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`badge ${categoryColors[item.category] || 'bg-concrete-100 text-concrete-700'}`}>
                                {item.category}
                            </span>
                            <span className="text-xs text-concrete-400">{item.stock} in stock</span>
                        </div>
                        <h3 className="text-lg font-bold text-concrete-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-concrete-500 mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-black text-eco-800">{item.priceInCredits} <span className="text-sm font-normal text-concrete-400">GC</span></p>
                            <button
                                onClick={() => redeem(item._id)}
                                disabled={redeeming === item._id || item.stock <= 0}
                                className="btn-primary !py-2 !px-4 text-sm"
                            >
                                {redeeming === item._id ? 'Redeeming...' : item.stock <= 0 ? 'Sold Out' : 'Redeem'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
