import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { HiCube, HiScale, HiCurrencyRupee, HiCloud, HiTruck, HiArrowTrendingUp, HiShieldCheck } from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GeneratorHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [statsRes, reqRes] = await Promise.all([
                    api.get('/waste/stats'),
                    api.get('/waste/my'),
                ]);
                setStats(statsRes.data);
                setRequests(reqRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;

    const gradeClass = stats?.segregationGrade === 'A' ? 'badge-a' : stats?.segregationGrade === 'B' ? 'badge-b' : 'badge-c';

    // Mock chart data from requests
    const chartData = requests.slice(0, 7).reverse().map((r, i) => ({
        name: new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        tons: r.actualWeight || r.quantity,
        credits: r.creditIssued || r.estimatedCredits || 0,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-concrete-500 mt-1">Here's your environmental impact overview</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card animate-slide-up">
                    <div className="w-12 h-12 rounded-xl bg-eco-100 text-eco-800 flex items-center justify-center flex-shrink-0">
                        <HiTruck className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">{stats?.wasteSentThisMonth || 0}</p>
                        <p className="text-xs text-concrete-500">Tons Sent This Month</p>
                    </div>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center flex-shrink-0">
                        <HiCurrencyRupee className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">{stats?.creditsAvailable?.toFixed(1) || 0}</p>
                        <p className="text-xs text-concrete-500">Credits Available</p>
                    </div>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                        <HiCloud className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">{stats?.co2Saved?.toFixed(1) || 0}t</p>
                        <p className="text-xs text-concrete-500">CO₂ Saved</p>
                    </div>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <HiShieldCheck className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-concrete-900">
                            <span className={gradeClass}>{stats?.segregationGrade || 'N/A'}</span>
                        </p>
                        <p className="text-xs text-concrete-500">Segregation Score</p>
                    </div>
                </div>
            </div>

            {/* Chart + Recent */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-bold text-concrete-900 mb-4 flex items-center gap-2">
                        <HiArrowTrendingUp className="text-eco-600" /> Waste & Credit Trend
                    </h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="gTons" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#1B5E20" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gCredits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF9800" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF9800" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" fontSize={12} stroke="#9e9e9e" />
                                <YAxis fontSize={12} stroke="#9e9e9e" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="tons" stroke="#1B5E20" fill="url(#gTons)" strokeWidth={2} name="Tons" />
                                <Area type="monotone" dataKey="credits" stroke="#FF9800" fill="url(#gCredits)" strokeWidth={2} name="Credits" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-concrete-400">No data yet. Request your first pickup!</div>
                    )}
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold text-concrete-900 mb-4">Impact Summary</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-concrete-500">Total Waste Sent</span>
                                <span className="font-bold text-concrete-800">{stats?.totalWasteSent || 0} tons</span>
                            </div>
                            <div className="h-2 bg-concrete-100 rounded-full overflow-hidden">
                                <div className="h-full bg-eco-gradient rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats?.totalWasteSent || 0) / 2)}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-concrete-500">Total Credits Earned</span>
                                <span className="font-bold text-concrete-800">{stats?.totalCreditsEarned?.toFixed(1) || 0} GC</span>
                            </div>
                            <div className="h-2 bg-concrete-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats?.totalCreditsEarned || 0))}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-concrete-500">CO₂ Prevented</span>
                                <span className="font-bold text-concrete-800">{stats?.co2Saved?.toFixed(1) || 0} t</span>
                            </div>
                            <div className="h-2 bg-concrete-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats?.co2Saved || 0) * 1.5)}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-concrete-500">Total Requests</span>
                                <span className="font-bold text-concrete-800">{stats?.totalRequests || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent requests */}
            <div className="card">
                <h3 className="text-lg font-bold text-concrete-900 mb-4">Recent Requests</h3>
                {requests.length === 0 ? (
                    <p className="text-concrete-400 text-center py-8">No pickup requests yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-concrete-500 uppercase tracking-wider border-b border-concrete-100">
                                    <th className="pb-3 pr-4">Type</th>
                                    <th className="pb-3 pr-4">Quantity</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4">Credits</th>
                                    <th className="pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-concrete-50">
                                {requests.slice(0, 5).map(r => (
                                    <tr key={r._id} className="text-sm hover:bg-concrete-50 transition-colors">
                                        <td className="py-3 pr-4 font-semibold text-concrete-800">{r.wasteType}</td>
                                        <td className="py-3 pr-4 text-concrete-600">{r.actualWeight || r.quantity} tons</td>
                                        <td className="py-3 pr-4">
                                            <span className={`badge ${r.status === 'QC Completed' ? 'bg-eco-100 text-eco-800' : r.status === 'Delivered' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 font-semibold text-eco-800">{r.creditIssued || r.estimatedCredits || '—'} GC</td>
                                        <td className="py-3 text-concrete-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
