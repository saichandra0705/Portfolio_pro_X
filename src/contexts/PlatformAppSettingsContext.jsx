import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import axios from '../api/axios'; // ✅ Removed for Demo Mode
import { useAuth } from './AuthContext';

const PlatformAppSettingsContext = createContext(null);

export const usePlatformAppSettings = () => useContext(PlatformAppSettingsContext);

// --- Default / Fallback Settings ---
const defaultPlatformSettings = {
    platformName: 'Project X', 
    platformLogoUrl: '',
    
    // --- Generic Fields ---
    publicSiteName: 'Project X',
    hospitalName: 'Project X', // Kept for compatibility
    appTitle: 'Project X Portal',
    appFaviconUrl: '/favicon.ico',
    logoUrl: '',                 
    
    // --- Styling Defaults ---
    navbarColorStart: '#1e293b', // Slate 800
    navbarColorEnd: '#0f172a',   // Slate 900
    sidebarColorStart: '#1f2937', 
    sidebarColorEnd: '#0f172a',  
    navbarTextColor: '#ffffff',
    sidebarTextColor: '#e5e7eb', 
    sidebarSelectionColor: '#3b82f6', // Blue 500
    isGlassEffectEnabled: true
};

// --- ✅ MOCK DATA (Simulates Backend Response) ---
const MOCK_PLATFORM_SETTINGS = {
    platformName: 'Nexus SaaS',
    publicSiteName: 'Nexus SaaS',
    hospitalName: 'Nexus SaaS',
    appTitle: 'Nexus SaaS - Enterprise Platform',
    navbarColorStart: '#1e293b',
    navbarColorEnd: '#0f172a',
    isGlassEffectEnabled: true
};

export const PlatformAppSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultPlatformSettings);
    const [loading, setLoading] = useState(true);
    const { loading: authLoading } = useAuth();

    const applyPlatformSettings = (newSettings) => {
        if (!newSettings) return;
        
        // --- Apply Browser Tab Title ---
        document.title = newSettings.appTitle || newSettings.publicSiteName || newSettings.hospitalName || 'Nexus SaaS';

        // --- Apply Favicon ---
        if (newSettings.appFaviconUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.id = 'app-favicon';
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = newSettings.appFaviconUrl;
        }
    };

    // --- ✅ Updated Fetch Logic (Uses Mock Data) ---
    const fetchSettings = useCallback(async () => {
        try {
            // SIMULATING API CALL
            // const response = await axios.get('/public-platform/branding'); 
            
            // Instead, use Mock Data immediately
            const mockResponseData = MOCK_PLATFORM_SETTINGS;

            const name = mockResponseData.publicSiteName || mockResponseData.hospitalName || defaultPlatformSettings.publicSiteName;
            
            const mergedSettings = { 
                ...defaultPlatformSettings, 
                ...mockResponseData,
                publicSiteName: name,
                hospitalName: name 
            };

            setSettings(mergedSettings);
            applyPlatformSettings(mergedSettings);

        } catch (error) {
            console.error('Error loading settings (using defaults):', error);
            applyPlatformSettings(defaultPlatformSettings);
            setSettings(defaultPlatformSettings);
        } finally {
            setLoading(false); // ✅ Ensure loading stops
        }
    }, []); 

    useEffect(() => {
        // Load settings immediately, don't wait for auth check in this demo
        fetchSettings();
    }, [fetchSettings]);

    // Called by PlatformSettingsPage after update (Frontend simulation)
    const updatePlatformSettings = (newSettings) => {
        const relevantKeys = [
             'platformName', 'platformLogoUrl', 
             'publicSiteName', 'hospitalName', 
             'appTitle', 'appFaviconUrl', 'logoUrl', 
             'navbarColorStart', 'navbarColorEnd', 'navbarTextColor' 
        ];
        const updatedPublicSettings = {};
        relevantKeys.forEach(key => {
             if (newSettings.hasOwnProperty(key)) {
                  updatedPublicSettings[key] = newSettings[key];
             }
        });

        // Ensure name consistency
        const name = updatedPublicSettings.publicSiteName || updatedPublicSettings.hospitalName;
        if (name) {
            updatedPublicSettings.publicSiteName = name;
            updatedPublicSettings.hospitalName = name;
        }

        const mergedSettings = { ...settings, ...updatedPublicSettings };
        setSettings(mergedSettings);
        applyPlatformSettings(mergedSettings);
    };

    const value = {
        settings,
        loading, // Simplified loading state
        updatePlatformSettings,
        refreshSettings: fetchSettings
    };

    return (
        <PlatformAppSettingsContext.Provider value={value}>
            {children}
        </PlatformAppSettingsContext.Provider>
    );
};