import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import GeneratorHome from './pages/generator/GeneratorHome';
import RequestPickup from './pages/generator/RequestPickup';
import Tracking from './pages/generator/Tracking';
import Wallet from './pages/generator/Wallet';
import Marketplace from './pages/generator/Marketplace';
import IncomingLoads from './pages/recycler/IncomingLoads';
import QualityCheck from './pages/recycler/QualityCheck';
import PlantDashboard from './pages/recycler/PlantDashboard';
import PlantSettings from './pages/recycler/PlantSettings';
import Leaderboard from './pages/Leaderboard';

function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin h-10 w-10 border-4 border-eco-500 border-t-transparent rounded-full"></div></div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to={user.role === 'generator' ? '/generator' : '/recycler'} />;
    return children;
}

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === 'generator' ? '/generator' : '/recycler'} /> : <LandingPage />} />
            <Route path="/login" element={user ? <Navigate to={user.role === 'generator' ? '/generator' : '/recycler'} /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={user.role === 'generator' ? '/generator' : '/recycler'} /> : <Register />} />

            {/* Generator routes */}
            <Route path="/generator" element={<ProtectedRoute role="generator"><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<GeneratorHome />} />
                <Route path="pickup" element={<RequestPickup />} />
                <Route path="tracking" element={<Tracking />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Recycler routes */}
            <Route path="/recycler" element={<ProtectedRoute role="recycler"><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<PlantDashboard />} />
                <Route path="incoming" element={<IncomingLoads />} />
                <Route path="qc/:id" element={<QualityCheck />} />
                <Route path="settings" element={<PlantSettings />} />
                <Route path="leaderboard" element={<Leaderboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
