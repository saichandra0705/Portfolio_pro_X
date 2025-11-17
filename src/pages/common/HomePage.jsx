import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faUsers, 
  faChartLine, 
  faShieldAlt, 
  faCogs, 
  faRocket 
} from '@fortawesome/free-solid-svg-icons';
import { useAppSettings } from "../../contexts/AppSettingsContext";

// --- Custom CSS for Entrance Animations (Injected directly) ---
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
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .animate-delay-100 { animation-delay: 0.1s; }
  .animate-delay-200 { animation-delay: 0.2s; }
  .animate-delay-300 { animation-delay: 0.3s; }
  .animate-float { animation: float 3s ease-in-out infinite; }
`;

export default function HomePage() {
  const { settings } = useAppSettings();
  const portalName = settings?.organizationName || 'Your Portal';

  // Features List to showcase capabilities
  const features = [
    { icon: faUsers, title: "User Management", desc: "Streamlined onboarding and role-based access control." },
    { icon: faChartLine, title: "Analytics", desc: "Real-time insights into your organization's performance." },
    { icon: faShieldAlt, title: "Enterprise Security", desc: "Data encryption and secure audit logs built-in." },
    { icon: faCogs, title: "Custom Workflows", desc: "Tailor the platform to fit your specific business needs." },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-white font-sans selection:bg-blue-500 selection:text-white">
      <style>{animationStyles}</style>

      {/* --- 1. Modern Animated Background --- */}
      <div className="absolute inset-0 z-0">
        {/* Dark Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* --- 2. Main Glassmorphism Container --- */}
      <main className="relative z-10 w-full max-w-6xl px-4 py-12 flex flex-col items-center">
        
        <div className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-16 text-center animate-fade-in-up">
          
          {/* Header Icon */}
          <div className="mb-6 inline-block p-4 rounded-full bg-blue-600/20 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-float">
            <FontAwesomeIcon icon={faBuilding} className="text-4xl md:text-5xl text-blue-300" />
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Welcome to <br className="md:hidden"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
              {portalName}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your centralized workspace for managing team collaboration, data insights, and organizational growth. Secure, scalable, and ready for action.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/login"
              className="group relative px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Login <FontAwesomeIcon icon={faRocket} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              to="/register"
              className="px-8 py-3 rounded-full border border-white/30 hover:bg-white/10 text-white font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Register Account
            </Link>
          </div>

          {/* --- 3. Features Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 border-t border-white/10 pt-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 opacity-0 animate-fade-in-up`}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="mb-4 w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={feature.icon} className="text-2xl text-blue-300 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-blue-100/60 group-hover:text-blue-100/90 transition-colors">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Text */}
        <p className="mt-8 text-sm text-slate-400 animate-fade-in-up animate-delay-300">
          Powered by <strong>Project X</strong> • Cloud SaaS Infrastructure
        </p>

      </main>
    </div>
  ); 
}