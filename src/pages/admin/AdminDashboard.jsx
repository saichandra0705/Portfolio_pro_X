//D:\code software\HMS backup\templet\raghu sir project\project_X\X-frontend\vite-project\src\pages\admin\AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
// --- FIX: Using absolute paths from /src ---
import axios from '/src/api/axios'; 
import { useAuth } from '/src/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faUserPlus, 
    faChartLine, 
    faClock, 
    faKey, 
    faCog, 
    faCreditCard, 
    faFileAlt,
    faStar,
    faShieldAlt,
    faBell,
    faServer,
    faMagic
} from '@fortawesome/free-solid-svg-icons';

// --- Custom Animations (Injected) ---
const dashboardStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  .hover-lift { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .hover-lift:hover { transform: translateY(-5px); }
`;

// Helper for API errors
const handleApiError = (err, message, logout, navigate) => {
    if (err.response && err.response.status === 401) {
        console.error("Authentication error: Token expired or invalid. Logging out.");
        logout();
        navigate('/login');
    } else {
        console.error(`${message}:`, err.response?.data || err.message);
    }
};

const AdminDashboard = () => {
    const { token, logout, user, tenant } = useAuth(); 
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersThisMonth: 0,
        activeSessionsToday: 0,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const statsRes = await axios.get('/admin/dashboard-stats');
                setStats(statsRes.data);

                const activityRes = await axios.get('/admin/recent-activity');
                setRecentActivity(activityRes.data);

            } catch (err) {
                handleApiError(err, 'Failed to fetch dashboard data', logout, navigate);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, user, logout, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <FontAwesomeIcon icon={faCog} spin className="text-4xl text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Initializing Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-red-600 bg-red-50">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans selection:bg-blue-100">
            <style>{dashboardStyles}</style>
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Welcome back, {user?.name.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-slate-500 mt-1">Here's what's happening in your organization today.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-600 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            System Operational
                        </span>
                    </div>
                </div>
                
                {/* --- Quick Stats Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover-lift group cursor-default relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:rotate-6 transition-transform">
                                <FontAwesomeIcon icon={faUsers} className="text-xl" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Total Users</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalUsers}</h3>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover-lift group cursor-default relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:rotate-6 transition-transform">
                                <FontAwesomeIcon icon={faStar} className="text-xl" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Current Plan</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1 capitalize">{tenant?.plan || 'N/A'}</h3>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover-lift group cursor-default relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:rotate-6 transition-transform">
                                <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">New Users (Mo)</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.newUsersThisMonth}</h3>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover-lift group cursor-default relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:rotate-6 transition-transform">
                                <FontAwesomeIcon icon={faChartLine} className="text-xl" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Active Sessions</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.activeSessionsToday}</h3>
                        </div>
                    </div>
                </div>

                {/* --- Main Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    
                    {/* Left Column: Quick Actions & Features */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faMagic} className="text-blue-500" /> Quick Actions
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <ActionButton 
                                    icon={faUsers} label="Manage Users" color="blue" 
                                    onClick={() => navigate('/admin/manage-users')} 
                                />
                                <ActionButton 
                                    icon={faCog} label="Org Settings" color="purple" 
                                    onClick={() => navigate('/admin/settings')} 
                                />
                                <ActionButton 
                                    icon={faCreditCard} label="Subscription" color="yellow" 
                                    onClick={() => navigate('/admin/subscription')} 
                                />
                                <ActionButton 
                                    icon={faFileAlt} label="View Reports" color="green" 
                                    onClick={() => navigate('/admin/reports')} 
                                />
                            </div>
                        </div>

                        {/* New Feature: System Health / Resources (Mock) */}
                        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 text-white relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                            
                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faServer} className="text-emerald-400" /> 
                                        System Resources
                                    </h2>
                                    <p className="text-slate-400 text-sm mb-4">Storage usage and API limits for your current plan.</p>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 text-slate-300">
                                                <span>Storage ({tenant?.max_locations === -1 ? 'Unlimited' : `${tenant?.max_locations}GB`})</span>
                                                <span className="font-mono">45%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[45%] rounded-full"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 text-slate-300">
                                                <span>API Calls</span>
                                                <span className="font-mono">12%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[12%] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm transition-colors">
                                    Upgrade Plan
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Recent Activity Feed */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-800">Activity Log</h2>
                                <button className="text-xs text-blue-600 font-semibold hover:underline">View All</button>
                            </div>
                            
                            <div className="space-y-6 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                                    <div key={index} className="relative pl-10 group">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-1.5 top-1.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-full z-10 group-hover:scale-125 transition-transform"></div>
                                        
                                        <p className="text-sm text-slate-800 font-medium">
                                            <span className="text-blue-600">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {activity.target} • {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-slate-400 text-sm italic">
                                        No recent activity recorded.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- Bottom Section: Security & Alerts --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-blue-300 transition-colors cursor-pointer">
                        <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-500" /> Security Audit
                        </h3>
                        <p className="text-sm text-slate-500 mb-3">Review recent login attempts and active sessions.</p>
                        <div className="flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-md w-fit">
                            <FontAwesomeIcon icon={faCheckCircle} /> System Secure
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-yellow-300 transition-colors cursor-pointer">
                        <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBell} className="text-yellow-500" /> Notifications
                        </h3>
                        <p className="text-sm text-slate-500 mb-3">Manage system alerts and user notifications.</p>
                        <span className="text-xs text-slate-400">0 unread alerts</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Helper Component for Action Buttons ---
const ActionButton = ({ icon, label, color, onClick }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
        yellow: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
        green: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    };

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 ${colors[color]}`}
        >
            <FontAwesomeIcon icon={icon} className="text-2xl mb-2" />
            <span className="text-xs font-bold">{label}</span>
        </button>
    );
};

// Extra icons not in original import
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default AdminDashboard;