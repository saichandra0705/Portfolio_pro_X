import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// --- Contexts ---
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppSettingsProvider, useAppSettings } from './contexts/AppSettingsContext'; 
import { PlatformAppSettingsProvider, usePlatformAppSettings } from './contexts/PlatformAppSettingsContext';

// --- Layouts & Common Components ---
import Unauthorized from "./pages/auth/Unauthorized";
import Header from "./components/Header"; 
import Sidebar from "./components/Sidebar"; 
import PlatformNavbar from "./components/platform/Navbar"; 
import LogoutNotificationModal from "./components/LogoutNotificationModal";
import PrivateRoute from "./components/PrivateRoute";
import PlatformAdminLayout from "./components/layouts/PlatformAdminLayout";

// --- Auth Pages ---
import StaffLoginPage from "./pages/auth/StaffLoginPage"; 
import PlatformLoginPage from "./pages/platform/PlatformLoginPage";
import PlatformRegisterPage from "./pages/platform/PlatformRegisterPage";

// --- Platform Pages ---
import Portfolio from "./pages/Portfolio"; 
import PlatformLandingPage from "./pages/platform/PlatformLandingPage"; // ✅ Imported SaaS Landing Page
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import TenantListPage from "./pages/platform/TenantListPage";
import CreateTenantPage from "./pages/platform/CreateTenantPage";
import PlatformSettingsPage from "./pages/platform/PlatformSettingsPage";
import TenantSettingsPage from "./pages/platform/TenantSettingsPage";
import ViewTenantPage from "./pages/platform/ViewTenantPage";
import PlatformPricingPage from './pages/platform/PlatformPricingPage';

// --- Tenant Pages ---
import HomePage from "./pages/common/HomePage"; 
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import UserDetailPage from "./pages/admin/UserDetailPage";

