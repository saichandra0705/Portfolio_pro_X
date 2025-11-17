import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCrown, faChartBar, faDesktop, faUsers, faDatabase, faBuilding, faLock } from '@fortawesome/free-solid-svg-icons';
// import axios from '../../api/axios'; // Removed for Demo Mode
import toast from 'react-hot-toast';

const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

// --- MOCK DATA (Replaces API call) ---
const MOCK_PLANS = [
    { plan_key: 'basic', name: 'Basic', price_monthly: 0, price_yearly: 0, price_quarterly: 0, price_half_yearly: 0 },
    { plan_key: 'starter', name: 'Starter', price_monthly: 2999, price_yearly: 29990, price_quarterly: 8500, price_half_yearly: 16000 },
    { plan_key: 'pro', name: 'Pro', price_monthly: 5999, price_yearly: 59990, price_quarterly: 17000, price_half_yearly: 32000 },
    { plan_key: 'enterprise', name: 'Enterprise', price_monthly: 14999, price_yearly: 149990, price_quarterly: 42000, price_half_yearly: 80000 }
];


const CreateTenantPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);

    const [formData, setFormData] = useState({
        hospitalName: '', // Mapped to "Organization Name" in UI
        subdomain: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        plan: '', 
        billingCycle: 'monthly', 
        
        // Custom Plan configuration
        customLimits: {
            max_users: 10, 
            max_storage_gb: 1, 
            price: 0,
            analytics: false,
        }
    });

    // --- EFFECT: Load Mock Plans ---
    useEffect(() => {
        const fetchPlans = () => {
            setLoadingPlans(true);
            setTimeout(() => { // Simulate network delay
                setPlans(MOCK_PLANS);
                if (MOCK_PLANS.length > 0) {
                    setFormData(prev => ({ ...prev, plan: MOCK_PLANS[0].plan_key }));
                }
                setLoadingPlans(false);
            }, 500); // 500ms delay
        };
        fetchPlans();
    }, []);

    const isCustomPlan = formData.plan === 'custom';

    const selectedPlanObj = useMemo(() => 
        plans.find(p => p.plan_key === formData.plan), 
    [plans, formData.plan]);

    const currentDisplayPrice = useMemo(() => {
        if (isCustomPlan) return formData.customLimits.price;
        
        if (!selectedPlanObj) return 0;
        const keyMap = {
            monthly: 'price_monthly',
            quarterly: 'price_quarterly',
            half_yearly: 'price_half_yearly',
            yearly: 'price_yearly'
        };
        return selectedPlanObj[keyMap[formData.billingCycle]] || 0;
    }, [selectedPlanObj, formData.billingCycle, isCustomPlan, formData.customLimits.price]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = name === 'subdomain'
            ? value.toLowerCase().replace(/[^a-z0-9-]/g, '')
            : value;
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleCustomConfigChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            customLimits: {
                ...prev.customLimits,
                [name]: type === 'checkbox' ? checked : (parseFloat(value) || 0)
            }
        }));
    };

    // --- UPDATED: Mock Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Attempting to provision tenant...');
        
        // Simulate a network request
        setTimeout(() => {
            setLoading(false);
            
            const tenantName = formData.hospitalName || "New Tenant";
            toast.success(`[DEMO] Tenant '${tenantName}' created successfully!`, { id: toastId });
            
            // Redirect to the tenant list
            navigate('/platform/tenants');
            
        }, 1500); // Simulate 1.5 second network request
    };

    if (loadingPlans) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                <FontAwesomeIcon icon={faSpinner} spin className="text-2xl mr-3 text-blue-500" /> 
                Loading Plans...
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans text-slate-700 flex items-center justify-center">
            <style>{pageStyles}</style>
            <div className="max-w-4xl w-full bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 animate-fade-in-up">
                
                {/* --- Header --- */}
                <div className="mb-8 pb-4 border-b border-gray-100">
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <FontAwesomeIcon icon={faDesktop} className="text-blue-600" /> Create New Tenant
                    </h1>
                    <p className="text-slate-500 mt-1">Provision a new organization environment and define its subscription plan.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* --- 1. Organization Details --- */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                             <FontAwesomeIcon icon={faBuilding} className="text-indigo-500 text-lg" /> Organization Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Organization Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organization Name</label>
                                <input 
                                    type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                                    placeholder="e.g. Atlas Solutions Inc."
                                />
                            </div>

                            {/* Subdomain */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subdomain</label>
                                <div className="flex rounded-xl shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
                                    <input 
                                        type="text" name="subdomain" value={formData.subdomain} onChange={handleChange} required 
                                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-xl border-none focus:ring-0 outline-none" 
                                        placeholder="atlas-solutions" 
                                    />
                                    <span className="inline-flex items-center px-4 rounded-r-xl bg-gray-50 text-gray-500 text-sm border-l border-gray-300">
                                        .{window.location.hostname.replace('www.', '')}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 pl-1">Letters, numbers, and hyphens only.</p>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. Subscription Plan --- */}
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-inner">
                        <h2 className="text-xl font-bold text-blue-800 mb-5 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCrown} className="mr-1" /> Subscription Plan Configuration
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Plan Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Plan</label>
                                <select name="plan" value={formData.plan} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer transition-all hover:border-blue-400">
                                    {plans.map(plan => (
                                        <option key={plan.plan_key} value={plan.plan_key} className='font-medium'>
                                            {plan.name}
                                        </option>
                                    ))}
                                    <option value="custom" className="font-bold text-blue-600">✨ Custom Configuration</option>
                                </select>
                            </div>

                            {/* Billing Cycle Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Billing Cycle</label>
                                <select name="billingCycle" value={formData.billingCycle} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer transition-all hover:border-blue-400">
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="half_yearly">Half-Yearly</option>
                                    <option value="yearly">Yearly (Best Value)</option>
                                </select>
                            </div>
                            
                            {/* Price Display / Input */}
                            <div className="bg-blue-100 rounded-xl p-3 flex flex-col justify-center items-center text-center shadow-md border border-blue-300">
                                <span className="text-sm text-blue-800 font-semibold mb-1">Estimated Cost</span>
                                {isCustomPlan ? (
                                    <div className="flex items-center">
                                        <span className="text-2xl font-extrabold text-blue-900 mr-1">₹</span>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={formData.customLimits.price} 
                                            onChange={handleCustomConfigChange}
                                            className="w-24 p-1 border border-blue-400 rounded-lg text-right font-bold text-blue-700 focus:ring-blue-500 focus:border-blue-500 text-lg outline-none"
                                            placeholder="0.00"
                                        />
                                        <span className="ml-2 text-sm font-normal text-blue-700">/ {formData.billingCycle.replace('_', ' ')}</span>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-extrabold text-blue-900">
                                        ₹{currentDisplayPrice} <span className="text-sm font-medium text-blue-700">/ {formData.billingCycle.replace('_', ' ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Custom Configuration Area */}
                        {isCustomPlan && (
                            <div className="mt-6 pt-6 border-t border-blue-200">
                                <h3 className="text-base font-bold text-gray-700 mb-4">Customize Limits & Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-4 rounded-xl shadow-inner border border-gray-200">
                                    
                                    {/* Max Users */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center"><FontAwesomeIcon icon={faUsers} className="mr-1.5 text-blue-500" /> Max Users</label>
                                        <input type="number" name="max_users" value={formData.customLimits.max_users} onChange={handleCustomConfigChange} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" min="1" />
                                    </div>
                                    
                                    {/* Storage */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center"><FontAwesomeIcon icon={faDatabase} className="mr-1.5 text-blue-500" /> Storage (GB)</label>
                                        <input type="number" name="max_storage_gb" value={formData.customLimits.max_storage_gb} onChange={handleCustomConfigChange} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" min="1" />
                                    </div>
                                    
                                    {/* Analytics Toggle */}
                                    <div className='flex items-center pt-5'>
                                        <label className="flex items-center text-sm text-gray-700 font-medium cursor-pointer">
                                            <input type="checkbox" name="analytics" checked={formData.customLimits.analytics} onChange={handleCustomConfigChange} className="w-4 h-4 text-blue-600 rounded mr-2 focus:ring-blue-500" />
                                            <FontAwesomeIcon icon={faChartBar} className="mr-1.5 text-blue-500" /> 
                                            Enable Analytics
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- 3. Admin Account --- */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faLock} className="text-red-500 text-lg" /> Tenant Admin Account
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Admin Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Full Name</label>
                                <input type="text" name="adminName" value={formData.adminName} onChange={handleChange} required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                                />
                            </div>

                            {/* Admin Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
                                <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                                />
                            </div>

                            {/* Admin Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temporary Password</label>
                                <input type="password" name="adminPassword" value={formData.adminPassword} onChange={handleChange} required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* --- Action Button --- */}
                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-blue-600 text-white font-bold py-3 px-10 rounded-xl hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center gap-3 shadow-lg shadow-blue-600/30 active:scale-95"
                        >
                            {loading ? <FontAwesomeIcon icon={faSpinner} spin className="text-lg" /> : 'Create Tenant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTenantPage;