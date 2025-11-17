import React, { useState, useEffect } from 'react';
// import axios from '../../api/axios'; // Removed for Demo Mode
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave, faSpinner, faStar, faVideo, faChartBar, faCrown, 
    faDesktop, faUsers, faDatabase, faBuilding, faPalette, 
    faCogs, faCheckCircle, faTimesCircle, faToggleOn, faToggleOff,
    faPlusCircle, faTrash, faMapMarkerAlt, faExclamationTriangle,
    faCircleNotch // All icons imported
} from '@fortawesome/free-solid-svg-icons';

// --- INLINE SVG ICONS (Fallback/Custom) ---
const SpinnerIcon = () => (
    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
);

// --- Custom Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

// --- Color Palettes ---
const COLOR_PALETTES = {
    default: { navbarColorStart: '#005f9e', navbarColorEnd: '#003a6b', sidebarColorStart: '#1f2937', sidebarColorEnd: '#0f172a', navbarTextColor: '#ffffff', sidebarTextColor: '#e5e7eb', sidebarSelectionColor: '#007bff' },
    professional_blue: { navbarColorStart: '#004a99', navbarColorEnd: '#002752', sidebarColorStart: '#343a40', sidebarColorEnd: '#212529', navbarTextColor: '#ffffff', sidebarTextColor: '#f8f9fa', sidebarSelectionColor: '#0d6efd' },
    modern_dark: { navbarColorStart: '#222222', navbarColorEnd: '#111111', sidebarColorStart: '#333333', sidebarColorEnd: '#222222', navbarTextColor: '#ffffff', sidebarTextColor: '#e0e0e0', sidebarSelectionColor: '#3498db' },
    light_mint: { navbarColorStart: '#1abc9c', navbarColorEnd: '#16a085', sidebarColorStart: '#fdfdfd', sidebarColorEnd: '#f9f9f9', navbarTextColor: '#ffffff', sidebarTextColor: '#333333', sidebarSelectionColor: '#1abc9c' },
};

// --- Default State ---
const defaultSettings = {
    registrationOpen: true, defaultPlan: 'basic', supportEmail: 'support@example.com',
    platformName: 'Nexus SaaS', platformLogoUrl: '', publicSiteName: 'Nexus Public', 
    appTitle: 'Nexus Portal', appFaviconUrl: '', logoUrl: '',
    navbarColorStart: '#005f9e', navbarColorEnd: '#003a6b', sidebarColorStart: '#1f2937',
    sidebarColorEnd: '#0f172a', navbarTextColor: '#ffffff', sidebarTextColor: '#e5e7eb', 
    sidebarSelectionColor: '#007bff', isGlassEffectEnabled: true,
    trialDurationDays: 14,
};

// --- MOCK DATA ---
const MOCK_PLANS = [
    { 
        plan_key: 'basic', name: 'Basic', 
        price_monthly: 0, price_quarterly: 0, price_half_yearly: 0, price_yearly: 0,
        max_users: 5, max_storage_gb: 1, analytics: false, video_calling: false 
    },
    { 
        plan_key: 'pro', name: 'Pro', 
        price_monthly: 5999, price_quarterly: 17000, price_half_yearly: 32000, price_yearly: 59990,
        max_users: 50, max_storage_gb: 50, analytics: true, video_calling: true 
    },
    { 
        plan_key: 'enterprise', name: 'Enterprise', 
        price_monthly: 14999, price_quarterly: 42000, price_half_yearly: 80000, price_yearly: 149990,
        max_users: -1, max_storage_gb: -1, analytics: true, video_calling: true 
    }
];
// --- End Mock Data ---


// --- PlanCard Editor Component ---
const PlanCard = ({ plan, onSave }) => {
    const [formData, setFormData] = useState(plan);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { setFormData(plan); }, [plan]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- MOCK SAVE HANDLER ---
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const parseLimit = (val) => (val === 'Infinity' || val === '-1') ? -1 : (parseInt(val, 10) || 0);

        const payload = {
            ...formData,
            max_users: parseLimit(formData.max_users),
            max_storage_gb: parseLimit(formData.max_storage_gb),
            video_calling: formData.video_calling,
            price_monthly: parseFloat(formData.price_monthly || 0).toFixed(2),
            price_quarterly: parseFloat(formData.price_quarterly || 0).toFixed(2),
            price_half_yearly: parseFloat(formData.price_half_yearly || 0).toFixed(2),
            price_yearly: parseFloat(formData.price_yearly || 0).toFixed(2),
        };
        
        // Simulate network delay
        setTimeout(() => {
            onSave(payload); // Send updated data back to parent
            toast.success(`[DEMO] Plan '${payload.name}' updated!`);
            setIsSaving(false);
        }, 1000);
    };

    return (
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="text-xl font-bold text-blue-600 border-none bg-transparent focus:ring-0 p-0 w-full" 
                />
                <span className="text-xs font-mono text-slate-400 uppercase">{plan.plan_key}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCrown} className="text-yellow-500"/> Pricing (₹)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <FormInputSmall label="Monthly" name="price_monthly" value={formData.price_monthly} onChange={handleChange} isCurrency={true} />
                    <FormInputSmall label="Quarterly" name="price_quarterly" value={formData.price_quarterly} onChange={handleChange} isCurrency={true} />
                    <FormInputSmall label="Half-Yearly" name="price_half_yearly" value={formData.price_half_yearly} onChange={handleChange} isCurrency={true} />
                    <FormInputSmall label="Yearly" name="price_yearly" value={formData.price_yearly} onChange={handleChange} isCurrency={true} />
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faDatabase} className="text-slate-400"/> Limits (-1 for ∞)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <FormInputSmall label="Max Users" name="max_users" value={formData.max_users} onChange={handleNumberChange} />
                    <FormInputSmall label="Max Storage (GB)" name="max_storage_gb" value={formData.max_storage_gb} onChange={handleNumberChange} />
                </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-4">
                    <CheckboxToggle label="Analytics" name="analytics" checked={formData.analytics} onChange={handleChange} icon={faChartBar} iconColor="text-blue-500" />
                    <CheckboxToggle label="Video" name="video_calling" checked={formData.video_calling} onChange={handleChange} icon={faDesktop} iconColor="text-green-500" />
                </div>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">
                    {isSaving ? <SpinnerIcon /> : <FontAwesomeIcon icon={faSave} />}
                    {isSaving ? 'Saving' : 'Save'}
                </button>
            </div>
        </form>
    );
};
// --- END: PlanCard Component ---

