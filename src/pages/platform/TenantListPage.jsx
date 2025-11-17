import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// import axios from '../../api/axios'; // Removed for Demo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, faSearch, faTrashAlt, faEdit, faSyncAlt, faExternalLinkAlt, 
    faBuilding, faSpinner, faExclamationTriangle, faTimes, faCheckCircle, 
    faCrown, faCalendarAlt, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const MOCK_PLANS = [
    { plan_key: 'basic', name: 'Basic', price_monthly: 0, price_yearly: 0, price_quarterly: 0, price_half_yearly: 0 },
    { plan_key: 'starter', name: 'Starter', price_monthly: 2999, price_yearly: 29990, price_quarterly: 8500, price_half_yearly: 16000 },
    { plan_key: 'pro', name: 'Pro', price_monthly: 5999, price_yearly: 59990, price_quarterly: 17000, price_half_yearly: 32000 },
    { plan_key: 'enterprise', name: 'Enterprise', price_monthly: 14999, price_yearly: 149990, price_quarterly: 42000, price_half_yearly: 80000 }
];

const MOCK_TENANTS = [
    { id: 101, name: 'Acme Corp', subdomain: 'acme', status: 'active', plan: 'enterprise', billing_cycle: 'yearly', created_at: '2024-01-15T10:00:00Z', custom_domain: 'portal.acme.com' },
    { id: 102, name: 'Stark Industries', subdomain: 'stark', status: 'active', plan: 'pro', billing_cycle: 'monthly', created_at: '2024-02-20T14:30:00Z', custom_domain: null },
    { id: 103, name: 'Wayne Enterprises', subdomain: 'wayne', status: 'active', plan: 'enterprise', billing_cycle: 'quarterly', created_at: '2024-03-05T09:15:00Z', custom_domain: 'secure.wayne.com' },
    { id: 104, name: 'Cyberdyne Systems', subdomain: 'cyberdyne', status: 'suspended', plan: 'pro', billing_cycle: 'monthly', created_at: '2024-03-10T11:45:00Z', custom_domain: null },
    { id: 105, name: 'Massive Dynamic', subdomain: 'mdynamic', status: 'active', plan: 'starter', billing_cycle: 'monthly', created_at: '2024-04-01T16:20:00Z', custom_domain: null },
    { id: 106, name: 'Umbrella Corp', subdomain: 'umbrella', status: 'pending', plan: 'basic', billing_cycle: 'monthly', created_at: '2024-04-12T08:00:00Z', custom_domain: null },
    { id: 107, name: 'Aperture Science', subdomain: 'aperture', status: 'active', plan: 'pro', billing_cycle: 'yearly', created_at: '2024-05-05T10:00:00Z', custom_domain: 'testing.aperture.com' },
    { id: 108, name: 'Black Mesa', subdomain: 'blackmesa', status: 'active', plan: 'starter', billing_cycle: 'half_yearly', created_at: '2024-05-15T12:30:00Z', custom_domain: null },
    { id: 109, name: 'InGen', subdomain: 'ingen', status: 'active', plan: 'pro', billing_cycle: 'monthly', created_at: '2024-06-01T09:00:00Z', custom_domain: null },
    { id: 110, name: 'Tyrell Corp', subdomain: 'tyrell', status: 'active', plan: 'enterprise', billing_cycle: 'yearly', created_at: '2024-06-10T15:45:00Z', custom_domain: 'nexus.tyrell.com' },
    { id: 111, name: 'Globex', subdomain: 'globex', status: 'active', plan: 'starter', billing_cycle: 'monthly', created_at: '2024-06-20T11:00:00Z', custom_domain: null },
    { id: 112, name: 'Soylent Corp', subdomain: 'soylent', status: 'suspended', plan: 'basic', billing_cycle: 'monthly', created_at: '2024-07-01T10:00:00Z', custom_domain: null },
];

// --- Constants ---
const ITEMS_PER_PAGE = 10;

// --- Custom Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

