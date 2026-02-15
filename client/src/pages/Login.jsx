import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiCube, HiEnvelope, HiLockClosed } from 'react-icons/hi2';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-eco-gradient relative overflow-hidden items-center justify-center">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-black/5 rounded-full blur-3xl" />
                <div className="relative text-center px-12 animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                        <HiCube className="text-white text-4xl" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4">Welcome Back</h2>
                    <p className="text-eco-200 text-lg max-w-md">
                        Track your waste, earn green credits, and contribute to a cleaner future.
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="glass p-4 text-center">
                            <p className="text-2xl font-bold text-white">50K+</p>
                            <p className="text-xs text-eco-200">Tons Recycled</p>
                        </div>
                        <div className="glass p-4 text-center">
                            <p className="text-2xl font-bold text-white">12K+</p>
                            <p className="text-xs text-eco-200">Credits Issued</p>
                        </div>
                    </div>
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

                    <h1 className="text-3xl font-black text-concrete-900 mb-2">Sign In</h1>
                    <p className="text-concrete-500 mb-8">Enter your credentials to access your dashboard</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input !pl-11" placeholder="••••••••" required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-concrete-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-eco-800 font-semibold hover:underline">Create one</Link>
                    </p>

                    <div className="mt-8 p-4 bg-eco-50 rounded-xl border border-eco-100">
                        <p className="text-xs text-eco-800 font-semibold mb-2">Demo Accounts:</p>
                        <p className="text-xs text-concrete-600">Generator: priyanshi@wastetrace.com / password123</p>
                        <p className="text-xs text-concrete-600">Recycler: greenbuild@wastetrace.com / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
