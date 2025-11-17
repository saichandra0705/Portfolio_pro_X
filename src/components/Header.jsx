import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAppSettings } from '../contexts/AppSettingsContext';

// --- Icons ---
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A.75.75 0 0119.5 21H4.5a.75.75 0 01-.416-.713z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

const Header = ({ toggleSidebar }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const { settings, loading: settingsLoading } = useAppSettings();
    const navigate = useNavigate();
    
    // State for Profile Dropdown
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    // Loading State
    if (settingsLoading) {
        return (
            <header className="fixed top-0 left-0 w-full p-4 shadow-md flex justify-between items-center z-50 bg-gray-900 text-white h-16">
                <span className="text-xl font-bold animate-pulse">Loading...</span>
            </header>
        );
    }

    // Settings & Styles
    const siteName = settings?.hospitalName || 'Hospital RMS';
    const logoUrl = settings?.logoUrl || '';

    const headerStyle = settings?.isGlassEffectEnabled
      ? {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: settings?.navbarTextColor || '#ffffff',
        }
      : {
          background: `linear-gradient(to right, ${settings?.navbarColorStart || '#005f9e'}, ${settings?.navbarColorEnd || '#003a6b'})`,
          color: settings?.navbarTextColor || '#ffffff',
        };

    return (
        <header 
            className="fixed top-0 left-0 w-full h-16 px-4 sm:px-6 shadow-md flex justify-between items-center z-50 transition-all duration-300"
            style={headerStyle}
        >
            {/* --- Left: Toggle & Brand --- */}
            <div className="flex items-center gap-3">
                {isAuthenticated && (
                    <button 
                        onClick={toggleSidebar} 
                        className="p-2 rounded-md hover:bg-white/10 md:hidden text-inherit focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        <MenuIcon />
                    </button>
                )}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90 transition-opacity" style={{ color: "inherit" }}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
                    ) : (
                        <span>{siteName}</span>
                    )}
                </Link>
            </div>

            {/* --- Right: Navigation & User --- */}
            <nav className="flex items-center space-x-4">
                {!isAuthenticated ? (
                    // Guest View
                    <>
                        <Link to="/" className="text-sm font-medium hover:underline hidden sm:block" style={{ color: "inherit" }}>Home</Link>
                        <Link to="/register" className="text-sm font-medium hover:underline hidden sm:block" style={{ color: "inherit" }}>Register</Link>
                        <Link to="/login" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all text-sm font-bold" style={{ color: "inherit" }}>
                            Login
                        </Link>
                    </>
                ) : (
                    // Authenticated View - Profile Dropdown
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 focus:outline-none"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <UserIcon />
                            </div>
                            <span className="hidden md:block text-sm font-medium truncate max-w-[150px]">
                                {user?.name || 'User'}
                            </span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                                    <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <Link
                                        to="/admin/profile" // Adjust path based on role if needed
                                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <ProfileIcon /> <span className="ml-3">My Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                    >
                                        <LogoutIcon /> <span className="ml-3">Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;