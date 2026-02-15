import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiHome, HiTruck, HiCreditCard, HiShoppingCart, HiTrophy,
    HiClipboardDocumentList, HiBeaker, HiCog6Tooth, HiArrowRightOnRectangle,
    HiInboxArrowDown, HiBars3, HiXMark, HiCube,
} from 'react-icons/hi2';
import { useState } from 'react';

const generatorLinks = [
    { to: '/generator', icon: HiHome, label: 'Dashboard', end: true },
    { to: '/generator/pickup', icon: HiTruck, label: 'Request Pickup' },
    { to: '/generator/tracking', icon: HiClipboardDocumentList, label: 'Tracking' },
    { to: '/generator/wallet', icon: HiCreditCard, label: 'Green Wallet' },
    { to: '/generator/marketplace', icon: HiShoppingCart, label: 'Marketplace' },
    { to: '/generator/leaderboard', icon: HiTrophy, label: 'Leaderboard' },
];

const recyclerLinks = [
    { to: '/recycler', icon: HiHome, label: 'Dashboard', end: true },
    { to: '/recycler/incoming', icon: HiInboxArrowDown, label: 'Incoming Loads' },
    { to: '/recycler/settings', icon: HiCog6Tooth, label: 'Plant Settings' },
    { to: '/recycler/leaderboard', icon: HiTrophy, label: 'Leaderboard' },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const links = user?.role === 'generator' ? generatorLinks : recyclerLinks;

    return (
        <div className="flex min-h-screen bg-concrete-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-concrete-900 via-concrete-800 to-eco-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-eco-gradient flex items-center justify-center">
                        <HiCube className="text-xl" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">Waste-Trace</h1>
                        <p className="text-xs text-eco-300 capitalize">{user?.role} Portal</p>
                    </div>
                    <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
                        <HiXMark className="text-2xl" />
                    </button>
                </div>

                {/* User info */}
                <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-eco-700 flex items-center justify-center text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-concrete-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-eco-700/40 text-eco-200 shadow-lg shadow-eco-900/20'
                                    : 'text-concrete-300 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <link.icon className="text-lg flex-shrink-0" />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-4 py-4 border-t border-white/10">
                    <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all w-full">
                        <HiArrowRightOnRectangle className="text-lg" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main */}
            <main className="flex-1 min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-concrete-100 px-6 py-4 flex items-center gap-4">
                    <button className="lg:hidden text-concrete-700" onClick={() => setSidebarOpen(true)}>
                        <HiBars3 className="text-2xl" />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-concrete-800">{user?.name}</p>
                            <p className="text-xs text-concrete-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-eco-gradient flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="p-6 animate-fade-in">
                    <Outlet />
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiArrowRightOnRectangle className="text-3xl text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                            <p className="text-gray-500 mb-6">Are you sure you want to log out of your account?</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowLogoutConfirm(false);
                                    }}
                                    className="px-4 py-2 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