const TenantListPage = () => {
    const [tenants, setTenants] = useState([]);
    const [plans, setPlans] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // --- Renewal Modal State ---
    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [renewalForm, setRenewalForm] = useState({
        plan: '',
        billingCycle: 'monthly'
    });
    const [renewing, setRenewing] = useState(false);

    // Simulate Fetching Data
    useEffect(() => {
        // Simulate network delay
        const timer = setTimeout(() => {
            setTenants(MOCK_TENANTS);
            setPlans(MOCK_PLANS);
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    // --- Filtering & Pagination ---
    const filteredTenants = useMemo(() => {
        return tenants.filter(tenant => 
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tenants, searchTerm]);

    const paginatedTenants = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTenants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTenants, currentPage]);

    const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);

    // --- Handlers ---

    const handleDelete = async (tenantId, tenantName) => {
        const isConfirmed = window.confirm(
            `[DEMO MODE]\nAre you sure you want to delete ${tenantName}?\nThis will remove it from the list locally.`
        );
        
        if (!isConfirmed) return;
        
        setLoading(true);
        setTimeout(() => {
            setTenants(prev => prev.filter(t => t.id !== tenantId));
            toast.success(`Tenant ${tenantName} deleted successfully (Demo).`);
            setLoading(false);
        }, 800);
    };

    // Open Renewal Modal
    const openRenewModal = (tenant) => {
        setSelectedTenant(tenant);
        setRenewalForm({
            plan: tenant.plan || 'basic',
            billingCycle: tenant.billing_cycle || 'monthly'
        });
        setIsRenewModalOpen(true);
    };

    // Handle Renewal Form Changes
    const handleRenewalChange = (e) => {
        const { name, value } = e.target;
        setRenewalForm(prev => ({ ...prev, [name]: value }));
    };

    // Calculate Price for Modal
    const calculatedPrice = useMemo(() => {
        if (!selectedTenant || !renewalForm.plan) return 0;
        
        const planObj = plans.find(p => p.plan_key === renewalForm.plan);
        if (!planObj) return 0; 

        const keyMap = {
            monthly: 'price_monthly',
            quarterly: 'price_quarterly',
            half_yearly: 'price_half_yearly',
            yearly: 'price_yearly'
        };
        
        return parseFloat(planObj[keyMap[renewalForm.billingCycle]] || 0).toFixed(2);
    }, [plans, renewalForm, selectedTenant]);

    // Submit Renewal (Mock)
    const handleRenewalSubmit = async (e) => {
        e.preventDefault();
        setRenewing(true);
        
        setTimeout(() => {
            // Update local state
            setTenants(prev => prev.map(t => 
                t.id === selectedTenant.id 
                ? { ...t, plan: renewalForm.plan, billing_cycle: renewalForm.billingCycle } 
                : t
            ));

            toast.success(`Subscription updated for ${selectedTenant.name} (Demo)!`);
            setIsRenewModalOpen(false);
            setRenewing(false);
        }, 1000);
    };

    // --- Helpers ---

    const getRenewalDate = (createdAt, cycle) => {
        if (!createdAt) return 'N/A';
        const date = new Date(createdAt);
        switch (cycle) {
            case 'monthly': date.setMonth(date.getMonth() + 1); break;
            case 'quarterly': date.setMonth(date.getMonth() + 3); break;
            case 'half_yearly': date.setMonth(date.getMonth() + 6); break;
            case 'yearly': date.setFullYear(date.getFullYear() + 1); break;
            default: return 'N/A';
        }
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const statusBadge = (status) => {
        const styles = {
            active: "bg-emerald-100 text-emerald-700 border-emerald-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            suspended: "bg-rose-100 text-rose-700 border-rose-200",
        };
        return (
            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                {status?.toUpperCase() || 'UNKNOWN'}
            </span>
        );
    };

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans text-slate-600 selection:bg-blue-100">
            <style>{pageStyles}</style>
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Manage Tenants</h1>
                        <p className="text-slate-500 mt-1">Overview of all registered organizations and their subscription status.</p>
                    </div>
                    <Link to="/platform/create-tenant" className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-95">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Create Tenant</span>
                    </Link>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    
                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-sm"
                                placeholder="Search by name or subdomain..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Total: <span className="font-bold text-slate-800 ml-1">{tenants.length}</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    {loading ? (
                        <div className="text-center py-24">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-500 mb-4" />
                            <p className="text-slate-400 font-medium">Loading Tenants...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-24 bg-red-50/50">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-400 mb-4" />
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    ) : filteredTenants.length === 0 ? (
                        <div className="text-center py-24 bg-slate-50/50">
                            <FontAwesomeIcon icon={faBuilding} className="text-4xl text-slate-300 mb-4" />
                            <p className="text-slate-400">No tenants found matching your search.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        <th className="px-6 py-4">Tenant Name</th>
                                        <th className="px-6 py-4">Domain</th>
                                        <th className="px-6 py-4">Plan</th>
                                        <th className="px-6 py-4">Billing</th>
                                        <th className="px-6 py-4">Renewal</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedTenants.map((tenant) => {
                                        // Mock URL generation for demo
                                        const host = window.location.hostname;
                                        const url = tenant.custom_domain ? `http://${tenant.custom_domain}` : `http://${tenant.subdomain}.${host}`;

                                        return (
                                            <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                                            {tenant.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-slate-700">{tenant.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-mono cursor-pointer">
                                                        {tenant.subdomain} <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-slate-700 capitalize flex items-center gap-1.5">
                                                        {tenant.plan === 'enterprise' && <FontAwesomeIcon icon={faCrown} className="text-yellow-500 text-xs" />}
                                                        {tenant.plan} 
                                                        {tenant.is_custom && <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 rounded border border-purple-100">Custom</span>}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 capitalize">
                                                    {tenant.billing_cycle?.replace('_', ' ') || 'Monthly'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                        {getRenewalDate(tenant.created_at, tenant.billing_cycle)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {statusBadge(tenant.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => openRenewModal(tenant)} 
                                                            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                            title="Renew / Upgrade"
                                                        >
                                                            <FontAwesomeIcon icon={faSyncAlt} />
                                                        </button>
                                                        <button 
                                                            onClick={() => toast('Edit View (Demo Only)')} 
                                                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="Edit Details"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(tenant.id, tenant.name)} 
                                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                            title="Delete Tenant"
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredTenants.length > 0 && (
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
                            <span>Showing {paginatedTenants.length} of {filteredTenants.length} tenants</span>
                            <div className="flex gap-2">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <button 
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- RENEWAL POPUP MODAL --- */}
            {isRenewModalOpen && selectedTenant && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-slate-100">
                        
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <FontAwesomeIcon icon={faSyncAlt} />
                                </div>
                                Modify Subscription
                            </h3>
                            <button onClick={() => setIsRenewModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <FontAwesomeIcon icon={faTimes} className="text-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleRenewalSubmit} className="p-6 space-y-5">
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Current Tenant</p>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-slate-700">{selectedTenant.name}</p>
                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-blue-100 text-slate-500">
                                        {selectedTenant.plan} / {selectedTenant.billing_cycle?.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Select New Plan</label>
                                    <div className="relative">
                                        <select 
                                            name="plan" 
                                            value={renewalForm.plan} 
                                            onChange={handleRenewalChange} 
                                            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all"
                                        >
                                            {plans.map(p => (
                                                <option key={p.plan_key} value={p.plan_key}>
                                                    {p.name} {p.is_custom ? '(Custom)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <FontAwesomeIcon icon={faCrown} className="absolute left-3.5 top-3 text-slate-400 text-sm pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Billing Cycle</label>
                                    <div className="relative">
                                        <select 
                                            name="billingCycle" 
                                            value={renewalForm.billingCycle} 
                                            onChange={handleRenewalChange} 
                                            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="half_yearly">Half-Yearly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                        <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3.5 top-3 text-slate-400 text-sm pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <span className="text-sm font-medium text-slate-500">New Price:</span>
                                <span className="text-2xl font-bold text-emerald-600">₹{calculatedPrice}</span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsRenewModalOpen(false)}
                                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={renewing}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70"
                                >
                                    {renewing ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faCheckCircle} />}
                                    {renewing ? 'Updating...' : 'Confirm Renewal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantListPage;