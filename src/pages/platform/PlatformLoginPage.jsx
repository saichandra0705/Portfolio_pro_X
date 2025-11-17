import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// We keep useAuth to potentially set a demo user, but don't validate with it
import { useAuth } from '/src/contexts/AuthContext'; 
import toast from 'react-hot-toast';

// --- INLINE SVG ICONS ---
const ShieldIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const SpinnerIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

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


const PlatformLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // We still need login to set the auth state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // --- DEMO MODE MODIFICATION ---
        // We will *attempt* to log in to set the auth context,
        // but we will redirect to the dashboard REGARDLESS of the result.
        
        try {
            // We call login to set the context state, but we will ignore
            // the response. In a real app, the `login` function in AuthContext
            // would also need to be in a "demo mode" to accept any password.
            // For now, we'll just ignore if it fails.
            await login(email || "demo@admin.com", password || "password", 'platform'); 
        
        } catch (error) {
            // In a real app, we'd show an error.
            // In demo mode, we ignore the error and proceed.
            console.warn("Demo login: Ignoring failed login attempt.", error.message);
        
        } finally {
            // Simulate a slight delay for realism and navigate
            setTimeout(() => {
                setLoading(false);
                toast.success('Welcome, Administrator! (Demo)');
                navigate('/platform/dashboard'); // <-- This is the redirect
            }, 1000); // 1-second delay
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
            <style>{customStyles}</style>

            <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fadeInUp">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-iconBounce">
                        <ShieldIcon className="w-9 h-9" />
                    </div>
                    <h1 className="mt-6 text-3xl font-bold text-gray-900">Platform Admin Login</h1>
                    <p className="mt-2 text-sm text-gray-600">Enter your credentials to access the admin panel.</p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center items-center w-full px-4 py-3 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all transform hover:scale-105"
                        >
                            {loading ? <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> : null}
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                
                <div className="text-center space-y-2">
                    <p className="text-sm">
                        <Link to="/platform/register" className="font-medium text-blue-600 hover:underline">
                            Don't have an account? Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlatformLoginPage;