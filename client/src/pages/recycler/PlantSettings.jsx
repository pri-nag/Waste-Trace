import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiCog6Tooth, HiMapPin, HiCheckCircle, HiPlusCircle } from 'react-icons/hi2';

export default function PlantSettings() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', address: '', lat: '', lng: '', capacity: '100' });
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/plants/my').then(res => { setPlants(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(''); setErr(''); setSaving(true);
        try {
            const payload = {
                name: form.name,
                address: form.address,
                location: { lat: Number(form.lat), lng: Number(form.lng) },
                capacity: Number(form.capacity),
            };
            if (form._id) {
                const res = await api.put(`/plants/${form._id}`, payload);
                setPlants(plants.map(p => p._id === form._id ? res.data : p));
                setMsg('Plant updated successfully!');
            } else {
                const res = await api.post('/plants', payload);
                setPlants([...plants, res.data]);
                setMsg('Plant registered successfully!');
            }
            setShowForm(false);
            setForm({ name: '', address: '', lat: '', lng: '', capacity: '100' });
        } catch (e) { setErr(e.response?.data?.error || 'Failed'); }
        finally { setSaving(false); }
    };

    const editPlant = (p) => {
        setForm({ _id: p._id, name: p.name, address: p.address || '', lat: String(p.location.lat), lng: String(p.location.lng), capacity: String(p.capacity) });
        setShowForm(true);
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-concrete-200 text-concrete-700 flex items-center justify-center">
                            <HiCog6Tooth className="text-xl" />
                        </div>
                        Plant Settings
                    </h1>
                    <p className="text-concrete-500 mt-1">Manage your recycling plant details</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setForm({ name: '', address: '', lat: '', lng: '', capacity: '100' }); }} className="btn-primary flex items-center gap-2">
                    <HiPlusCircle /> Add Plant
                </button>
            </div>

            {msg && <div className="bg-eco-50 border border-eco-200 text-eco-800 px-5 py-3 rounded-xl text-sm flex items-center gap-2"><HiCheckCircle /> {msg}</div>}
            {err && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">{err}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} className="card space-y-4 animate-slide-up">
                    <h3 className="font-bold text-concrete-900">{form._id ? 'Edit Plant' : 'Register New Plant'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Plant Name</label>
                            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="GreenBuild Recycling" required />
                        </div>
                        <div>
                            <label className="label">Address</label>
                            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input" placeholder="Sarkhej Highway, Ahmedabad" />
                        </div>
                        <div>
                            <label className="label">Latitude</label>
                            <input type="number" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} className="input" step="any" placeholder="23.0733" required />
                        </div>
                        <div>
                            <label className="label">Longitude</label>
                            <input type="number" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} className="input" step="any" placeholder="72.5177" required />
                        </div>
                        <div>
                            <label className="label">Capacity (tons/day)</label>
                            <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} className="input" min="1" required />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : form._id ? 'Update Plant' : 'Register Plant'}</button>
                        <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            )}

            {/* Plant list */}
            {plants.length === 0 && !showForm ? (
                <div className="card text-center py-12">
                    <HiMapPin className="text-5xl text-concrete-300 mx-auto mb-4" />
                    <p className="text-concrete-500">No plants registered. Click "Add Plant" to get started.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {plants.map(plant => (
                        <div key={plant._id} className="card hover:border-eco-200">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-concrete-900">{plant.name}</h3>
                                    <p className="text-sm text-concrete-500 flex items-center gap-1"><HiMapPin className="text-eco-600" /> {plant.address || `${plant.location.lat}, ${plant.location.lng}`}</p>
                                </div>
                                <button onClick={() => editPlant(plant)} className="btn-secondary text-xs !py-1.5 !px-3">Edit</button>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-concrete-50 rounded-xl p-3">
                                    <p className="text-lg font-bold text-concrete-900">{plant.capacity}</p>
                                    <p className="text-xs text-concrete-500">Capacity (t/day)</p>
                                </div>
                                <div className="bg-concrete-50 rounded-xl p-3">
                                    <p className="text-lg font-bold text-concrete-900">{plant.totalWasteReceived}</p>
                                    <p className="text-xs text-concrete-500">Total Received</p>
                                </div>
                                <div className="bg-concrete-50 rounded-xl p-3">
                                    <p className="text-lg font-bold text-eco-800">{plant.totalCreditsIssued.toFixed(1)}</p>
                                    <p className="text-xs text-concrete-500">Credits Issued</p>
                                </div>
                            </div>
                            {/* Capacity bar */}
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-concrete-500 mb-1">
                                    <span>Utilization</span>
                                    <span>{plant.currentUtilization.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-concrete-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all ${plant.currentUtilization > 80 ? 'bg-red-500' : plant.currentUtilization > 50 ? 'bg-yellow-500' : 'bg-eco-500'}`} style={{ width: `${Math.min(100, plant.currentUtilization)}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
