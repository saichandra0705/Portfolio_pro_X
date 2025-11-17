import React, { useState } from "react";
import axios from "../../api/axios"; // Use configured axios instance
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserPlus, 
    faEnvelope, 
    faLock, 
    faUser, 
    faPhone, 
    faCircleNotch 
} from '@fortawesome/free-solid-svg-icons';

// --- Custom CSS for Animations (Injected directly) ---
const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
`;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
        role: "user" // Default all new signups to 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        setLoading(true);

        try {
            // Create a payload without confirmPassword
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone_number: formData.phone_number,
                role: formData.role, // Send the default 'user' role
            };

            await axios.post("/api/auth/register", payload);

            toast.success("✅ Registered successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            console.error("Registration error:", err);
            const msg = err.response?.data?.message || "Registration failed. Please try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center font-sans text-white selection:bg-blue-500 selection:text-white">
            <style>{animationStyles}</style>

            {/* --- 1. Animated Background --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90"></div>
                
                {/* Floating Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* --- 2. Register Card --- */}
            <div className="relative z-10 w-full max-w-md px-4">
                
                <form
                    onSubmit={handleSubmit}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 text-center animate-fade-in-up"
                >
                    {/* Header Icon */}
                    <div className="mb-6 inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 shadow-inner">
                        <FontAwesomeIcon icon={faUserPlus} className="text-3xl text-blue-200" />
                    </div>

                    <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                        Create Your Account
                    </h2>
                    <p className="text-blue-200/70 mb-8 text-sm">
                        Join the platform to get started.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-3 animate-pulse">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-5 text-left">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faUser} className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                                required
                            />
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faEnvelope} className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faPhone} className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faLock} className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faLock} className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                                required
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 flex items-center justify-center gap-2
                            ${loading 
                                ? "bg-blue-600/50 cursor-not-allowed" 
                                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 hover:scale-[1.02] hover:shadow-blue-600/40 active:scale-95"
                            }`}
                    >
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-white/80" />
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <FontAwesomeIcon icon={faUserPlus} className="text-sm opacity-80" />
                            </>
                        )}
                    </button>

                    <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 flex justify-between items-center">
                        <Link to="/login" className="hover:text-white transition-colors">
                            ← Already have an account?
                        </Link>
                        <span>Powered by Project X</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;