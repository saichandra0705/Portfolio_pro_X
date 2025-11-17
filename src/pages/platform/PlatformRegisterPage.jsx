import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSpinner, faBolt } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
// Removed: axios

// --- STYLES & ANIMATIONS ---
const customStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes iconBounce {
        0%, 100% { transform: translateY(-10%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
        50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }

    .animate-iconBounce {
        animation: iconBounce 1.5s ease-in-out infinite;
    }
`;

const PlatformRegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Get plan details from URL (e.g., ?plan=pro)
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const plan = query.get('plan');
    
    const planName = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Show the demo message as requested
            toast.success("This is a demo. User will not be saved. Redirecting...", {
                duration: 3000,
            });
            
            setLoading(false);
            
            // Redirect to the login page
            navigate('/platform/login');
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
            <style>{customStyles}</style>
            
            <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fadeInUp">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-iconBounce">
                        <FontAwesomeIcon icon={faBolt} className="w-8 h-8" />
                    </div>
                    
                    <h1 className="mt-6 text-3xl font-bold text-gray-900">
                        {planName ? `Get Started with ${planName}` : 'Create Platform Account'}
                    </h1>
                    
                    <p className="mt-2 text-sm text-gray-600">
                        {planName 
                            ? `You're signing up for the ${planName} plan.` 
                            : 'Set up the first administrator account.'
                        }
                    </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                        <input id="name" name="name" type="text" required 
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Alex Sterling"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" name="email" type="email" required 
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="alex@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <input id="password" name="password" type="password" required minLength="6"
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <button type="submit" disabled={loading}
                            className="flex justify-center items-center w-full px-4 py-3 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-all transform hover:scale-105"
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> 
                                    Creating Account...
                                </>
                            ) : (
                                'Create Free Account'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="text-center">
                    <Link to="/platform/login" className="text-sm text-blue-600 hover:underline font-medium">
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PlatformRegisterPage;