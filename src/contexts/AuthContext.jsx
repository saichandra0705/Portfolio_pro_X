import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// We don't need axios for the demo login
// import axios from '/src/api/axios'; 

const AuthContext = createContext(null);

const PLATFORM_TENANT_KEY = 'platformSelectedTenant';
const USER_TYPE_KEY = 'userType';

// --- MOCK USER DATA (Simulates a real user from database) ---
const MOCK_PLATFORM_USER = {
    id: 1,
    name: "Demo Super Admin",
    email: "admin@demo.com",
    role: "platform_admin", // This role is CRITICAL for PrivateRoute
    tenant_id: null
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [tenant, setTenant] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [wasLoggedOut, setWasLoggedOut] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTenant, setSelectedTenant] = useState(null); 
    
    // Effect 1: Handles Axios Header based on Token (Still useful if some APIs work)
    useEffect(() => {
        // This part is fine, it just configures axios if a token exists.
        if (token) {
            // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log("Axios: Authorization header set.");
        } else {
            // delete axios.defaults.headers.common['Authorization'];
            console.log("Axios: Authorization header cleared.");
        }
    }, [token]);

    // Effect 2: Load user from storage on refresh
    useEffect(() => {
        const loadUserFromStorage = () => {
            setLoading(true);
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                console.log("AuthContext: Found user in storage, restoring session.");
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                console.log("AuthContext: No session in storage.");
            }
            setLoading(false); // We are done loading
        };

        loadUserFromStorage();
    }, []);
    
    const selectTenant = useCallback((tenant) => {
        // This function logic is fine
        if (tenant && tenant.id && tenant.subdomain) {
            setSelectedTenant(tenant);
            localStorage.setItem(PLATFORM_TENANT_KEY, JSON.stringify(tenant));
        } else {
            setSelectedTenant(null);
            localStorage.removeItem(PLATFORM_TENANT_KEY);
        }
    }, []);
    
    const clearTenant = useCallback(() => {
        selectTenant(null);
    }, [selectTenant]);
    
    // --- ✅ MODIFIED LOGIN FUNCTION (DEMO MODE) ---
    const login = async (email, password, loginType = 'staff') => {
        console.log(`AuthContext: DEMO login for: ${email}. Type: ${loginType}`);
        setLoading(true);
        setError(null);
        
        // Simulate a 1-second network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // We will just return a mock user, no matter what.
        
        if (loginType === 'platform') {
            const mockUser = { ...MOCK_PLATFORM_USER, email: email };
            const mockToken = "demo-platform-token-12345";
            
            // Save to local storage
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem(USER_TYPE_KEY, loginType);
            
            // Set state
            setUser(mockUser);
            setToken(mockToken);
            setTenant(null);
            setIsAuthenticated(true);
            setLoading(false);

            console.log("AuthContext: Demo login successful. User set to:", mockUser);
            return { user: mockUser };
        } else {
            // Handle tenant login (if you want to demo that)
            setLoading(false);
            const errorMessage = "Demo mode only supports Platform Admin login.";
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const logout = (navigateHome = true) => {
        console.log("AuthContext: Performing logout...");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tenant');
        localStorage.removeItem(PLATFORM_TENANT_KEY); 
        localStorage.removeItem(USER_TYPE_KEY); 

        setUser(null);
        setToken(null);
        setTenant(null); 
        setSelectedTenant(null); 
        setIsAuthenticated(false);
        setWasLoggedOut(true);
        setError(null);
        
        console.log("AuthContext: Logout complete. Authenticated:", false);
    };
    
    const refreshUser = async () => {
        console.log("AuthContext: refreshUser called (DEMO).");
        // In demo mode, we just return the user we already have in state.
        if (user) {
            return user;
        } else {
            logout();
        }
    };

    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const contextValue = { 
        user, 
        token, 
        tenant, 
        isAuthenticated, 
        loading, 
        wasLoggedOut, 
        error, 
        login, // Now using the DEMO login function
        logout, 
        refreshUser, 
        updateUser,
        selectedTenant,
        selectTenant,
        clearTenant
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};