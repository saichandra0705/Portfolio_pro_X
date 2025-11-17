import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { useAuth } from './AuthContext'; 

const AppSettingsContext = createContext(null);

export const useAppSettings = () => useContext(AppSettingsContext);

// Helper function
const safeParseBranches = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.warn("Failed to parse branches string into JSON:", data);
            return [];
        }
    }
    return []; // Default to empty array
};

const defaultInitialSettings = {
    platformName: 'Project X', 
    platformLogoUrl: '/default-logo.png', 
    publicSiteName: 'Project X', // Renamed from hospitalName
    appTitle: 'Project X', 
    logoUrl: null,
    appFaviconUrl: '/favicon.ico',
    navbarColorStart: '#005f9e',
    navbarColorEnd: '#003a6b',
    sidebarColorStart: '#1f2937',
    sidebarColorEnd: '#0f172a',
    navbarTextColor: '#ffffff',
    sidebarTextColor: '#e5e7eb',
    sidebarSelectionColor: '#007bff',
    isGlassEffectEnabled: false,
    branches: [], 
    mainLocation: { name: '', address: '', latitude: null, longitude: null }, // Renamed
    allowRegistration: true, 
    defaultTimezone: 'America/New_York',
};


export const AppSettingsProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth(); 
    const [settings, setSettings] = useState(null); 
    const [loading, setLoading] = useState(true);
    
    const [plans, setPlans] = useState(null);

    const applyGlobalSettings = (newSettings) => {
        if (!newSettings) return;
        // Updated title logic to be more robust
        document.title = newSettings.appTitle || newSettings.hospitalName || newSettings.publicSiteName || newSettings.platformName || 'Project X'; 
        const favicon = document.getElementById('app-favicon'); 
        if (favicon) {
            favicon.href = newSettings.appFaviconUrl || '/favicon.ico'; 
        }
        document.body.classList.toggle('glass-effect-enabled', !!newSettings.isGlassEffectEnabled);
    };

    // This function processes the settings object after it's fetched
    const processFetchedSettings = (rawSettings) => {
        if (!rawSettings) return null;
        
        // Handle tenant-specific name (hospitalName) vs platform public name (publicSiteName)
        const name = rawSettings.hospitalName || rawSettings.publicSiteName;

        const processedSettings = {
            ...rawSettings,
            publicSiteName: name, // Ensure publicSiteName is set
            hospitalName: name,   // Ensure hospitalName is also set for contexts that use it
            branches: safeParseBranches(rawSettings.branches), 
            mainLocation: (typeof rawSettings.mainLocation === 'object' && rawSettings.mainLocation !== null) 
                ? rawSettings.mainLocation 
                : (typeof rawSettings.mainHospitalLocation === 'object' && rawSettings.mainHospitalLocation !== null)
                    ? rawSettings.mainHospitalLocation // Fallback for old data
                    : defaultInitialSettings.mainLocation,
            allowRegistration: rawSettings.allowRegistration === true || rawSettings.allowRegistration === 'true',
            isGlassEffectEnabled: rawSettings.isGlassEffectEnabled === true || rawSettings.isGlassEffectEnabled === 'true',
        };
        return processedSettings;
    };

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        let finalSettings = null;
        let finalPlans = [];
        const hostname = window.location.hostname;
        
        const isMainDomain = (hostname === 'localhost' || hostname === '127.0.0.1'); 

        try {
            let response;
            if (!isMainDomain) {
                // --- CASE 1: On a subdomain (e.g., acme.localhost) ---
                console.log(`AppSettingsContext: Fetching merged tenant settings for subdomain: ${hostname}...`);
                response = await axios.get('/settings'); // Fetches { settings, plans }
                
                finalSettings = processFetchedSettings(response.data.settings);
                finalPlans = response.data.plans || [];

            } else {
                // --- CASE 2: On the main domain (e.g., localhost) ---
                console.log("AppSettingsContext: Fetching public platform branding...");
                response = await axios.get('/public-platform/branding');
                finalSettings = processFetchedSettings(response.data);
                
                try {
                    // This route should be public
                    const plansResponse = await axios.get('/public-platform/plans');
                    finalPlans = plansResponse.data || [];
                } catch (planError) {
                    console.warn("Could not fetch public plans", planError.message);
                    finalPlans = []; // Default to empty
                }
            }
        } catch (error) {
            console.error(`AppSettingsContext: Could not fetch settings:`, error.response?.status || error.message);
            finalSettings = { ...defaultInitialSettings }; 
            finalPlans = [];
        } finally {
            const completeSettings = { ...defaultInitialSettings, ...finalSettings };
            console.log("AppSettingsContext: Final settings state:", completeSettings);
            setSettings(completeSettings); 
            setPlans(finalPlans); 
            applyGlobalSettings(completeSettings); 
            setLoading(false);
        }
    }, [authLoading, user]); // Depends on auth state

    useEffect(() => {
        if (!authLoading) { // Only run once auth state is stable
            fetchSettings();
        }
    }, [authLoading, fetchSettings]);

    // Called by AdminSettingsPage after a PUT to /api/settings
    const updateSettings = (newResponseData) => { 
        const processedSettings = processFetchedSettings(newResponseData.settings);
        const mergedSettings = { ...defaultInitialSettings, ...settings, ...processedSettings }; 
        setSettings(mergedSettings);
        setPlans(newResponseData.plans || []); // Update plans on save
        applyGlobalSettings(mergedSettings);
    };

    const value = { 
        settings, 
        plans, // Expose plans
        loading: loading || authLoading, 
        updateSettings, 
        refreshSettings: fetchSettings
    };

    return (
        <AppSettingsContext.Provider value={value}>
            {(!loading && !authLoading && settings) ? children : (
                <div className="flex items-center justify-center min-h-screen text-xl">
                    Loading Settings...
                </div>
            )}
        </AppSettingsContext.Provider>
    );
};