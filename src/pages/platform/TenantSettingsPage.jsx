import React, { useState, useEffect } from 'react';
// import axios from '../../api/axios'; // Removed for Demo
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave, faPlusCircle, faTrash, faMapMarkerAlt,
    faStar, faExclamationTriangle, faCircleNotch, faBuilding, faCheckCircle, faTimesCircle, 
    faUsers, faPalette, faToggleOn, faToggleOff
} from '@fortawesome/free-solid-svg-icons';

// --- Custom Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

// --- MOCK DATA ---
const MOCK_PLANS = [
    { plan_key: 'basic', name: 'Basic', price_monthly: 0, price_yearly: 0, max_users: 5, max_storage_gb: 1, analytics: false, video_calling: false },
    { plan_key: 'starter', name: 'Starter', price_monthly: 2999, price_yearly: 29990, max_users: 20, max_storage_gb: 10, analytics: true, video_calling: false },
    { plan_key: 'pro', name: 'Pro', price_monthly: 5999, price_yearly: 59990, max_users: 50, max_storage_gb: 50, analytics: true, video_calling: true },
    { plan_key: 'enterprise', name: 'Enterprise', price_monthly: 14999, price_yearly: 149990, max_users: -1, max_storage_gb: -1, analytics: true, video_calling: true }
];

const MOCK_TENANTS = [
    { id: 101, name: 'Acme Corp', subdomain: 'acme', plan: 'enterprise' },
    { id: 102, name: 'Stark Industries', subdomain: 'stark', plan: 'pro' },
    { id: 103, name: 'Wayne Enterprises', subdomain: 'wayne', plan: 'basic' }
];

// Mock settings database keyed by Tenant ID
const MOCK_SETTINGS_DB = {
    101: {
        organizationName: 'Acme Corporation',
        mainHospitalLocation: { name: 'Acme HQ', address: '123 Coyote Lane, Desert Valley', latitude: 34.05, longitude: -118.24 },
        branches: [
            { branchName: 'East Coast Hub', branchLocation: 'Gotham City', address: '1007 Mountain Dr', latitude: 40.71, longitude: -74.00 }
        ],
        logoUrl: 'https://via.placeholder.com/150',
        appFaviconUrl: '/favicon.ico',
        navbarColorStart: '#005f9e',
        navbarColorEnd: '#003a6b',
        sidebarColorStart: '#1f2937',
        sidebarColorEnd: '#0f172a',
        navbarTextColor: '#ffffff',
        sidebarTextColor: '#e5e7eb',
        sidebarSelectionColor: '#007bff',
        isGlassEffectEnabled: true,
        allowRegistration: true
    },
    102: {
        organizationName: 'Stark Industries',
        mainHospitalLocation: { name: 'Stark Tower', address: '200 Park Avenue, NY', latitude: 40.75, longitude: -73.97 },
        branches: [],
        navbarColorStart: '#b91c1c',
        navbarColorEnd: '#991b1b',
        isGlassEffectEnabled: false,
        allowRegistration: false
    },
    103: {
        organizationName: 'Wayne Enterprises',
        mainHospitalLocation: { name: 'Wayne Tower', address: 'Gotham Plaza', latitude: 41.87, longitude: -87.62 },
        branches: [],
        navbarColorStart: '#111827',
        navbarColorEnd: '#000000',
        isGlassEffectEnabled: true,
        allowRegistration: true
    }
};

// --- Helper Functions ---
const defaultBranch = { branchName: '', branchLocation: '', address: '', latitude: '', longitude: '' };
const defaultMainLocation = { name: '', address: '', latitude: null, longitude: null };

const SpinnerIcon = () => (
    <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2" />
);

const COLOR_PALETTES = {
    default: { navbarColorStart: '#005f9e', navbarColorEnd: '#003a6b', sidebarColorStart: '#1f2937', sidebarColorEnd: '#0f172a', navbarTextColor: '#ffffff', sidebarTextColor: '#e5e7eb', sidebarSelectionColor: '#007bff' },
    professional_blue: { navbarColorStart: '#004a99', navbarColorEnd: '#002752', sidebarColorStart: '#343a40', sidebarColorEnd: '#212529', navbarTextColor: '#ffffff', sidebarTextColor: '#f8f9fa', sidebarSelectionColor: '#0d6efd' },
    calm_green: { navbarColorStart: '#349e34', navbarColorEnd: '#1e6c1e', sidebarColorStart: '#4caf50', sidebarColorEnd: '#2e8b57', navbarTextColor: '#ffffff', sidebarTextColor: '#ffffff', sidebarSelectionColor: '#e0f7fa' },
    solid_grey: { navbarColorStart: '#4a5568', navbarColorEnd: '#4a5568', sidebarColorStart: '#2d3748', sidebarColorEnd: '#2d3748', navbarTextColor: '#e2e8f0', sidebarTextColor: '#cbd5e1', sidebarSelectionColor: '#a0aec0' },
};

const TenantSettingsPage = () => {
    const [tenants, setTenants] = useState([]);
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [settingsForm, setSettingsForm] = useState(null);
    const [loadingTenants, setLoadingTenants] = useState(true);
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showPersonalization, setShowPersonalization] = useState(false);
    
    const [plansData, setPlansData] = useState(null); 
    const [loadingPlans, setLoadingPlans] = useState(true);

    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({ key: '', name: '' });
    const [conflictErrors, setConflictErrors] = useState([]);
    const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

    // 1. Initialize Demo Data
    useEffect(() => {
        const initDemoData = () => {
            setTimeout(() => {
                setTenants(MOCK_TENANTS);
                setLoadingTenants(false);

                // Convert array to object map for easier lookup
                const plansMap = {};
                MOCK_PLANS.forEach(p => {
                    plansMap[p.plan_key] = {
                        ...p,
                        maxUsers: p.max_users === -1 ? Infinity : p.max_users,
                        maxLocations: p.max_storage_gb === -1 ? Infinity : p.max_storage_gb // Using storage GB as proxy for location limit in demo logic
                    };
                });
                setPlansData(plansMap);
                setLoadingPlans(false);
            }, 800);
        };
        initDemoData();
    }, []);

    // 2. Fetch Tenant Settings (Mock)
    useEffect(() => {
        if (!selectedTenantId) {
            setSettingsForm(null); 
            return;
        }
        setLoadingSettings(true);
        
        setTimeout(() => {
            const mockSettings = MOCK_SETTINGS_DB[selectedTenantId] || MOCK_SETTINGS_DB[101]; // Fallback
            const tenantInfo = tenants.find(t => t.id == selectedTenantId);
            
            setSettingsForm({
                ...mockSettings,
                plan: tenantInfo?.plan || 'basic'
            });
            setLoadingSettings(false);
        }, 600);

    }, [selectedTenantId, tenants]);

    // --- Handlers ---

    const handleSettingsChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettingsForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMainLocationChange = (e) => {
        const { name, value } = e.target;
        setSettingsForm(prev => ({
            ...prev,
            mainHospitalLocation: {
                ...(prev.mainHospitalLocation || defaultMainLocation),
                [name]: value
            }
        }));
    };

    const handlePaletteChange = (paletteName) => {
        const palette = COLOR_PALETTES[paletteName];
        setSettingsForm(prev => ({ ...prev, ...palette }));
        toast.success(`Theme set to '${paletteName.replace('_', ' ')}'. Click Save to apply.`);
    };

    const handleBranchChange = (index, e) => {
        const { name, value } = e.target;
        const newBranches = [...(settingsForm.branches || [])];
        newBranches[index] = { ...newBranches[index], [name]: value };
        setSettingsForm(prev => ({ ...prev, branches: newBranches }));
    };

    const addBranch = () => {
         setSettingsForm(prev => ({
             ...prev,
             branches: [...(prev.branches || []), { ...defaultBranch }]
         }));
    };

    const removeBranch = (index) => {
        const newBranches = (settingsForm.branches || []).filter((_, i) => i !== index);
        setSettingsForm(prev => ({ ...prev, branches: newBranches }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTenantId) return toast.error("Please select a tenant first.");
        
        setSaving(true);
        setTimeout(() => {
            toast.success('Tenant settings saved successfully (Demo)!');
            setSaving(false);
        }, 1000);
    };

    // --- Plan Change Logic ---
    const handlePlanChangeClick = (planKey, planName) => {
        const newPlan = plansData[planKey];
        if (!newPlan) return;

        const currentBranchCount = (settingsForm.branches || []).length;
        // Mock logic: assume 1 branch = 10GB storage needed
        const requiredStorage = (currentBranchCount + 1) * 10; 

        const conflicts = [];
        if (newPlan.maxLocations !== Infinity && requiredStorage > newPlan.maxLocations) {
            conflicts.push(`Tenant requires ${requiredStorage}GB storage, but ${planName} limit is ${newPlan.maxLocations}GB.`);
        }
        
        setSelectedPlan({ key: planKey, name: planName });
        if (conflicts.length > 0) {
            setConflictErrors(conflicts);
            setIsDowngradeModalOpen(true);
        } else {
            setIsPlanModalOpen(true);
        }
    };

    const handleConfirmPlanChange = async () => {
        setIsUpdatingPlan(true);
        setTimeout(() => {
            setSettingsForm(prev => ({ ...prev, plan: selectedPlan.key }));
            
            // Update local tenant list mock to reflect change
            setTenants(prev => prev.map(t => 
                t.id == selectedTenantId ? { ...t, plan: selectedPlan.key } : t
            ));

            toast.success(`Tenant plan successfully updated to ${selectedPlan.name}!`);
            setIsUpdatingPlan(false);
            setIsPlanModalOpen(false);
            setIsDowngradeModalOpen(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-600 selection:bg-blue-100">
            <style>{pageStyles}</style>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Tenant Configuration</h1>
                        <p className="text-slate-500 mt-1">Manage settings, branding, and subscriptions for your tenants.</p>
                    </div>
                </div>

                {/* Tenant Selection */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <label htmlFor="tenant-select" className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Select Tenant</label>
                    <select id="tenant-select" value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        disabled={loadingTenants}
                    >
                        <option value="">{loadingTenants ? 'Loading initial data...' : '-- Select a Tenant to Configure --'}</option>
                        {tenants.map(tenant => <option key={tenant.id} value={tenant.id}>{tenant.name} ({tenant.subdomain})</option>)}
                    </select>
                </div>

                {loadingSettings && (
                    <div className="text-center py-12">
                        <FontAwesomeIcon icon={faCircleNotch} spin className="text-4xl text-blue-500 mb-3" />
                        <p className="text-slate-400 font-medium">Loading Tenant Settings...</p>
                    </div>
                )}

                {settingsForm && !loadingSettings && !loadingPlans && (
                    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
                        
                        {/* --- Subscription Plan Section --- */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                Subscription Plan
                            </h2>
                            
                            {plansData && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {Object.values(plansData).map((plan) => {
                                        const isCurrent = settingsForm.plan === plan.plan_key;
                                        let savings = 0;
                                        if (plan.price_monthly > 0 && plan.price_yearly > 0) {
                                            const monthlyTotal = plan.price_monthly * 12;
                                            if (monthlyTotal > plan.price_yearly) {
                                                savings = Math.round(((monthlyTotal - plan.price_yearly) / monthlyTotal) * 100);
                                            }
                                        }

                                        return (
                                            <div key={plan.plan_key} className={`relative p-6 rounded-2xl flex flex-col transition-all ${isCurrent ? 'bg-blue-50 border-2 border-blue-500 shadow-md' : 'bg-white border border-slate-200 hover:shadow-lg hover:-translate-y-1'}`}>
                                                {isCurrent && (
                                                    <span className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                        Active Plan
                                                    </span>
                                                )}
                                                
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                                
                                                {/* Pricing Display */}
                                                <div className="mb-4 p-3 bg-white/50 rounded-lg border border-slate-100/50">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm"><span className="text-slate-500">Monthly</span> <span className="font-bold text-slate-700">₹{plan.price_monthly}</span></div>
                                                        <div className="flex justify-between text-sm"><span className="text-slate-500">Yearly</span> <span className="font-bold text-slate-700">₹{plan.price_yearly}</span></div>
                                                        {savings > 0 && <div className="text-xs text-center text-green-600 font-bold mt-1 bg-green-50 py-1 rounded">Save {savings}% Yearly</div>}
                                                    </div>
                                                </div>

                                                <ul className="space-y-2 text-sm text-slate-600 mb-6 flex-grow">
                                                    <li className="flex items-center gap-2"><FontAwesomeIcon icon={faUsers} className="text-blue-400 w-4" /> {plan.maxUsers === Infinity ? "Unlimited" : plan.maxUsers} Users</li>
                                                    <li className="flex items-center gap-2"><FontAwesomeIcon icon={faBuilding} className="text-blue-400 w-4" /> {plan.maxLocations === Infinity ? "Unlimited" : plan.maxLocations} GB Storage</li>
                                                    <li className={`flex items-center gap-2 ${plan.analytics ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                                                        <FontAwesomeIcon icon={plan.analytics ? faCheckCircle : faTimesCircle} className={`w-4 ${plan.analytics ? 'text-emerald-500' : 'text-slate-300'}`} /> Analytics
                                                    </li>
                                                    <li className={`flex items-center gap-2 ${plan.videoConsult ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                                                        <FontAwesomeIcon icon={plan.videoConsult ? faCheckCircle : faTimesCircle} className={`w-4 ${plan.videoConsult ? 'text-emerald-500' : 'text-slate-300'}`} /> Video Calling
                                                    </li>
                                                </ul>

                                                {!isCurrent && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => handlePlanChangeClick(plan.plan_key, plan.name)}
                                                        disabled={isUpdatingPlan}
                                                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        Switch to {plan.name}
                                                    </button>
                                                )}
                                                {isCurrent && (
                                                    <button disabled className="w-full py-2.5 bg-blue-100 text-blue-600 font-bold rounded-xl cursor-default">
                                                        Current Plan
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* --- General & Locations --- */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <FontAwesomeIcon icon={faBuilding} className="text-blue-500" /> Organization Details
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Organization Name</label>
                                        <input type="text" name="organizationName" value={settingsForm.organizationName || ''} onChange={handleSettingsChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Public Display Name</label>
                                        <input type="text" name="name" value={settingsForm.mainHospitalLocation?.name || ''} onChange={handleMainLocationChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Main Office Address</label>
                                    <div className="relative">
                                        <input type="text" name="address" value={settingsForm.mainHospitalLocation?.address || ''} onChange={handleMainLocationChange} className="w-full pl-4 pr-12 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                        <button type="button" onClick={() => toast('Opening Map (Demo)')} className="absolute right-3 top-3 text-slate-400 hover:text-blue-600 transition-colors">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        </button>
                                    </div>
                                </div>

                                {/* Branches */}
                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Branch Locations</h3>
                                        <button type="button" onClick={addBranch} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                            <FontAwesomeIcon icon={faPlusCircle} /> Add Branch
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {(settingsForm.branches || []).map((branch, index) => (
                                            <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group hover:border-blue-200 transition-colors">
                                                <button type="button" onClick={() => removeBranch(index)} className="absolute top-2 right-2 w-8 h-8 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"> 
                                                    <FontAwesomeIcon icon={faTrash} /> 
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Branch Name</label>
                                                        <input type="text" name="branchName" value={branch.branchName || ''} onChange={(e) => handleBranchChange(index, e)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none" placeholder="e.g. West Wing" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location ID / Area</label>
                                                        <input type="text" name="branchLocation" value={branch.branchLocation || ''} onChange={(e) => handleBranchChange(index, e)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none" placeholder="e.g. Area 51" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!settingsForm.branches || settingsForm.branches.length === 0) && (
                                            <p className="text-center text-slate-400 text-sm italic py-4">No branches added yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Branding Section (Updated) --- */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Branding & Appearance</h2>
                                    <p className="text-sm text-slate-500">Customize the look and feel of your portal.</p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setShowPersonalization(!showPersonalization)}
                                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${showPersonalization ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                >
                                    {showPersonalization ? 'Hide Settings' : 'Edit Branding'}
                                </button>
                            </div>

                            {showPersonalization && (
                                <div className="mt-6 border-t border-slate-100 pt-6 animate-fade-in-up">
                                    
                                    {/* --- Logos & Icons --- */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Logo URL</label>
                                            <input 
                                                type="text" name="logoUrl" value={settingsForm.logoUrl || ''} onChange={handleSettingsChange} 
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                placeholder="https://..." 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Favicon URL</label>
                                            <input 
                                                type="text" name="appFaviconUrl" value={settingsForm.appFaviconUrl || ''} onChange={handleSettingsChange} 
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                placeholder="https://.../favicon.ico" 
                                            />
                                        </div>
                                    </div>

                                    {/* --- Glass Effect Toggle --- */}
                                    <div 
                                        onClick={() => setSettingsForm(prev => ({...prev, isGlassEffectEnabled: !prev.isGlassEffectEnabled}))}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors mb-8"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${settingsForm.isGlassEffectEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                                                <FontAwesomeIcon icon={faPalette} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-700">Enable Glass Effect</p>
                                                <p className="text-xs text-slate-500">Adds blur and transparency to UI elements.</p>
                                            </div>
                                        </div>
                                        <div className="text-2xl text-slate-400">
                                            <FontAwesomeIcon icon={settingsForm.isGlassEffectEnabled ? faToggleOn : faToggleOff} className={settingsForm.isGlassEffectEnabled ? 'text-blue-500' : ''} />
                                        </div>
                                    </div>

                                    {/* --- Color Theme Grid --- */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4">Color Theme</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Navbar Gradient (Start)</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" name="navbarColorStart" value={settingsForm.navbarColorStart || '#000000'} onChange={handleSettingsChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{settingsForm.navbarColorStart}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Navbar Gradient (End)</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" name="navbarColorEnd" value={settingsForm.navbarColorEnd || '#000000'} onChange={handleSettingsChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{settingsForm.navbarColorEnd}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Sidebar Gradient (Start)</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" name="sidebarColorStart" value={settingsForm.sidebarColorStart || '#000000'} onChange={handleSettingsChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{settingsForm.sidebarColorStart}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Sidebar Gradient (End)</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" name="sidebarColorEnd" value={settingsForm.sidebarColorEnd || '#000000'} onChange={handleSettingsChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{settingsForm.sidebarColorEnd}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Navbar Text Color</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" name="navbarTextColor" value={settingsForm.navbarTextColor || '#ffffff'} onChange={handleSettingsChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{settingsForm.navbarTextColor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Sidebar Text Color</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" name="sidebarTextColor" value={settingsForm.sidebarTextColor || '#ffffff'} onChange={handleSettingsChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{settingsForm.sidebarTextColor}</span>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Sidebar Selection Color</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" name="sidebarSelectionColor" value={settingsForm.sidebarSelectionColor || '#007bff'} onChange={handleSettingsChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{settingsForm.sidebarSelectionColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Quick Palettes</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.keys(COLOR_PALETTES).map(name => (
                                                    <button key={name} type="button" onClick={() => handlePaletteChange(name)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all capitalize shadow-sm">
                                                        {name.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- Save Action --- */}
                        <div className="flex justify-end pt-4 pb-10">
                            <button type="submit" disabled={saving} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                                {saving ? <SpinnerIcon /> : <FontAwesomeIcon icon={faSave} />}
                                {saving ? 'Saving Changes...' : 'Save Configuration'}
                            </button>
                        </div>

                    </form>
                )}

                {/* --- Downgrade Warning Modal --- */}
                {isDowngradeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                </div>
                                <h3 className="text-lg font-bold text-red-700">Downgrade Warning</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    You are about to downgrade this tenant to the <strong>{selectedPlan.name}</strong> plan.
                                </p>
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-red-800">
                                    <p className="font-bold mb-2">Conflicts Detected:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-1">
                                        {conflictErrors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </div>
                                <p className="text-xs text-slate-500 italic">Proceeding will permanently remove excess data to match the new limits.</p>
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-end gap-3">
                                <button onClick={() => setIsDowngradeModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors" disabled={isUpdatingPlan}>Cancel</button>
                                <button onClick={handleConfirmPlanChange} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors" disabled={isUpdatingPlan}>
                                    {isUpdatingPlan ? 'Processing...' : 'Confirm Downgrade'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Confirm Plan Modal --- */}
                {isPlanModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Plan Change</h3>
                                <p className="text-slate-500 text-sm">
                                    Switch this tenant to the <strong>{selectedPlan.name}</strong> plan?
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-center gap-3">
                                <button onClick={() => setIsPlanModalOpen(false)} className="px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors" disabled={isUpdatingPlan}>Cancel</button>
                                <button onClick={handleConfirmPlanChange} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors" disabled={isUpdatingPlan}>
                                    {isUpdatingPlan ? 'Updating...' : 'Confirm Change'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TenantSettingsPage;