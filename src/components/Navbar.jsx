import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAppSettings } from "../contexts/AppSettingsContext";

// --- Inline SVG Icons ---
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

// --- Added User & Profile Icons ---
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


const Navbar = ({ toggleSidebar }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const { settings, loading: settingsLoading } = useAppSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null); // Ref for click-away listener

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false); // Close dropdown on logout
        navigate("/"); // Redirect to Homepage after logout
    };

    // Helper to determine the correct dashboard path based on user role
    const getDashboardPath = (role) => {
        switch (role) {
            case 'admin': return '/admin';
            case 'doctor': return '/doctor';
            case 'receptionist': return '/receptionist';
            case 'department_admin': return '/department-admin';
            case 'patient': return '/patient';
            default: return '/';
        }
    };
    
    // Close mobile menu on navigation
    useEffect(() => {
        setIsOpen(false);
        setIsProfileOpen(false); // Close profile dropdown on navigation
    }, [location.pathname]);

    // Click-away listener to close profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);


    const navStyle = settings?.isGlassEffectEnabled
        ? {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: settings?.navbarTextColor ?? 'white',
        } : {
            background: `linear-gradient(to right, ${settings?.navbarColorStart ?? '#005f9e'}, ${settings?.navbarColorEnd ?? '#003a6b'})`,
            color: settings?.navbarTextColor ?? 'white',
        };

    const logoUrl = settings?.logoUrl;
    const siteName = settings?.hospitalName || 'Hospital RMS';
    const dashboardPath = isAuthenticated ? getDashboardPath(user?.role) : '/';

    if (settingsLoading) {
        return <div className="h-16"></div>; // Placeholder
    }

    return (
        <nav style={navStyle} className="fixed top-0 left-0 right-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side: Logo/Brand and Menu Toggle */}
                    <div className="flex items-center">
                        {isAuthenticated && (
                            <button onClick={toggleSidebar} className="p-2 rounded-md text-inherit hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden mr-2">
                                <MenuIcon />
                            </button>
                        )}
                        <Link to={dashboardPath} className="flex items-center space-x-2 text-xl font-bold">
                            {logoUrl ? <img src={logoUrl} alt={siteName} className="h-8 w-auto" /> : <span>🏥 {siteName}</span>}
                        </Link>
                    </div>

                    {/* Right side: Navigation Links and Profile */}
                    <div className="flex items-center">
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10">Login</Link>
                                    <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10">Register</Link>
                                </>
                            ) : (
                                // --- NEW Profile Dropdown ---
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                                    >
                                        <UserIcon />
                                    </button>
                                    
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border dark:border-gray-700">
                                            <div className="px-4 py-2 border-b dark:border-gray-700">
                                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {user?.name || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {user?.email || 'No email provided'}
                                                </p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    to={`${dashboardPath}/profile`} // Assumes a profile page exists
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <ProfileIcon className="mr-3" />
                                                    My Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <LogoutIcon className="mr-3" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                // --- END Profile Dropdown ---
                            )}
                        </div>
                        
                        {/* Mobile Menu Button (Public) */}
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-inherit hover:bg-white/10 focus:outline-none">
                                {isOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full" style={{ backgroundColor: navStyle.background ?? '#004a7c' }}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Register</Link>
                            </>
                        ) : (
                            <>
                                {/* --- Added Profile Link to Mobile Menu --- */}
                                <Link 
                                    to={`${dashboardPath}/profile`}
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
                                >
                                    My Profile
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;