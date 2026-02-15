import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiCube, HiEnvelope, HiLockClosed, HiUser, HiBuildingOffice2, HiWrenchScrewdriver } from 'react-icons/hi2';

export default function Register() {
    const { register } = useAuth();
    const [searchParams] = useSearchParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(searchParams.get('role') || 'generator');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password, role);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-dark-gradient relative overflow-hidden items-center justify-center">
                <div className="absolute top-20 left-10 w-64 h-64 bg-eco-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-eco-700/10 rounded-full blur-3xl" />
                <div className="relative text-center px-12 animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                        <HiCube className="text-eco-400 text-4xl" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4">Join the Movement</h2>
                    <p className="text-concrete-400 text-lg max-w-md">
                        Whether you're a builder or a recycler, start your journey toward zero construction waste.
                    </p>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-concrete-50">
                <div className="w-full max-w-md animate-slide-up">
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-eco-gradient flex items-center justify-center">
                            <HiCube className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold text-concrete-900">Waste-Trace</span>
                    </div>

                    <h1 className="text-3xl font-black text-concrete-900 mb-2">Create Account</h1>
                    <p className="text-concrete-500 mb-8">Choose your role and start earning green credits</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role selector */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('generator')}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'generator' ? 'border-eco-500 bg-eco-50 text-eco-800' : 'border-concrete-200 text-concrete-500 hover:border-concrete-300'}`}
                        >
                            <HiBuildingOffice2 className="text-2xl mx-auto mb-2" />
                            <p className="text-sm font-bold">Site Owner</p>
                            <p className="text-xs mt-1">Generate & send waste</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('recycler')}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${role === 'recycler' ? 'border-eco-500 bg-eco-50 text-eco-800' : 'border-concrete-200 text-concrete-500 hover:border-concrete-300'}`}
                        >
                            <HiWrenchScrewdriver className="text-2xl mx-auto mb-2" />
                            <p className="text-sm font-bold">Recycler</p>
                            <p className="text-xs mt-1">Process & recycle waste</p>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Full Name</label>
                            <div className="relative">
                                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-concrete-400" />
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input !pl-11" placeholder="Priyanshi Naghera" required />
                            </div>
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <div className="relative">
                                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-concrete-400" />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input !pl-11" placeholder="you@example.com" required />
                            </div>
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-concrete-400" />
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input !pl-11" placeholder="Minimum 6 characters" required minLength={6} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? 'Creating account...' : `Register as ${role === 'generator' ? 'Site Owner' : 'Recycler'}`}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-concrete-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-eco-800 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
