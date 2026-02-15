import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiHome, HiScale, HiCube, HiCurrencyRupee, HiClipboardDocumentList, HiCheckCircle, HiClock, HiChartBar } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1B5E20', '#FF9800', '#2196F3', '#9C27B0', '#F44336'];

export default function PlantDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/waste/recycler-stats').then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;
    if (!stats) return <div className="card text-center py-12"><p className="text-concrete-500">No data available. Register a plant first.</p></div>;

    // Waste type distribution for pie chart
    const typeCounts = {};
    (stats.wasteSources || []).forEach(s => { typeCounts[s.type] = (typeCounts[s.type] || 0) + s.quantity; });
    const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(1)) }));

    // Bar chart data (monthly mock)
    const barData = [
        { name: 'Week 1', received: Math.round(stats.totalWasteReceived * 0.2), credits: Math.round(stats.creditsIssued * 0.2) },
        { name: 'Week 2', received: Math.round(stats.totalWasteReceived * 0.25), credits: Math.round(stats.creditsIssued * 0.25) },
        { name: 'Week 3', received: Math.round(stats.totalWasteReceived * 0.3), credits: Math.round(stats.creditsIssued * 0.3) },
        { name: 'Week 4', received: Math.round(stats.totalWasteReceived * 0.25), credits: Math.round(stats.creditsIssued * 0.25) },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-eco-gradient flex items-center justify-center">
                        <HiHome className="text-white text-xl" />
                    </div>
                    Plant Dashboard
                </h1>
                <p className="text-concrete-500 mt-1">Overview of your recycling plant performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card animate-slide-up">
                    <div className="w-12 h-12 rounded-xl bg-eco-100 text-eco-800 flex items-center justify-center flex-shrink-0">
                        <HiScale className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">{stats.wasteReceivedToday}</p>
                        <p className="text-xs text-concrete-500">Received Today (t)</p>
                    </div>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                        <HiChartBar className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">{stats.capacityUtilization.toFixed(0)}%</p>
                        <p className="text-xs text-concrete-500">Capacity Utilization</p>
                    </div>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center flex-shrink-0">
                        <HiCube className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">{stats.creditsIssued.toFixed(1)}</p>
                        <p className="text-xs text-concrete-500">Credits Issued</p>
                    </div>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <HiCurrencyRupee className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">₹{stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-concrete-500">Revenue</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-bold text-concrete-900 mb-4">Weekly Performance</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" fontSize={12} stroke="#9e9e9e" />
                            <YAxis fontSize={12} stroke="#9e9e9e" />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="received" fill="#1B5E20" radius={[6, 6, 0, 0]} name="Waste Received (t)" />
                            <Bar dataKey="credits" fill="#FF9800" radius={[6, 6, 0, 0]} name="Credits Issued" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold text-concrete-900 mb-4">Waste Distribution</h3>
                    {pieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={5}>
                                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2">
                                {pieData.map((d, i) => (
                                    <div key={d.name} className="flex items-center gap-2 text-sm">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-concrete-600 flex-1">{d.name}</span>
                                        <span className="font-bold text-concrete-800">{d.value}t</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-concrete-400 text-center py-8">No waste data yet</p>
                    )}
                </div>
            </div>

            {/* Request overview */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="card text-center">
                    <HiClipboardDocumentList className="text-3xl text-concrete-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-concrete-900">{stats.totalRequests}</p>
                    <p className="text-sm text-concrete-500">Total Requests</p>
                </div>
                <div className="card text-center">
                    <HiCheckCircle className="text-3xl text-eco-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-concrete-900">{stats.completedRequests}</p>
                    <p className="text-sm text-concrete-500">Completed</p>
                </div>
                <div className="card text-center">
                    <HiClock className="text-3xl text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-concrete-900">{stats.pendingRequests}</p>
                    <p className="text-sm text-concrete-500">Pending</p>
                </div>
            </div>
        </div>
    );
}