// --- 1. Tenant Application Layout ---
const TenantLayout = () => {
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const { settings, loading: settingsLoading } = useAppSettings(); 
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const hostname = window.location.hostname;
    const isMainDomain = (hostname === 'localhost' || hostname === '127.0.0.1');

    useEffect(() => {
        if (!isMainDomain && !authLoading && isAuthenticated && ['/', '/login'].includes(location.pathname)) {
            let dashboardPath = '/admin'; 
            if (user.role === 'admin' || user.role === 'super_admin') {
                dashboardPath = '/admin';
            }
            navigate(dashboardPath, { replace: true });
        }
    }, [isAuthenticated, authLoading, location.pathname, navigate, user?.role, isMainDomain]);

    useEffect(() => {
        if (settings) {
            document.body.classList.toggle('glass-effect-enabled', settings.isGlassEffectEnabled);
        }
    }, [settings]);

    if (authLoading || settingsLoading) {
        return <div className="flex items-center justify-center min-h-screen text-xl">Loading application...</div>;
    }

    if (!isMainDomain && !isAuthenticated && location.pathname !== '/' && location.pathname !== '/login') {
         return <Navigate to="/" replace />;
    }
    
    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    
    const showHeader = isMainDomain ? isAuthenticated : true;
    const showSidebar = isAuthenticated;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {showHeader && <Header toggleSidebar={toggleSidebar} />}
            <div className={`flex flex-1 ${showHeader ? 'pt-16' : ''}`}>
                {showSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
                <main className={`flex-1 overflow-y-auto transition-margin duration-300 ${showSidebar ? 'md:ml-64' : 'ml-0'}`}>
                    <div className={showSidebar ? 'p-4 md:p-6' : ''}>
                        {isMainDomain ? (
                            <Routes>
                                <Route path="*" element={<Navigate to="/platform/dashboard" replace />} />
                            </Routes>
                        ) : (
                            <Routes>
                                <Route index element={<HomePage />} /> 
                                <Route path="login" element={<StaffLoginPage />} />
                                <Route path="admin/*" element={
                                    <PrivateRoute allowedRoles={["admin", "super_admin"]}>
                                        <AdminRoutes />
                                    </PrivateRoute>
                                } />
                                <Route path="*" element={<h1 className="text-center text-xl mt-10">404 - Page Not Found</h1>} />
                            </Routes>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- 2. Platform Application Layout ---
const PlatformLayout = () => {
    const { loading: settingsLoading } = usePlatformAppSettings(); 
    const location = useLocation();
    
    if (settingsLoading) {
         return <div className="flex items-center justify-center min-h-screen text-xl">Loading Platform...</div>;
    }

    // List of paths where the public navbar should be shown
    const publicAuthPaths = ['/login', '/register', '/platform/login', '/platform/register', '/platform/pricing', '/saas-demo'];
    
    const showPlatformNavbar = publicAuthPaths.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {showPlatformNavbar && <PlatformNavbar />} 
            <main className="flex-1">
                <Routes basename="/Portfolio_pro_X/">
                    <Route index element={<Portfolio />} />
                    
                    {/* ✅ Route for the SaaS Demo Page */}
                    <Route path="saas-demo" element={<PlatformLandingPage />} />
                    
                    <Route path="platform/pricing" element={<PlatformPricingPage />} />
                    <Route path="platform/login" element={<PlatformLoginPage />} />
                    <Route path="platform/register" element={<PlatformRegisterPage />} />
                    
                    <Route path="platform/*" element={<PrivateRoute allowedRoles={["platform_admin"]}><PlatformAdminLayout /></PrivateRoute>}>
                        <Route path="dashboard" element={<PlatformDashboard />} />
                        <Route path="tenants" element={<TenantListPage />} />
                        <Route path="create-tenant" element={<CreateTenantPage />} />
                        <Route path="settings" element={<PlatformSettingsPage />} />
                        <Route path="tenant-settings" element={<TenantSettingsPage />} />
                        <Route path="view-tenant/:tenantId" element={<ViewTenantPage />} />
                        <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>
                    
                    <Route path="*" element={<h1 className="text-center text-xl mt-10">404 - Page Not Found</h1>} />
                </Routes>
            </main>
        </div>
    );
};

// --- 3. Top-Level AppRouter ---
const AppRouter = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const hostname = window.location.hostname;
    const isMainDomain = (hostname === 'localhost' || hostname === '127.0.0.1');

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            const publicAuthPages = ['/login', '/register', '/platform/login', '/platform/register'];
            const isOnPublicAuthPage = publicAuthPages.includes(location.pathname);

            if (isOnPublicAuthPage) {
                let dashboardPath = '/';
                if (user.role === 'platform_admin') {
                    dashboardPath = '/platform/dashboard';
                } else if (user.role === 'admin') {
                    dashboardPath = '/admin'; 
                }
                navigate(dashboardPath, { replace: true });
            }
        }
    }, [isAuthenticated, authLoading, location.pathname, user, navigate, isMainDomain]);

    if (authLoading) {
         return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
    }

    if (isMainDomain) {
        return (
            <PlatformAppSettingsProvider>
                <Routes>
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/*" element={<PlatformLayout />} />
                </Routes>
            </PlatformAppSettingsProvider>
        );
    } else {
        return (
            <AppSettingsProvider>
                 <Routes>
                    <Route path="/*" element={<TenantLayout />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </AppSettingsProvider>
        );
    }
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-center" reverseOrder={false} />
                <AppRouter />
                <LogoutNotificationModal /> 
            </AuthProvider>
        </Router>
    );
}

const AdminRoutes = () => ( 
    <Routes> 
        <Route index element={<AdminDashboard />} /> 
        <Route path="profile" element={<AdminProfilePage />} /> 
        <Route path="settings" element={<AdminSettingsPage />} /> 
        <Route path="manage-users" element={<UserManagementPage />} /> 
        <Route path="user-details/:userId" element={<UserDetailPage />} /> 
    </Routes> 
);

export default App;