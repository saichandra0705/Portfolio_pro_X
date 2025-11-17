import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * This component protects routes by checking for user authentication
 * and verifying if the user's role is in the allowedRoles array.
 *
 * @param {Object} props
 * @param {string[]} props.allowedRoles - An array of roles allowed to access this route.
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 */
const PrivateRoute = ({ allowedRoles, children }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show a loading screen while authentication status is being checked
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        // User is not logged in.
        // Redirect them to the login page, saving their current location
        // so we can send them back after they log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if the user's role is in the allowedRoles array.
    // 'super_admin' is given universal access.
    const isAuthorized = user.role === 'super_admin' || (allowedRoles && allowedRoles.includes(user.role));

    if (!isAuthorized) {
        // User is logged in but does not have the required role.
        // Redirect them to an "Unauthorized" page.
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // User is authenticated and authorized. Render the requested component.
    return children;
};

export default PrivateRoute;