// --- Main Page Component ---
const PlatformSettingsPage = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(true);

    // --- MOCK DATA LOADER ---
    useEffect(() => {
        const fetchAllSettings = async () => {
            setLoading(true); setPlansLoading(true);
            
            // Simulate API delay
            await new Promise(res => setTimeout(res, 800));

            try {
                // Set Mock Settings
                setSettings(prev => ({ ...prev, ...defaultSettings }));
                
                // Set Mock Plans (and format them for the form)
                const formattedData = MOCK_PLANS.map(plan => ({
                    ...plan,
                    max_users: plan.max_users === -1 ? 'Infinity' : (plan.max_users || 0),
                    max_storage_gb: plan.max_storage_gb === -1 ? 'Infinity' : (plan.max_storage_gb || 1),
                    video_calling: plan.video_calling || false,
                }));
                setPlans(formattedData);

            } catch (error) {
                console.error("Failed to load mock data:", error);
                toast.error("Could not load all platform data.");
            } finally {
                setLoading(false);
                setPlansLoading(false);
            }
        };
        fetchAllSettings();
    }, []);
    
    // This function is called by the PlanCard component after its mock save
    const handlePlanUpdated = (updatedPlan) => {
        setPlans(prevPlans => 
            prevPlans.map(p => 
                p.plan_key === updatedPlan.plan_key ? {
                    ...updatedPlan, 
                    max_users: updatedPlan.max_users === -1 ? 'Infinity' : updatedPlan.max_users,
                    max_storage_gb: updatedPlan.max_storage_gb === -1 ? 'Infinity' : updatedPlan.max_storage_gb,
                } : p
            )
        );
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handlePaletteChange = (paletteName) => {
        const palette = COLOR_PALETTES[paletteName];
        if (palette) {
            setSettings(prev => ({ ...prev, ...palette }));
            toast.success(`Theme set to '${paletteName.replace('_', ' ')}'. Click Save to apply.`);
        }
    };

    // --- MOCK SAVE SETTINGS ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        // Simulate network delay
        setTimeout(() => {
            setSaving(false);
            toast.success("[DEMO] Platform settings saved successfully!");
            // In a real app, we'd refetch or update context here.
            // For demo, the state is already updated locally.
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-slate-500">
                <FontAwesomeIcon icon={faCircleNotch} spin className="mr-3 text-blue-500" />
                Loading Platform Settings...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-600 selection:bg-blue-100">
            <style>{pageStyles}</style>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Platform Settings</h1>
                        <p className="text-slate-500 mt-1">Manage global settings for the entire platform.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* --- LEFT: Tab Navigation --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-6">
                            <nav className="flex flex-col gap-1">
                                <TabButton label="General" icon={faCogs} isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                                <TabButton label="Branding" icon={faBuilding} isActive={activeTab === 'branding'} onClick={() => setActiveTab('branding')} />
                                <TabButton label="Theme" icon={faPalette} isActive={activeTab === 'theme'} onClick={() => setActiveTab('theme')} />
                                <TabButton label="Plans" icon={faCrown} isActive={activeTab === 'plans'} onClick={() => setActiveTab('plans')} />
                            </nav>
                        </div>
                    </div>

                    {/* --- RIGHT: Tab Content --- */}
                    <div className="lg:col-span-3 space-y-6">
                        <form onSubmit={handleSubmit}>
                            
                            {/* --- General Settings --- */}
                            {activeTab === 'general' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
                                    <div className="p-8">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6">General Settings</h2>
                                        <div className="space-y-5">
                                            <FormInput label="Platform Domain" value={window.location.origin} readOnly={true} />
                                            
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <div>
                                                    <p className="font-semibold text-slate-700">New Tenant Registrations</p>
                                                    <p className="text-xs text-slate-500">Allow visitors to sign up as new tenants.</p>
                                                </div>
                                                <ToggleSwitch 
                                                    enabled={settings.registrationOpen}
                                                    onChange={() => setSettings(prev => ({...prev, registrationOpen: !prev.registrationOpen}))}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Free Trial Duration (Days)</label>
                                                <div className="relative">
                                                    <input 
                                                        type="number" 
                                                        name="trialDurationDays" 
                                                        value={settings.trialDurationDays || 0} 
                                                        onChange={handleChange} 
                                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                        min="0"
                                                    />
                                                    <span className="absolute right-4 top-2.5 text-sm text-slate-400">days</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Set to 0 to disable automatic trials.</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Plan for New Tenants</label>
                                                <select name="defaultPlan" value={settings.defaultPlan} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                                    {plans.map(plan => (
                                                        <option key={plan.plan_key} value={plan.plan_key}>{plan.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <FormInput label="Platform Support Email" name="supportEmail" value={settings.supportEmail || ''} onChange={handleChange} required={true} />
                                        </div>
                                    </div>
                                    <FormFooter onSave={handleSubmit} isLoading={saving} />
                                </div>
                            )}

                            {/* --- Branding Settings --- */}
                            {activeTab === 'branding' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
                                    <div className="p-8">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6">Branding</h2>
                                        
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Internal Branding</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                            <FormInput label="Platform Name (Internal)" name="platformName" value={settings.platformName || ''} onChange={handleChange} placeholder="e.g., Project X" />
                                            <FormInput label="Platform Logo (Internal)" name="platformLogoUrl" value={settings.platformLogoUrl || ''} onChange={handleChange} placeholder="https://.../logo.png" />
                                        </div>

                                        <hr className="border-slate-100 my-6" />

                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Public-Facing Branding</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label="Public Site Name (Header)" name="publicSiteName" value={settings.publicSiteName || ''} onChange={handleChange} placeholder="e.g., Project X Public" />
                                            <FormInput label="Browser Tab Title" name="appTitle" value={settings.appTitle || ''} onChange={handleChange} placeholder="e.g., Project X" />
                                            <FormInput label="Browser Tab Icon (Favicon)" name="appFaviconUrl" value={settings.appFaviconUrl || ''} onChange={handleChange} placeholder="https://.../icon.ico" />
                                            <FormInput label="Header Logo URL" name="logoUrl" value={settings.logoUrl || ''} onChange={handleChange} placeholder="https://.../public-logo.png" />
                                        </div>
                                    </div>
                                    <FormFooter onSave={handleSubmit} isLoading={saving} />
                                </div>
                            )}

                            {/* --- Theme/Colors Settings --- */}
                            {activeTab === 'theme' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
                                    <div className="p-8">
                                        <h2 className="text-xl font-bold text-slate-800 mb-6">Theme & Appearance</h2>
                                        
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                                            <div>
                                                <p className="font-semibold text-slate-700">Enable Glass Effect</p>
                                                <p className="text-xs text-slate-500">Adds blur and transparency to UI elements.</p>
                                            </div>
                                            <ToggleSwitch 
                                                enabled={settings.isGlassEffectEnabled || false}
                                                onChange={() => setSettings(prev => ({...prev, isGlassEffectEnabled: !prev.isGlassEffectEnabled}))}
                                            />
                                        </div>
                                        
                                        <h3 className="text-sm font-bold text-slate-700 mb-4">Color Theme</h3>
                                        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Quick Palettes</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.keys(COLOR_PALETTES).map(name => (
                                                    <button key={name} type="button" onClick={() => handlePaletteChange(name)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all capitalize shadow-sm">
                                                        {name.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ColorPicker label="Navbar Start" name="navbarColorStart" value={settings.navbarColorStart} onChange={handleChange} />
                                            <ColorPicker label="Navbar End" name="navbarColorEnd" value={settings.navbarColorEnd} onChange={handleChange} />
                                            <ColorPicker label="Navbar Text" name="navbarTextColor" value={settings.navbarTextColor} onChange={handleChange} />
                                            <ColorPicker label="Sidebar Start" name="sidebarColorStart" value={settings.sidebarColorStart} onChange={handleChange} />
                                            <ColorPicker label="Sidebar End" name="sidebarColorEnd" value={settings.sidebarColorEnd} onChange={handleChange} />
                                            <ColorPicker label="Sidebar Text" name="sidebarTextColor" value={settings.sidebarTextColor} onChange={handleChange} />
                                            <ColorPicker label="Sidebar Selection" name="sidebarSelectionColor" value={settings.sidebarSelectionColor} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <FormFooter onSave={handleSubmit} isLoading={saving} />
                                </div>
                            )}
                        </form>

                        {/* --- Subscription Plans --- */}
                        {activeTab === 'plans' && (
                            <div className="animate-fade-in-up">
                                {plansLoading ? (
                                    <div className="text-center py-10"><FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" /></div>
                                ) : (
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        {plans.map(plan => (
                                            <PlanCard key={plan.plan_key} plan={plan} onSave={handlePlanUpdated} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Child Components ---

const TabButton = ({ label, icon, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isActive 
            ? 'bg-blue-50 text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`}
    >
        <FontAwesomeIcon icon={icon} className="w-4 h-4" />
        {label}
    </button>
);

const FormInput = ({ label, name, type = "text", value, onChange, readOnly = false, required = false, placeholder = "" }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
        <input 
            type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} required={required} placeholder={placeholder}
            className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${readOnly ? 'text-slate-500 cursor-not-allowed' : 'text-slate-800'}`}
        />
    </div>
);

const FormInputSmall = ({ label, name, value, onChange, isCurrency = false }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
        <div className="relative">
            {isCurrency && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>}
            <input 
                type="text" 
                name={name} 
                value={value} 
                onChange={onChange} 
                className={`w-full p-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-colors ${isCurrency ? 'pl-7 font-mono' : 'text-center'}`}
            />
        </div>
    </div>
);

const CheckboxToggle = ({ label, name, checked, onChange, icon, iconColor }) => (
    <label className="flex items-center text-xs font-bold text-slate-700 cursor-pointer select-none hover:bg-slate-50 p-1 rounded transition-colors">
        <input 
            type="checkbox" 
            name={name} 
            checked={checked} 
            onChange={onChange} 
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2" 
        />
        <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={icon} className={iconColor} />
            {label}
        </span>
    </label>
);

const ColorPicker = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <label className="text-xs font-bold text-slate-700">{label}</label>
        <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-400">{value || '#000000'}</span>
            <input
                type="color"
                name={name}
                value={value || '#000000'}
                onChange={onChange}
                className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent"
            />
        </div>
    </div>
);

const ToggleSwitch = ({ enabled, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className="text-3xl transition-colors focus:outline-none"
    >
        <FontAwesomeIcon icon={enabled ? faToggleOn : faToggleOff} className={enabled ? 'text-blue-600' : 'text-slate-300'} />
    </button>
);

const FormFooter = ({ onSave, isLoading }) => (
    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
        <button type="submit" disabled={isLoading} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70">
            {isLoading ? <SpinnerIcon /> : <FontAwesomeIcon icon={faSave} />}
            {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
    </div>
);

export default PlatformSettingsPage;