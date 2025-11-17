import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../api/axios';
import { usePlatformAppSettings } from '../../contexts/PlatformAppSettingsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faBuilding, faUserShield, faEnvelope, faLock, faGlobe, faRocket, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

// --- Custom Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

const PlatformClientRegisterPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { settings, loading: settingsLoading } = usePlatformAppSettings();

    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [formData, setFormData] = useState({
        organizationName: '',
        subdomain: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        plan: searchParams.get('plan') || 'basic', // Get plan from URL
        billingCycle: searchParams.get('cycle') || 'monthly', // Get cycle from URL
    });

    // Fetch all available plans to display info
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { data } = await axios.get('/public-platform/plans');
                setPlans(data);
                // If no plan was in the URL, set a default
                if (!searchParams.get('plan') && data.length > 0) {
                    setFormData(prev => ({ ...prev, plan: data[0].plan_key }));
                }
            } catch (error) {
                toast.error("Could not load subscription plans.");
            } finally {
                setLoadingPlans(false);
            }
        };
        fetchPlans();
    }, [searchParams]);

    const selectedPlan = useMemo(() => {
        return plans.find(p => p.plan_key === formData.plan);
    }, [plans, formData.plan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = name === 'subdomain'
            ? value.toLowerCase().replace(/[^a-z0-9-]/g, '')
            : value;
        
        if (name === 'organizationName' && formData.subdomain === '') {
             const defaultSubdomain = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50);
             setFormData(prev => ({ ...prev, [name]: value, subdomain: defaultSubdomain }));
        } else {
            setFormData(prev => ({ ...prev, [name]: processedValue }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        
        const payload = {
            name: formData.organizationName,
            subdomain: formData.subdomain,
            adminName: formData.adminName,
            adminEmail: formData.adminEmail,
            adminPassword: formData.adminPassword,
            plan: formData.plan,
            billingCycle: formData.billingCycle,
            // Custom plan logic would go here if we supported it on this form
        };

        try {
            const response = await axios.post('/platform/tenants', payload);
            toast.success(response.data.message || 'Tenant setup complete! Redirecting to login...');
            
            // Redirect to the new tenant's login page
            const { host } = window.location;
            const protocol = window.location.protocol;
            const port = window.location.port ? `:${window.location.port}` : '';
            const newUrl = `${protocol}//${payload.subdomain}.${host.replace('www.','')}${port}/login`;
            
            // Give toast time to show before redirecting
            setTimeout(() => {
                window.location.href = newUrl;
            }, 2000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create tenant.';
            toast.error(errorMessage);
            setLoadingSubmit(false);
        }
    };

    if (settingsLoading || loadingPlans) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <style>{pageStyles}</style>
            
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-up">
                <Link to="/" className="flex justify-center items-center gap-2 text-2xl font-bold text-slate-800">
                    {settings.platformLogoUrl ? (
                        <img src={settings.platformLogoUrl} alt="Logo" className="h-8 rounded" />
                    ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faRocket} />
                        </div>
                    )}
                    {settings.platformName}
                </Link>
                <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
                    Start your {settings.trialDurationDays > 0 ? `${settings.trialDurationDays}-Day Free Trial` : 'New Account'}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Already have an account? <Link to="/platform/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                </p>
            </div>

            {/* Form Card */}
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2">
                    
                    {/* Left Side: Form */}
                    <div className="p-8 space-y-6">
                        {/* Step 1: Organization Details */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBuilding} className="text-blue-500" /> 1. Organization
                            </h3>
                            <div className="space-y-4">
                                <FormInput label="Organization Name" name="organizationName" value={formData.organizationName} onChange={handleChange} required placeholder="Acme Inc." />
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Subdomain</label>
                                    <div className="flex rounded-xl shadow-sm border border-slate-200">
                                        <input 
                                            type="text" 
                                            name="subdomain" 
                                            value={formData.subdomain} 
                                            onChange={handleChange} 
                                            required 
                                            className="flex-1 min-w-0 block w-full px-4 py-2.5 bg-slate-50 rounded-l-xl text-sm outline-none placeholder:text-slate-400 focus:ring-0 focus:border-blue-500"
                                            placeholder="acme-corp" 
                                        />
                                        <span className="inline-flex items-center px-3 rounded-r-xl border border-l-0 border-slate-200 bg-slate-100 text-slate-500 text-sm">
                                            .{window.location.hostname.replace('www.', '')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Step 2: Admin Account */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUserShield} className="text-blue-500" /> 2. Your Account
                            </h3>
                            <div className="space-y-4">
                                <FormInput label="Your Name" name="adminName" value={formData.adminName} onChange={handleChange} required placeholder="Jane Doe" />
                                <FormInput label="Your Email" name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} required placeholder="jane@acme.com" icon={faEnvelope} />
                                <FormInput label="Set Your Password" name="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} required placeholder="Min. 8 characters" icon={faLock} />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Plan Summary */}
                    <div className="p-8 bg-slate-50 border-l border-slate-100 flex flex-col justify-between">
                        <div className="sticky top-8">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-3">Your Plan</h3>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-2xl font-bold text-slate-800">{selectedPlan?.name || 'Loading...'}</h4>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 uppercase">
                                        {formData.billingCycle}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-extrabold text-slate-900">₹{currentDisplayPrice}</span>
                                    <span className="text-slate-500">/{formData.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                                {settings.trialDurationDays > 0 && (
                                    <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center">
                                        First {settings.trialDurationDays} days are free!
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-3 mt-6 text-sm">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <FontAwesomeIcon icon={faUsers} className="text-blue-500 w-4" />
                                    <span>{selectedPlan?.max_users === -1 ? 'Unlimited' : selectedPlan?.max_users} Users</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <FontAwesomeIcon icon={faBuilding} className="text-blue-500 w-4" />
                                    <span>{selectedPlan?.max_storage_gb === -1 ? 'Unlimited' : `${selectedPlan?.max_storage_gb} GB`} Storage</span>
                                </li>
                                <li className={`flex items-center gap-3 ${selectedPlan?.analytics ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                                    <FontAwesomeIcon icon={selectedPlan?.analytics ? faCheckCircle : faTimes} className={selectedPlan?.analytics ? 'text-emerald-500 w-4' : 'w-4'} />
                                    <span>Advanced Analytics</span>
                                </li>
                                <li className={`flex items-center gap-3 ${selectedPlan?.video_calling ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                                    <FontAwesomeIcon icon={selectedPlan?.video_calling ? faCheckCircle : faTimes} className={selectedPlan?.video_calling ? 'text-emerald-500 w-4' : 'w-4'} />
                                    <span>Video Calling</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="mt-8">
                            <button type="submit" disabled={loadingSubmit} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
                                {loadingSubmit ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin /> Provisioning Account...
                                    </>
                                ) : (
                                    <>
                                        Start Your Free Trial <FontAwesomeIcon icon={faArrowRight} />
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-slate-400 mt-4 text-center">By clicking, you agree to our Terms of Service and Privacy Policy.</p>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

// --- Child Components ---
const FormInput = ({ label, name, type = "text", value, onChange, icon, readOnly = false, required = false, placeholder = "" }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
        <div className="relative">
            {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><FontAwesomeIcon icon={icon} /></span>}
            <input 
                type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} required={required} placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${readOnly ? 'text-slate-500 cursor-not-allowed' : 'text-slate-800'} placeholder:text-slate-400`}
            />
        </div>
    </div>
);

const CheckboxToggle = ({ label, name, checked, onChange, icon }) => (
    <label className="flex items-center text-sm text-slate-700 font-medium cursor-pointer">
        <input 
            type="checkbox" 
            name={name} 
            checked={checked} 
            onChange={onChange} 
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2" 
        />
        <FontAwesomeIcon icon={icon} className="mr-1.5 text-blue-500" /> 
        {label}
    </label>
);

export default PlatformClientRegisterPage;