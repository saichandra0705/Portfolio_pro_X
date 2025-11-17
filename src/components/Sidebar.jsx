//D:\code software\HMS backup\templet\raghu sir project\project_X\X-frontend\vite-project\src\components\Sidebar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// ⭐ 1. ONLY import useAppSettings (This is CORRECT)
import { useAppSettings } from '../contexts/AppSettingsContext'; 
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faTachometerAlt,
    faUserCircle,
    faCog,
    faUsers,
    faCalendarAlt,
    faClock,
    faUserPlus,
    faChartBar,
    faCalendarPlus,
    faBell,
    faClipboardList,
    faUserTag,
    faHospitalUser
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { user, isAuthenticated, token } = useAuth();

    // ⭐ 2. Get settings ONLY from useAppSettings (This is CORRECT)
    // This context correctly fetches the platform settings when on the main domain.
    const { settings, loading: settingsLoading } = useAppSettings();

    // ⭐ 3. Check domain (still needed for alert fetching logic)
    const hostname = window.location.hostname;
    const isMainDomain = (hostname === 'localhost' || hostname === '127.0.0.1');

    const [deptAdminAlertCount, setDeptAdminAlertCount] = useState(0);
    const [triageCount, setTriageCount] = useState(0);
    const [liveQueueCount, setLiveQueueCount] = useState(0);

    const fetchAlerts = useCallback(async () => {
        if (!isAuthenticated || !user?.role || !token) return;

        // Don't fetch tenant-specific alerts on the main patient portal
        if (isMainDomain) return; 

        if (user.role === 'department_admin') {
            try {
                const res = await axios.get(`/department-admin/doctors/alerts`, { params: { daysUntilExpiry: 3, countOnly: true } });
                setDeptAdminAlertCount(res.data.count || 0);
            } catch (err) { console.error("Failed to fetch department admin alerts:", err); }
        } else if (user.role === 'receptionist') {
            try {
                const res = await axios.get(`/receptionist/appointments/all`);
                setTriageCount(res.data.filter(a => a.status === 'triage_request').length);
            } catch (err) { console.error("Failed to fetch triage count:", err); }
        } else if (user.role === 'doctor') {
            try {
                const res = await axios.get(`/doctors/queue`);
                setLiveQueueCount(res.data.filter(a => a.status === 'checked_in').length);
            } catch (err) { console.error("Failed to fetch live queue count:", err); }
        }
    }, [isAuthenticated, user?.role, token, isMainDomain]); // Added isMainDomain

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 120000); // Refresh every 2 minutes
        return () => clearInterval(interval);
    }, [fetchAlerts]);

    // This check is now simpler and correct
    if (settingsLoading || !isAuthenticated) {
        return null;
    }

    const navItems = {
        patient: [
            { name: 'Dashboard', path: '/patient', icon: faTachometerAlt },
            { name: 'Book Appointment', path: '/patient/book', icon: faCalendarPlus },
            { name: 'My Profile', path: '/patient/profile', icon: faUserCircle },
            { name: 'Settings', path: '/patient/settings', icon: faCog },
        ],
        doctor: [
            { name: 'Dashboard', path: '/doctor', icon: faTachometerAlt },
            { name: 'Live Queue', path: '/doctor/queue', icon: faClock, alertCount: liveQueueCount },
            { name: 'Appointments', path: '/doctor/appointments', icon: faCalendarAlt },
            { name: 'My Profile', path: '/doctor/profile', icon: faUserCircle },
            { name: 'Settings', path: '/doctor/settings', icon: faCog },
        ],
        receptionist: [
            { name: 'Dashboard', path: '/receptionist', icon: faTachometerAlt },
            { name: 'Live Queue', path: '/receptionist/queue', icon: faClock },
            { name: 'Manage Appointments', path: '/receptionist/manage-appointments', icon: faClipboardList },
            { name: 'Triage Requests', path: '/receptionist/triage-requests', icon: faUserTag, alertCount: triageCount },
            { name: 'Manage Patients', path: '/receptionist/manage-patients', icon: faHospitalUser },
            { name: 'My Profile', path: '/receptionist/profile', icon: faUserCircle },
            { name: 'Settings', path: '/receptionist/settings', icon: faCog },
        ],
        admin: [
            { name: 'Dashboard', path: '/admin', icon: faChartBar },
            { name: 'Manage Users', path: '/admin/manage-users', icon: faUserPlus },
            { name: 'System Settings', path: '/admin/settings', icon: faCog },
            { name: 'My Profile', path: '/admin/profile', icon: faUserCircle },
        ],
        department_admin: [
            { name: 'Dashboard', path: '/department-admin', icon: faChartBar },
            { name: 'Schedule', path: '/department-admin/add-availability', icon: faCalendarPlus },
            { name: 'Scheduling Alerts', path: '/department-admin/alerts', icon: faBell, alertCount: deptAdminAlertCount },
            { name: 'My Profile', path: '/department-admin/profile', icon: faUserCircle },
            { name: 'Department Settings', path: '/department-admin/settings', icon: faCog },
        ],
    };

    const userNavItems = navItems[user?.role] || [];
    
    // ⭐ 4. This style block correctly reads the 'settings' object.
    // Your logs show settings.sidebarColorStart is "#1f2937" (dark grey).
    // This is working as intended.
    const sidebarStyle = settings?.isGlassEffectEnabled
        ? {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: settings?.sidebarTextColor ?? '#e5e7eb',
          }
        : {
            background: `linear-gradient(to bottom, ${settings?.sidebarColorStart ?? '#1f2937'}, ${settings?.sidebarColorEnd ?? '#0f172a'})`,
            color: settings?.sidebarTextColor ?? '#e5e7eb',
          };

    return (
        <aside
            className={`fixed top-16 bottom-0 left-0 w-64 p-5 space-y-6 transform transition-transform duration-300 z-40
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex md:flex-col`}
            style={sidebarStyle} // This style is being applied with the dark grey colors from your database.
        >
            <div className="flex items-center justify-between md:justify-center">
                <h2 className="text-3xl font-extrabold capitalize">
                    {user?.role ? user.role.replace('_', ' ') : ''}
                </h2>
                <button className="md:hidden text-2xl" onClick={toggleSidebar}>×</button>
            </div>
            <nav className="flex-grow overflow-y-auto">
                {userNavItems.map((item) => {
                    const isDashboard = item.name === 'Dashboard';
                    const isActive = isDashboard 
                        ? location.pathname === item.path 
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={isOpen ? toggleSidebar : undefined}
                            style={{
                                color: isActive 
                                    ? settings?.sidebarSelectionColor ?? '#007bff' 
                                    : 'inherit',
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            }}
                            className={`flex items-center py-2.5 px-4 rounded-lg transition duration-200 hover:bg-white/10 relative`}
                        >
                            {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg w-6" />}
                            <span className="flex-grow">{item.name}</span>
                            
                            {item.alertCount > 0 && (
                                <span className="ml-auto inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                    {item.alertCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;