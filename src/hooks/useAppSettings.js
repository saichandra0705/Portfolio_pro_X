//D:\code software\HMS\hospital-frontend1\vite-project\src\hooks\useAppSettings.js
import { useEffect } from 'react';

const applySettings = (settings) => {
    if (settings) {
        document.documentElement.style.setProperty('--site-name', JSON.stringify(settings.hospitalName));
        document.documentElement.style.setProperty('--logo-url', JSON.stringify(settings.logoUrl));
        document.documentElement.style.setProperty('--color-navbar-bg', `linear-gradient(to right, ${settings.navbarColorStart}, ${settings.navbarColorEnd})`);
        document.documentElement.style.setProperty('--color-sidebar-bg', `linear-gradient(to bottom, ${settings.sidebarColorStart}, ${settings.sidebarColorEnd})`);

        if (settings.isGlassEffectEnabled) {
            document.body.classList.add('glass-effect-enabled');
        } else {
            document.body.classList.remove('glass-effect-enabled');
        }
    }
};

const useAppSettings = () => {
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/settings');
                if (!response.ok) {
                    throw new Error('Failed to fetch app settings from the backend.');
                }
                const settings = await response.json();
                
                // Optional: Save to localStorage for quick access on subsequent loads
                localStorage.setItem('appSettings', JSON.stringify(settings));
                
                applySettings(settings);
            } catch (error) {
                console.error('Error fetching app settings:', error);
                // Fallback to localStorage settings if API call fails
                const localSettings = JSON.parse(localStorage.getItem('appSettings'));
                if (localSettings) {
                    applySettings(localSettings);
                }
            }
        };
        fetchSettings();
    }, []);
};

export default useAppSettings;