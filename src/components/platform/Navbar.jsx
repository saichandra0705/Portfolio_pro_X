import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePlatformAppSettings } from "../../contexts/PlatformAppSettingsContext"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

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

// --- New Icons for Dropdown ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.439.208 1.776.208 3.95s.287 3.512-.208 3.95m-1.014 8.855c-.386 1.242-1.736 1.78-2.979 1.126l-.657-.379c-.55-.317-.736-1.012-.463-1.511a23.86 23.86 0 01.985-2.783" />
    </svg>
);
// ------------------------

const Navbar = ({ toggleSidebar }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const { settings, loading: settingsLoading } = usePlatformAppSettings();
    
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null); // Click-outside listener

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate("/"); 
    };

    const getDashboardPath = (role) => {
        switch (role) {
            case 'platform_admin': return '/platform/dashboard';
            default: return '/';
        }
    };
    
    // Close menus on navigation
    useEffect(() => {
        setIsOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    // Click-outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    const navStyle = {
        background: `linear-gradient(to right, ${settings?.navbarColorStart ?? '#2d3748'}, ${settings?.navbarColorEnd ?? '#1a202c'})`,
        color: settings?.navbarTextColor ?? '#ffffff',
    };

    const logoUrl = settings?.platformLogoUrl;
    const siteName = settings?.platformName || 'Project X'; 

    if (settingsLoading) {
        return <div className="h-16"></div>; 
    }

    return (
        <nav style={navStyle} className="fixed top-0 left-0 right-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* --- LEFT: Logo & Toggle --- */}
                    <div className="flex items-center">
                        {isAuthenticated && (
                            <button onClick={toggleSidebar} className="p-2 rounded-md text-inherit hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden mr-2">
                                <MenuIcon />
                            </button>
                        )}
                        <Link to={isAuthenticated ? getDashboardPath(user?.role) : "/"} className="flex items-center space-x-2 text-xl font-bold">
                            {logoUrl ? <img src={logoUrl} alt={siteName} className="h-8 w-auto" /> : <FontAwesomeIcon icon={faRocket} className="h-6 w-6" />}
                            <span>{siteName}</span>
                        </Link>
                    </div>

                    {/* --- RIGHT: Navigation --- */}
                    <div className="flex items-center">
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/#features" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10">Features</Link>
                                    <Link to="/#pricing" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10">Pricing</Link>
                                    <Link to="/platform/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10">Register</Link>
                                    <Link to="/platform/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10">Platform Login</Link>
                                </>
                            ) : (
                                // --- Profile Dropdown (Authenticated) ---
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                                    >
                                        <UserIcon />
                                    </button>
                                    
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 text-gray-800">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm text-gray-900 font-medium">
                                                    {user?.name || 'Administrator'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email || 'admin@example.com'}
                                                </p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    to="/platform/settings"
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <ProfileIcon className="mr-3 text-gray-400" />
                                                    Platform Settings
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                >
                                                    <LogoutIcon className="mr-3" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-inherit hover:bg-white/10 focus:outline-none">
                                {isOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu --- */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full" style={{ backgroundColor: navStyle.background ?? '#2d3748' }}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/#features" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Features</Link>
                                <Link to="/#pricing" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Pricing</Link>
                                <Link to="/platform/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Register</Link>
                                <Link to="/platform/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Platform Login</Link>
                            </>
                        ) : (
                            <>
                                <div className="px-3 py-2 border-b border-white/10 mb-2">
                                    <p className="text-sm font-bold">{user?.name}</p>
                                    <p className="text-xs opacity-70">{user?.email}</p>
                                </div>
                                <Link to="/platform/settings" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Platform Settings</Link>
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 text-red-300">
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