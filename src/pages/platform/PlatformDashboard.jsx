import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuilding, faPlusCircle, faCog, faListAlt, 
    faSpinner, faExclamationTriangle, faMoneyBillWave, 
    faArrowUp, faUsers, faChartLine, faServer, faCheckCircle, faClock
} from '@fortawesome/free-solid-svg-icons';
// Removed: axios

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

// --- MOCK DATA ---
const mockStats = {
    activeTenants: 12,
    pendingRequests: 3,
    totalRevenue: 24500,
    totalUsers: 156
};

const mockRecentTenants = [
    { id: 1, name: "Acme Corp", plan: "Enterprise", created_at: "2025-03-10T10:00:00Z" },
    { id: 2, name: "Stark Industries", plan: "Pro", created_at: "2025-03-09T14:30:00Z" },
    { id: 3, name: "Wayne Ent.", plan: "Basic", created_at: "2025-03-08T09:15:00Z" },
    { id: 4, name: "Cyberdyne Sys", plan: "Pro", created_at: "2025-03-07T11:45:00Z" },
    { id: 5, name: "Massive Dynamic", plan: "Enterprise", created_at: "2025-03-06T16:20:00Z" }
];

// --- Components ---

const StatCard = ({ icon, title, value, subtext, link, linkText, color, loading }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover-lift group relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-10 transition-transform group-hover:scale-110 ${color.replace('bg-', 'bg-')}`}></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                        <FontAwesomeIcon icon={icon} className={`text-xl ${color.replace('bg-', 'text-')}`} />
                    </div>
                    {subtext && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center border border-emerald-100">
                            <FontAwesomeIcon icon={faArrowUp} className="mr-1 text-[10px]" /> {subtext}
                        </span>
                    )}
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
                <div className="text-3xl font-extrabold text-slate-800 mt-2 h-10 flex items-center">
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-slate-200" /> : value}
                </div>
            </div>
            {link && (
                <Link to={link} className={`text-sm font-bold mt-6 flex items-center ${color.replace('bg-', 'text-')} opacity-80 hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-300`}>
                    {linkText} &rarr;
                </Link>
            )}
        </div>
    </div>
);

const ActivityItem = ({ title, time, plan }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg -mx-2">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mr-4 shadow-sm">
                {title.charAt(12).toUpperCase()} 
            </div>
            <div>
                <p className="text-sm text-slate-700 font-bold">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-[10px]" /> {time}
                </p>
            </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide border 
            ${plan === 'Enterprise' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
              plan === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
              'bg-slate-100 text-slate-500 border-slate-200'}`}>
            {plan}
        </span>
    </div>
);

// --- Main Page ---

const PlatformDashboard = () => {
    const [loading, setLoading] = useState(true);

    // Simulate loading effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-600 selection:bg-blue-100">
            <style>{dashboardStyles}</style>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Platform Overview</h1>
                        <p className="text-slate-500 mt-1">Welcome back, Administrator. Here's your system at a glance.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/platform/settings" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2">
                            <FontAwesomeIcon icon={faCog} /> Settings
                        </Link>
                        <Link to="/platform/create-tenant" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlusCircle} /> New Tenant
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={faBuilding}
                        title="Active Tenants"
                        value={mockStats.activeTenants}
                        subtext="+2 this week"
                        link="/platform/tenants"
                        linkText="Manage Tenants"
                        color="bg-blue-600"
                        loading={loading}
                    />
                    <StatCard
                        icon={faMoneyBillWave}
                        title="Est. Monthly Revenue"
                        value={`₹${mockStats.totalRevenue.toLocaleString()}`}
                        subtext="+12% vs last mo"
                        link="/platform/plans"
                        linkText="View Plans"
                        color="bg-emerald-500"
                        loading={loading}
                    />
                    <StatCard
                        icon={faListAlt}
                        title="Pending Requests"
                        value={mockStats.pendingRequests}
                        link="/platform/tenants"
                        linkText="Review Requests"
                        color="bg-amber-500"
                        loading={loading}
                    />
                    <StatCard
                        icon={faUsers}
                        title="Total Users"
                        value={mockStats.totalUsers}
                        subtext="Across all orgs"
                        link="#"
                        linkText="View Analytics"
                        color="bg-purple-600"
                        loading={loading}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Col: Activity Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Tenants Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-slate-800">Recent Tenant Onboarding</h2>
                                <Link to="/platform/tenants" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                    View All
                                </Link>
                            </div>
                            
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <FontAwesomeIcon icon={faSpinner} spin className="text-3xl mb-3 text-blue-500" />
                                    <p>Loading activity...</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {mockRecentTenants.map(tenant => (
                                        <ActivityItem 
                                            key={tenant.id} 
                                            title={`New Tenant: ${tenant.name}`} 
                                            time={new Date(tenant.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                                            plan={tenant.plan}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Analytics Preview */}
                        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faChartLine} className="text-emerald-400" /> 
                                        System Performance
                                    </h2>
                                    <p className="text-slate-400 text-sm mb-6 max-w-md">
                                        Real-time overview of platform resource usage and database health across all tenant nodes.
                                    </p>
                                    
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Avg. Response</p>
                                            <p className="text-2xl font-mono font-bold text-blue-400">124ms</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">DB Load</p>
                                            <p className="text-2xl font-mono font-bold text-emerald-400">12%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Uptime</p>
                                            <p className="text-2xl font-mono font-bold text-white">99.99%</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm transition-colors border border-white/10">
                                    View Detailed Metrics
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: System Health & Quick Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* System Health Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">System Status</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="flex items-center">
                                        <div className="relative flex h-2.5 w-2.5 mr-3">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-800">Database Cluster</span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm">Healthy</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="flex items-center">
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-3"></div>
                                        <span className="text-sm font-bold text-emerald-800">API Gateway</span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm">Operational</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faServer} className="text-blue-500 mr-3 text-xs" />
                                        <span className="text-sm font-bold text-blue-800">Storage (S3)</span>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm">45% Used</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Navigation</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <Link to="/platform/plans" className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                        <FontAwesomeIcon icon={faMoneyBillWave} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Manage Plans</p>
                                        <p className="text-xs text-slate-400">Update pricing & limits</p>
                                    </div>
                                </Link>
                                <Link to="/platform/settings" className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                        <FontAwesomeIcon icon={faCog} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Global Settings</p>
                                        <p className="text-xs text-slate-400">Branding & configs</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformDashboard;