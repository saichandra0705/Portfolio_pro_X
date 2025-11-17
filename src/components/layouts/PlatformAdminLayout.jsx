import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTachometerAlt, 
    faRocket, // Changed from faHospital
    faPlusCircle, 
    faCogs, 
    faBuilding, 
    faSignOutAlt,
    faChevronDown,
    faChevronUp,
    faList
} from '@fortawesome/free-solid-svg-icons';

const PlatformAdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for the Tenants dropdown (Default open for convenience)
    const [isTenantsOpen, setIsTenantsOpen] = useState(true);

    const handleLogout = () => {
        navigate('/platform/login');
        logout();
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-bold border-b border-gray-800 flex items-center gap-3">
                    <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
                    <span>Project X</span>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                    
                    {/* 1. Dashboard (Outside Dropdown) */}
                    <NavLink
                        to="/platform/dashboard"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <FontAwesomeIcon icon={faTachometerAlt} className="w-5 h-5 mr-3" />
                        Dashboard
                    </NavLink>

                    {/* 2. Tenants Dropdown Group */}
                    <div>
                        <button
                            onClick={() => setIsTenantsOpen(!isTenantsOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 focus:outline-none"
                        >
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faBuilding} className="w-5 h-5 mr-3" />
                                <span>Tenants</span>
                            </div>
                            <FontAwesomeIcon icon={isTenantsOpen ? faChevronUp : faChevronDown} className="text-xs" />
                        </button>

                        {/* Dropdown Content */}
                        {isTenantsOpen && (
                            <div className="mt-1 ml-4 space-y-1 pl-4 border-l-2 border-gray-700 transition-all duration-300 ease-in-out">
                                <NavLink
                                    to="/platform/tenants"
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                                            isActive
                                                ? 'text-white bg-gray-700 font-medium'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <FontAwesomeIcon icon={faList} className="w-4 h-4 mr-3 opacity-70" />
                                    All Tenants
                                </NavLink>
                                
                                <NavLink
                                    to="/platform/create-tenant"
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                                            isActive
                                                ? 'text-white bg-gray-700 font-medium'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} className="w-4 h-4 mr-3 opacity-70" />
                                    Create Tenant
                                </NavLink>

                                <NavLink
                                    to="/platform/tenant-settings"
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                                            isActive
                                                ? 'text-white bg-gray-700 font-medium'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`
                                    }
                                >
                                    <FontAwesomeIcon icon={faCogs} className="w-4 h-4 mr-3 opacity-70" />
                                    Tenant Settings
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* 3. Other Pages (Outside Dropdown) */}
                    <NavLink
                        to="/platform/settings"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <FontAwesomeIcon icon={faCogs} className="w-5 h-5 mr-3" />
                        Platform Settings
                    </NavLink>

                    {/* --- Removed "Consultation Fees" NavLink --- */}

                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-colors duration-200 group"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PlatformAdminLayout;