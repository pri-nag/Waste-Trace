import { Link } from 'react-router-dom';
import { HiCube, HiArrowRight, HiShieldCheck, HiGlobeAlt, HiCurrencyRupee, HiTruck, HiBeaker, HiChartBar } from 'react-icons/hi2';

const features = [
    { icon: HiTruck, title: 'Smart Pickup', desc: 'Request C&D waste pickup with a single tap. Track your waste in real-time from site to plant.' },
    { icon: HiBeaker, title: 'Quality Check', desc: 'AI-assisted material analysis & contamination grading ensures precise credit calculation.' },
    { icon: HiCurrencyRupee, title: 'Green Credits', desc: 'Earn GC = Q × P × R × L. Trade, sell, or redeem your credits in our marketplace.' },
    { icon: HiShieldCheck, title: 'QR Passport', desc: 'Every waste load gets a unique QR code for complete traceability & certified recycling.' },
    { icon: HiGlobeAlt, title: 'Circular Economy', desc: 'Buy recycled aggregates, pavers, and sand. Close the loop on construction waste.' },
    { icon: HiChartBar, title: 'Impact Analytics', desc: 'Track CO₂ saved, tons diverted, and your segregation score on real-time dashboards.' },
];

const stats = [
    { value: '50K+', label: 'Tons Diverted' },
    { value: '12K+', label: 'Green Credits' },
    { value: '200+', label: 'Active Sites' },
    { value: '98%', label: 'Recovery Rate' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-concrete-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-eco-gradient flex items-center justify-center">
                            <HiCube className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold text-concrete-900">Waste-Trace</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-concrete-700 hover:text-eco-800 transition-colors">Login</Link>
                        <Link to="/register" className="btn-primary text-sm !py-2.5 !px-5">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-eco-50 via-white to-sand-50" />
                <div className="absolute top-20 right-0 w-96 h-96 bg-eco-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-eco-100/40 rounded-full blur-3xl" />
                <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-100 text-eco-800 text-sm font-semibold mb-6">
                            <span className="w-2 h-2 rounded-full bg-eco-500 animate-pulse" /> Circular Economy Platform
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-concrete-900 leading-tight">
                            Turn <span className="text-gradient">Construction Waste</span> Into Green Credits
                        </h1>
                        <p className="mt-6 text-lg text-concrete-600 max-w-xl mx-auto lg:mx-0">
                            Waste-Trace digitizes C&D waste tracking, enables certified recycling, and rewards responsible builders with tradeable Green Credits.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link to="/register" className="btn-primary text-base flex items-center gap-2 !px-8 !py-4">
                                Start Earning Credits <HiArrowRight />
                            </Link>
                            <Link to="/login" className="btn-secondary text-base !px-8 !py-4">
                                Login to Dashboard
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 relative animate-scale-in">
                        <div className="relative w-full max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-eco-gradient rounded-3xl rotate-3 opacity-20" />
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-concrete-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold text-concrete-500 uppercase tracking-wider">Green Credit Score</h3>
                                    <span className="badge-a">Grade A</span>
                                </div>
                                <div className="text-5xl font-black text-eco-800 mb-2">95.5 <span className="text-lg font-normal text-concrete-400">GC</span></div>
                                <div className="h-3 bg-concrete-100 rounded-full overflow-hidden mb-6">
                                    <div className="h-full bg-eco-gradient rounded-full" style={{ width: '78%' }} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-eco-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-eco-800">120</p>
                                        <p className="text-xs text-concrete-500">Tons Sent</p>
                                    </div>
                                    <div className="bg-eco-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-eco-800">60</p>
                                        <p className="text-xs text-concrete-500">CO₂ Saved (t)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats bar */}
            <section className="bg-eco-gradient py-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                            <p className="text-3xl md:text-4xl font-black text-white">{s.value}</p>
                            <p className="text-sm text-eco-200 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-concrete-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-black text-concrete-900">How Waste-Trace Works</h2>
                        <p className="mt-4 text-lg text-concrete-500 max-w-2xl mx-auto">
                            From construction site to recycling plant – every step is tracked, verified, and rewarded.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="card group hover:border-eco-200 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                                <div className="w-12 h-12 rounded-xl bg-eco-100 text-eco-800 flex items-center justify-center mb-4 group-hover:bg-eco-gradient group-hover:text-white transition-all duration-300">
                                    <f.icon className="text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-concrete-900 mb-2">{f.title}</h3>
                                <p className="text-sm text-concrete-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center card-eco">
                    <h2 className="text-3xl font-black mb-4">Ready to Build Greener?</h2>
                    <p className="text-eco-200 mb-8 max-w-xl mx-auto">
                        Join the circular economy revolution. Start tracking your C&D waste and earning Green Credits today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register?role=generator" className="bg-white text-eco-900 px-8 py-4 rounded-xl font-bold hover:bg-eco-50 transition-all flex items-center gap-2">
                            I'm a Site Owner <HiArrowRight />
                        </Link>
                        <Link to="/register?role=recycler" className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                            I'm a Recycler <HiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-concrete-900 text-concrete-400 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <HiCube className="text-eco-500 text-xl" />
                        <span className="text-white font-bold">Waste-Trace</span>
                    </div>
                    <p className="text-sm">© 2026 Waste-Trace. Built by Priyanshi Naghera. Promoting circular economy.</p>
                </div>
            </footer>
        </div>
    );
}
