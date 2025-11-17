import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheck, faTimes, faCrown, faRocket, faBuilding, faUsers, faArrowRight, faSpinner, faBolt 
} from '@fortawesome/free-solid-svg-icons';
// Removed: axios, usePlatformAppSettings

// --- MOCK DATA (Replaces API & Context) ---
const mockSettings = {
    platformName: "Nexus SaaS",
    platformLogoUrl: null,
    trialDurationDays: 14
};

const mockPlans = [
    {
        plan_key: 'starter',
        name: 'Starter',
        price_monthly: 499,
        price_yearly: 4990,
        max_users: 5,
        max_storage_gb: 20,
        analytics: false,
        video_calling: false,
        isPopular: false
    },
    {
        plan_key: 'pro',
        name: 'Pro',
        price_monthly: 1999,
        price_yearly: 19990,
        max_users: 25,
        max_storage_gb: 100,
        analytics: true,
        video_calling: true,
        isPopular: true
    },
    {
        plan_key: 'enterprise',
        name: 'Enterprise',
        price_monthly: 7999,
        price_yearly: 79990,
        max_users: -1, // -1 means unlimited
        max_storage_gb: -1,
        analytics: true,
        video_calling: true,
        isPopular: false
    }
];

// --- STYLES & ANIMATIONS ---
const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200..900&display=swap');
    .font-outfit { font-family: 'Outfit', sans-serif; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulseGlow {
        0%, 100% { 
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); 
        }
        50% { 
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.8); 
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.7s ease-out forwards;
        opacity: 0;
    }
    
    .animate-pulseGlow {
        animation: pulseGlow 2.5s ease-in-out infinite;
    }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
`;

const PlatformPricingPage = () => {
    // Removed: settingsLoading
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    useEffect(() => {
        // Simulate fetching data
        const fetchPlans = () => {
            setLoading(true);
            setTimeout(() => {
                const sortedPlans = mockPlans.sort((a, b) => a.price_monthly - b.price_monthly);
                setPlans(sortedPlans);
                setLoading(false);
            }, 500); // Simulate network delay
        };
        fetchPlans();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-outfit text-slate-600">
            <style>{customStyles}</style>
            
            {/* --- Navbar (Simplified) --- */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        {mockSettings.platformLogoUrl ? (
                            <img src={mockSettings.platformLogoUrl} alt="Logo" className="h-8 rounded" />
                        ) : (
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <FontAwesomeIcon icon={faBolt} />
                            </div>
                        )}
                        {mockSettings.platformName}
                    </Link>
                    <div className="flex gap-4">
                        <Link to="/platform/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Login</Link>
                        <Link to="/platform/register" className="text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <div className="pt-20 pb-16 text-center px-4 overflow-hidden">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 animate-fadeInUp">
                    Simple, transparent pricing
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 animate-fadeInUp delay-100">
                    Choose the plan that's right for your organization. 
                    {mockSettings.trialDurationDays > 0 && (
                        <span className="block mt-2 text-blue-600 font-semibold">
                            Start with a {mockSettings.trialDurationDays}-day free trial. No credit card required.
                        </span>
                    )}
                </p>

                {/* Billing Toggle */}
                <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-sm mb-12 animate-fadeInUp delay-200">
                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle('yearly')}
                        className={`relative px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Yearly 
                        <span className="absolute -top-3 -right-3 text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">
                            Save 20%
                        </span>
                    </button>
                </div>
            </div>

            {/* --- Plans Grid --- */}
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => {
                        const isPopular = plan.isPopular;
                        const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
                        
                        return (
                            <div 
                                key={plan.plan_key} 
                                className={`relative bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-2 animate-fadeInUp
                                    ${isPopular ? 'border-blue-500 shadow-xl scale-100 md:scale-105 z-10' : 'border-slate-200 shadow-sm hover:shadow-lg'}
                                `}
                                style={{ animationDelay: `${0.1 * (index + 2)}s` }} // Staggered animation
                            >
                                {isPopular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg animate-pulseGlow">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-extrabold text-slate-900">₹{price}</span>
                                        <span className="text-slate-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-8 min-h-[40px]">
                                        Perfect for {plan.max_users === -1 ? 'large enterprises' : `teams up to ${plan.max_users} users`}.
                                    </p>

                                    <Link 
                                        to={`/platform/register?plan=${plan.plan_key}&cycle=${billingCycle}`}
                                        className={`block w-full py-3 rounded-xl text-center font-bold transition-all
                                            ${isPopular 
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30' 
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                            }
                                        `}
                                    >
                                        {mockSettings.trialDurationDays > 0 ? `Start ${mockSettings.trialDurationDays}-Day Free Trial` : 'Get Started'}
                                    </Link>
                                </div>

                                <div className="p-8 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">What's included</p>
                                    <ul className="space-y-3">
                                        <FeatureItem label={`${plan.max_users === -1 ? 'Unlimited' : plan.max_users} Users`} icon={faUsers} />
                                        <FeatureItem label={`${plan.max_storage_gb === -1 ? 'Unlimited' : plan.max_storage_gb + 'GB'} Storage`} icon={faBuilding} />
                                        <FeatureItem label="Advanced Analytics" included={plan.analytics} />
                                        <FeatureItem label="Video Calling" included={plan.video_calling} />
                                        <FeatureItem label="Priority Support" included={isPopular || plan.max_users === -1} />
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- FAQ Section --- */}
            <div className="bg-white py-20 border-t border-slate-200">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-8 text-left">
                        <FAQItem 
                            q="Can I change plans later?"
                            a="Yes, you can upgrade or downgrade your plan at any time from the admin settings. Prorated charges or credits will be applied automatically."
                        />
                        <FAQItem 
                            q={`Is the ${mockSettings.trialDurationDays}-day trial really free?`}
                            a={`Yes, you get full access to all features on the Pro plan for ${mockSettings.trialDurationDays} days. No credit card is required to sign up.`}
                        />
                        <FAQItem 
                            q="What happens after my trial ends?"
                            a="Your account will be paused, but your data will be safe. You can then choose a paid plan to continue using the service."
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

// FAQItem component for expand/collapse (improves interactivity)
const FAQItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 pb-6">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex justify-between items-center w-full text-left"
            >
                <h3 className="font-bold text-lg text-slate-800">{q}</h3>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    <FontAwesomeIcon icon={faTimes} className="text-slate-400" />
                </div>
            </button>
            <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <p className="text-slate-600">{a}</p>
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ label, included = true }) => (
    <li className={`flex items-center gap-3 text-sm ${included ? 'text-slate-700' : 'text-slate-400'}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${included ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            <FontAwesomeIcon icon={included ? faCheck : faTimes} className="text-xs" />
        </div>
        <span className={!included ? 'line-through decoration-slate-300' : ''}>{label}</span>
    </li>
);

export default PlatformPricingPage;