import { useState, useEffect } from 'react';
import api from '../utils/api';
import { HiTrophy } from 'react-icons/hi2';

const medalColors = ['from-yellow-400 to-yellow-600', 'from-gray-300 to-gray-500', 'from-orange-400 to-orange-600'];

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/leaderboard').then(res => { setLeaders(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-concrete-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <HiTrophy className="text-white text-xl" />
                    </div>
                    Green Leaderboard
                </h1>
                <p className="text-concrete-500 mt-1">Top green builders ranked by total credits earned</p>
            </div>

            {leaders.length === 0 ? (
                <div className="card text-center py-12">
                    <HiTrophy className="text-5xl text-concrete-300 mx-auto mb-4" />
                    <p className="text-concrete-500">No leaderboard data yet. Start earning credits!</p>
                </div>
            ) : (
                <>
                    {/* Top 3 podium */}
                    {leaders.length >= 3 && (
                        <div className="grid grid-cols-3 gap-4 mb-2">
                            {[1, 0, 2].map(i => {
                                const l = leaders[i];
                                const isFirst = i === 0;
                                return (
                                    <div key={l.rank} className={`card text-center ${isFirst ? 'order-2 lg:-mt-4' : i === 1 ? 'order-1' : 'order-3'} animate-scale-in`}>
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${medalColors[i]} flex items-center justify-center text-white text-xl font-black mx-auto mb-3 ${isFirst ? 'w-18 h-18 text-2xl shadow-lg shadow-yellow-200' : ''}`}>
                                            {l.rank}
                                        </div>
                                        <p className="font-bold text-concrete-900 text-lg">{l.name}</p>
                                        <p className="text-2xl font-black text-eco-800 mt-1">{l.totalCreditsEarned.toFixed(1)} <span className="text-sm font-normal text-concrete-400">GC</span></p>
                                        <div className="flex justify-center gap-4 mt-3 text-xs text-concrete-500">
                                            <span>{l.totalWasteSent}t sent</span>
                                            <span>{l.co2Saved}t CO₂</span>
                                        </div>
                                        <span className={`mt-2 inline-block ${l.segregationGrade === 'A' ? 'badge-a' : l.segregationGrade === 'B' ? 'badge-b' : 'badge-c'}`}>
                                            Grade {l.segregationGrade}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Rest of the list */}
                    <div className="card">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-bold text-concrete-500 uppercase tracking-wider border-b border-concrete-100">
                                        <th className="pb-3 pr-4">Rank</th>
                                        <th className="pb-3 pr-4">Builder</th>
                                        <th className="pb-3 pr-4">Credits Earned</th>
                                        <th className="pb-3 pr-4">Waste Sent</th>
                                        <th className="pb-3 pr-4">CO₂ Saved</th>
                                        <th className="pb-3">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-concrete-50">
                                    {leaders.map(l => (
                                        <tr key={l.rank} className="hover:bg-concrete-50 transition-colors">
                                            <td className="py-3 pr-4">
                                                <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold ${l.rank <= 3 ? `bg-gradient-to-br ${medalColors[l.rank - 1]} text-white` : 'bg-concrete-100 text-concrete-700'}`}>
                                                    {l.rank}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4 font-semibold text-concrete-800">{l.name}</td>
                                            <td className="py-3 pr-4 font-bold text-eco-800">{l.totalCreditsEarned.toFixed(1)} GC</td>
                                            <td className="py-3 pr-4 text-concrete-600">{l.totalWasteSent} tons</td>
                                            <td className="py-3 pr-4 text-concrete-600">{l.co2Saved} t</td>
                                            <td className="py-3">
                                                <span className={l.segregationGrade === 'A' ? 'badge-a' : l.segregationGrade === 'B' ? 'badge-b' : 'badge-c'}>
                                                    {l.segregationGrade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
