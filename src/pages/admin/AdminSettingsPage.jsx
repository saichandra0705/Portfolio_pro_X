import React, { useState, useEffect, useMemo } from 'react';
// --- FIX: Using correct relative paths ---
import axios from '../../api/axios';
import { useAuth } from "../../contexts/AuthContext"; 
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

// --- INLINE SVG ICONS ---
const faSave = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const faArrowLeft = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const faPlusCircle = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const faTrash = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.54 0c.342.052.682.107 1.022.166m11.518 0c-1.154.03-2.306.06-3.46.09L12.5 5.86m-1.08 0c.362.03.728.06 1.09.09m-6.52 0c.362.03.728.06 1.09.09m0 0C8.12 6.03 9.47 6.13 10.875 6.13m2.25 0c.362.03.728.06 1.09.09m0 0c1.406.03 2.756.06 4.125.09" /></svg>;
const faMapMarkerAlt = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
const faExclamationTriangle = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.007H12v-.007Z" /></svg>;
const faLock = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>;
const faStar = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.31h5.513c.491 0 .702.659.337.95l-4.468 3.245a.563.563 0 0 0-.18.635l1.701 5.11c.146.44-.361.81-.74.528l-4.47-3.244a.563.563 0 0 0-.65 0l-4.47 3.244c-.379.282-.886-.088-.74-.528l1.701-5.11a.563.563 0 0 0-.18-.635l-4.468-3.245c-.365-.291-.154-.95.337-.95h5.513a.563.563 0 0 0 .475-.31l2.125-5.111Z" /></svg>;
const faSpinner = <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const faCalendarAlt = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>;
const faFileInvoiceDollar = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const faCrown = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0-1.319.769-2.5 1.907-3.037l-1.038-1.038A.562.562 0 0 1 11.25 5.25l2.25 2.25a.562.562 0 0 1-.397.957l-1.038-1.038C11.159 7.317 11.25 7.643 11.25 8c0 1.319-.769 2.5-1.907 3.037l1.038 1.038a.562.562 0 0 1 .397.957l-2.25 2.25a.562.562 0 0 1-.957-.397l1.038-1.038C9.75 12.317 9.75 11.642 9.75 11.25c0-1.319.769-2.5 1.907-3.037l-1.038-1.038A.562.562 0 0 1 9.75 6.75l2.25-2.25a.562.562 0 0 1 .397.957l-1.038 1.038C12.341 7.219 12.25 7.545 12.25 8c0 1.319.769 2.5 1.907 3.037l-1.038 1.038a.562.562 0 0 1-.397.957l2.25 2.25a.562.562 0 0 1 .957-.397l-1.038-1.038C14.25 12.317 14.25 11.642 14.25 11.25c0-1.319-.769-2.5-1.907-3.037l1.038-1.038a.562.562 0 0 1 .397-.957l-2.25-2.25a.562.562 0 0 1-.957.397l1.038 1.038C12.84 7.219 12.75 7.545 12.75 8Z" /></svg>;
const faUsers = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.003c0 1.113.285 2.16.786 3.07M15 19.128c-1.113 0-2.16-.285-3.07-.786m-1.927-4.47-2.16-2.16a2.25 2.25 0 0 0-3.182 0l-2.16 2.16m5.502 3.186a2.25 2.25 0 0 1-3.182 0l-2.16-2.16a2.25 2.25 0 0 1 0-3.182l2.16-2.16a2.25 2.25 0 0 1 3.182 0l2.16 2.16a2.25 2.25 0 0 1 0 3.182l-2.16 2.16Zm-4.34-4.34a.75.75 0 0 1 1.06 0l2.16 2.16a.75.75 0 0 1 0 1.06l-2.16-2.16a.75.75 0 0 1 1.06 0Zm-3.182 8.832c.312.312.652.574 1.01.796m1.01-.796A9.337 9.337 0 0 1 12 21.75c1.232 0 2.41-.297 3.485-.83m-3.485-.83a9.37 9.37 0 0 1-3.485.83M3.167 19.128c.312.312.652.574 1.01.796m1.01-.796A9.337 9.337 0 0 1 12 21.75c1.232 0 2.41-.297 3.485-.83m-3.485.83.003.001M18.833 19.128c-.312.312-.652.574-1.01.796m-1.01-.796A9.337 9.337 0 0 0 12 21.75c-1.232 0-2.41-.297-3.485-.83m3.485.83-.003.001" /></svg>;
const faBuilding = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75M13.5 3v18m0 0H9m4.5 0H18" /></svg>;
const faTimes = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const faToggleOn = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>;
const faToggleOff = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5A7.5 7.5 0 1 0 18.75 12a7.5 7.5 0 0 0-7.5-7.5ZM11.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>;
const faCamera = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574v9.574c0 1.067.75 1.994 1.802 2.169a47.865 47.865 0 0 0 1.134.175 2.31 2.31 0 0 1 1.64-1.055l.822-1.03a.75.75 0 0 0 0-1.152l-.822-1.03a2.31 2.31 0 0 1-1.64-1.055A47.881 47.881 0 0 0 3 12.828v-2.078c0-1.067.75-1.994 1.802-2.169 1.622-.29 3.29-.533 5.013-.69a.75.75 0 0 1 .71.71c.157 1.723.36 3.42.617 5.077a2.31 2.31 0 0 1-1.64 1.055l-.822 1.03a.75.75 0 0 0 0 1.152l.822 1.03a2.31 2.31 0 0 1 1.64 1.055c.257 1.657.46 3.354.617 5.077a.75.75 0 0 1-.71.71 47.88 47.88 0 0 0-5.013-.69c-1.052-.175-1.802-1.102-1.802-2.169v-9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l.822-1.03a.75.75 0 0 0-1.152 0l-.822 1.03a2.31 2.31 0 0 1 1.64 1.055c1.723.287 3.385.53 5.006.69 1.052.175 1.802 1.102 1.802 2.169v.808a2.31 2.31 0 0 1-1.64 1.055l-.822 1.03a.75.75 0 0 0 0 1.152l.822 1.03a2.31 2.31 0 0 1 1.64 1.055Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>;
const faCheck = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;
const faPalette = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M.5 1.5l1.374 2.062a8.25 8.25 0 0 1-.363 11.538l-1.373 2.062a.75.75 0 0 1-1.15-.832l1.374-2.062a8.25 8.25 0 0 1 .363-11.538l-1.373-2.062a.75.75 0 0 1 1.15-.832ZM12 22.5 10.626 20.438a8.25 8.25 0 0 1 11.538-.363l2.062 1.374a.75.75 0 0 1-.832 1.15l-2.062-1.374a8.25 8.25 0 0 1-11.538.363L12 22.5Zm10.125-10.125-2.062 1.374a8.25 8.25 0 0 1-.363 11.538l-2.062 1.374a.75.75 0 0 1-.832-1.15l2.062-1.374a8.25 8.25 0 0 1 .363-11.538l2.062-1.374a.75.75 0 0 1 .832 1.15ZM4.5 12 6.562 10.626a8.25 8.25 0 0 1 11.538.363L20.162 12a.75.75 0 0 1-1.15.832L16.95 11.458a8.25 8.25 0 0 1-1.158-.363L3.35 12.832a.75.75 0 0 1 1.15-.832Z" /></svg>;
const faCheckCircle = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const faUserCircle = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const faEnvelope = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const faPhone = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>;
// --- END ICONS ---

// --- Custom Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

// --- Helper Functions ---
const safeParseBranches = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) { return []; }
    }
    return [];
};
const defaultBranch = { branchName: '', branchLocation: '', address: '', latitude: '', longitude: '' };
const defaultMainLocation = { name: '', address: '', latitude: null, longitude: null };
const defaultFormState = {
    organizationName: '', appTitle: '', appFaviconUrl: '', logoUrl: '',
    mainLocation: { ...defaultMainLocation }, branches: [],
    navbarColorStart: '#005f9e', navbarColorEnd: '#003a6b', sidebarColorStart: '#1f2937',
    sidebarColorEnd: '#0f172a', navbarTextColor: '#ffffff', sidebarTextColor: '#e5e7eb',
    sidebarSelectionColor: '#007bff', defaultTimezone: 'America/New_York',
    allowRegistration: true, isGlassEffectEnabled: false,
    default_invoice_item_price: 0,
    payout_account_id: '',
};
const ensureObjectFormat = (data, defaultStructure) => {
     if (typeof data === 'object' && data !== null) {
        const sanitized = { ...defaultStructure };
        for (const key in defaultStructure) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== null && data[key] !== undefined) {
                sanitized[key] = data[key];
            }
        }
        return sanitized;
    }
    return { ...defaultStructure };
};
// --- End Helpers ---


const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const { 
        settings: globalSettings, 
        plans,
        loading: settingsLoading, 
        updateSettings, 
    } = useAppSettings();
    const { user, tenant, loading: authLoading, logout, updateUser } = useAuth(); 
    
    // --- State ---
    const [activeTab, setActiveTab] = useState('profile');
    const [isFormReady, setIsFormReady] = useState(false);
    
    // Profile State
    const [profileData, setProfileData] = useState({ name: '', email: '', phone_number: '' });
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Password State
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Org Settings State
    const [orgFormState, setOrgFormState] = useState({ ...defaultFormState });
    const [isOrgLoading, setIsOrgLoading] = useState(false);
    
    // Subscription State
    const [isBillingLoading, setIsBillingLoading] = useState(false);

    // --- Plan Logic ---
    const plansData = useMemo(() => {
        const planName = tenant?.plan || 'basic';
        if (!plans || plans.length === 0 || !tenant) {
            return [{ name: 'Loading...', max_users: 0, max_locations: 0, features_analytics: false, features_video_calling: false }, []];
        }
        const cPlan = {
            name: tenant.is_custom ? `${planName} (Custom)` : (plans.find(p => p.plan_key === planName)?.name || planName),
            is_custom: tenant.is_custom, price: tenant.price, billing_cycle: tenant.billing_cycle,
            subscription_expires_at: tenant.subscription_expires_at,
            max_users: tenant.max_users, max_locations: tenant.max_locations,
            features_analytics: tenant.features_analytics,
            features_video_calling: tenant.features_video_calling
        };
        const oPlans = plans
            .filter(plan => !plan.is_custom && plan.plan_key !== planName)
            .map(plan => ({
                ...plan,
                maxUsers: (plan.max_users === -1) ? Infinity : (plan.max_users || 0),
                maxLocations: (plan.max_locations === -1) ? Infinity : (plan.max_locations || 0),
                videoConsult: plan.video_calling,
            }));
        return [cPlan, oPlans];
    }, [tenant, plans]);

    const currentPlan = plansData[0];
    const otherPlans = plansData[1];
    // --- End Plan Logic ---

    // --- Data Initialization ---
    useEffect(() => {
        if (globalSettings && !settingsLoading && user && !isFormReady) {
            // For Org Settings Tab
            const mainLocationObject = ensureObjectFormat(globalSettings.mainLocation || globalSettings.mainHospitalLocation, defaultMainLocation);
            const branchesArray = safeParseBranches(globalSettings.branches).map(branch => ensureObjectFormat(branch, defaultBranch));
            setOrgFormState({
                ...defaultFormState, ...globalSettings, 
                organizationName: globalSettings.organizationName || globalSettings.hospitalName,
                mainLocation: mainLocationObject, branches: branchesArray,
                allowRegistration: globalSettings.allowRegistration ?? true,
                default_invoice_item_price: globalSettings.default_invoice_item_price || globalSettings.default_consultation_fee || 0,
                payout_account_id: globalSettings.payout_account_id || '',
            });
            
            // For Profile Tab
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
            });

            setIsFormReady(true);
        }
    }, [globalSettings, settingsLoading, user, isFormReady]);

    // --- Form Change Handlers ---
    const handleProfileChange = (e) => setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handlePasswordChange = (e) => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleOrgFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOrgFormState(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleMainLocationChange = (e) => {
        const { name, value } = e.target;
        setOrgFormState(prev => ({ ...prev, mainLocation: { ...(prev.mainLocation || defaultMainLocation), [name]: value } }));
    };
    const handleBranchChange = (index, e) => {
        const { name, value } = e.target;
        const newBranches = [...(orgFormState.branches || [])];
        if (!newBranches[index]) newBranches[index] = { ...defaultBranch };
        newBranches[index] = { ...newBranches[index], [name]: value };
        setOrgFormState(prev => ({ ...prev, branches: newBranches }));
    };
    const addBranch = () => {
        if (tenant.max_locations !== -1 && (1 + orgFormState.branches.length) >= tenant.max_locations) {
            toast.error(`Plan Limit Reached: Your plan only allows ${tenant.max_locations} location(s).`);
            return;
        }
        setOrgFormState(prev => ({ ...prev, branches: [...(prev.branches || []), { ...defaultBranch }] }));
    };
    const removeBranch = (index) => {
        setOrgFormState(prev => ({ ...prev, branches: (prev.branches || []).filter((_, i) => i !== index) }));
    };

    // --- Form Submit Handlers ---
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsProfileLoading(true);
        const toastId = toast.loading('Updating profile...');
        try {
            const response = await axios.put('/profile/update', {
                name: profileData.name,
                phone_number: profileData.phone_number,
            });
            updateUser(response.data.user);
            toast.success('Profile updated successfully!', { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile.', { id: toastId });
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error("New passwords do not match.");
        if (passwordData.newPassword.length < 6) return toast.error("Password must be at least 6 characters.");
        setIsPasswordLoading(true);
        const toastId = toast.loading('Changing password...');
        try {
            const response = await axios.put('/profile/change-password', passwordData);
            toast.success(response.data.message || 'Password changed!', { id: toastId });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password.', { id: toastId });
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleOrgSettingsSubmit = async (e) => {
        e.preventDefault();
        setIsOrgLoading(true);
        const toastId = toast.loading('Saving organization settings...');
        try {
            let payload = JSON.parse(JSON.stringify(orgFormState));
            payload.organizationName = payload.organizationName || payload.hospitalName;
            payload.mainLocation = ensureObjectFormat(payload.mainLocation || payload.mainHospitalLocation, defaultMainLocation);
            payload.branches = (payload.branches || []).map(branch => ensureObjectFormat(branch, defaultBranch));
            payload.default_invoice_item_price = parseFloat(payload.default_invoice_item_price || payload.default_consultation_fee) || 0.00;
            
            delete payload.hospitalName; delete payload.mainHospitalLocation; delete payload.default_consultation_fee;

            const totalLocations = 1 + payload.branches.length;
            if (tenant.max_locations !== -1 && totalLocations > tenant.max_locations) {
                throw new Error(`Plan Limit: Your plan only allows ${tenant.max_locations} location(s).`);
            }
            
            const response = await axios.put('/settings', payload); 
            updateSettings(response.data);
            toast.success('Settings saved successfully!', { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to save settings.', { id: toastId });
            if (err.response?.status === 401) { logout(); navigate('/login'); }
        } finally {
            setIsOrgLoading(false);
        }
    };
    
    const handleUpgradeClick = async (planKey) => {
        setIsBillingLoading(planKey);
        toast.loading('Processing upgrade...', { duration: 2000 });
        setTimeout(() => setIsBillingLoading(false), 2000);
    };

    // --- Loading State ---
    if (authLoading || settingsLoading || !isFormReady || !plans || !tenant) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-slate-500">
                <span className="animate-spin h-5 w-5 mr-3 text-blue-500">{faSpinner}</span>
                Loading Settings...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-600 selection:bg-blue-100">
            <style>{pageStyles}</style>
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                    <button onClick={() => navigate('/admin')} className="mt-2 md:mt-0 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <span className="w-5 h-5">{faArrowLeft}</span> Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* --- LEFT: Tab Navigation --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-6">
                            <nav className="flex flex-col gap-1">
                                <TabButton 
                                    label="My Profile" 
                                    icon={faUserCircle}
                                    isActive={activeTab === 'profile'} 
                                    onClick={() => setActiveTab('profile')} 
                                />
                                <TabButton 
                                    label="Security" 
                                    icon={faLock}
                                    isActive={activeTab === 'security'} 
                                    onClick={() => setActiveTab('security')} 
                                />
                                <TabButton 
                                    label="Organization" 
                                    icon={faBuilding}
                                    isActive={activeTab === 'organization'} 
                                    onClick={() => setActiveTab('organization')} 
                                />
                                <TabButton 
                                    label="Branding" 
                                    icon={faPalette}
                                    isActive={activeTab === 'branding'} 
                                    onClick={() => setActiveTab('branding')} 
                                />
                                <TabButton 
                                    label="Subscription" 
                                    icon={faCrown}
                                    isActive={activeTab === 'subscription'} 
                                    onClick={() => setActiveTab('subscription')} 
                                />
                                <TabButton 
                                    label="Danger Zone" 
                                    icon={faExclamationTriangle}
                                    isActive={activeTab === 'danger'} 
                                    onClick={() => setActiveTab('danger')} 
                                />
                            </nav>
                        </div>
                    </div>

                    {/* --- RIGHT: Tab Content --- */}
                    <div className="lg:col-span-3 space-y-6">
                        
                        {/* --- Profile Tab --- */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
                                <div className="p-8">
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Personal Information</h2>
                                    <p className="text-sm text-slate-500 mb-6">Update your name and contact details.</p>
                                    
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 border border-slate-200 relative">
                                            {user?.name?.charAt(0).toUpperCase()}
                                            <button type="button" className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full text-xs shadow-md hover:bg-blue-700 transition-colors" title="Change Avatar">
                                                <span className="w-4 h-4">{faCamera}</span>
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                                            <input 
                                                type="text" name="name" value={profileData.name} onChange={handleProfileChange}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormInput label="Email Address" name="email" value={profileData.email} icon={faEnvelope} readOnly={true} />
                                        <FormInput label="Phone Number" name="phone_number" value={profileData.phone_number} onChange={handleProfileChange} icon={faPhone} />
                                    </div>
                                </div>
                                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                    <button type="submit" disabled={isProfileLoading} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70">
                                        {isProfileLoading ? <span className="animate-spin w-4 h-4">{faSpinner}</span> : <span className="w-4 h-4">{faSave}</span>}
                                        {isProfileLoading ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* --- Security Tab --- */}
                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
                                <div className="p-8">
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Security</h2>
                                    <p className="text-sm text-slate-500 mb-6">Manage your password and account security.</p>
                                    <div className="space-y-5">
                                        <FormInput label="Current Password" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} icon={faLock} required={true} placeholder="••••••••" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required={true} placeholder="Min. 6 characters" />
                                            <FormInput label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required={true} placeholder="Re-type new password" />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                    <button type="submit" disabled={isPasswordLoading} className="px-6 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70">
                                        {isPasswordLoading ? <span className="animate-spin w-4 h-4">{faSpinner}</span> : <span className="w-4 h-4">{faSave}</span>}
                                        {isPasswordLoading ? 'Saving...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        {/* --- Organization Tab --- */}
                        {activeTab === 'organization' && (
                            <form onSubmit={handleOrgSettingsSubmit} className="space-y-6 animate-fade-in-up">
                                {/* Registration Toggle Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Public Registration</h3>
                                    <p className="text-sm text-slate-500 mb-4">Allow new users to create their own accounts from your login page.</p>
                                    <div 
                                        onClick={() => setOrgFormState(prev => ({...prev, allowRegistration: !prev.allowRegistration}))}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={orgFormState.allowRegistration ? 'text-blue-600' : 'text-slate-400'}>
                                                {orgFormState.allowRegistration ? faToggleOn : faToggleOff}
                                            </span>
                                            <div>
                                                <p className="font-semibold text-slate-700">Allow new user registration</p>
                                                <p className="text-xs text-slate-500">{orgFormState.allowRegistration ? "Public sign-up is ENABLED" : "Public sign-up is DISABLED"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Cards... */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Organization Locations</h2>
                                    <div className="space-y-4">
                                        {/* Main Office */}
                                        <div>
                                            <h3 className="text-md font-medium text-gray-600 mb-2">Main Office / HQ</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                <FormInput label="Organization Name" name="organizationName" value={orgFormState.organizationName || ''} onChange={handleOrgFormChange} />
                                                <FormInput label="Display Name" name="name" value={orgFormState.mainLocation?.name || ''} onChange={handleMainLocationChange} />
                                            </div>
                                            <FormInput label="Full Address" name="address" value={orgFormState.mainLocation?.address || ''} onChange={handleMainLocationChange} />
                                        </div>
                                        <hr className="my-4 border-gray-200" />
                                        {/* Branch Locations */}
                                        <div>
                                            <h3 className="text-md font-medium text-gray-600 mb-2">Branch Locations</h3>
                                            <div className="space-y-4">
                                                {(orgFormState.branches || []).map((branch, index) => (
                                                    <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3 relative group">
                                                        <button type="button" onClick={() => removeBranch(index)} className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all flex items-center justify-center"> <span className="w-3 h-3">{faTrash}</span> </button>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <FormInput label="Branch Name" name="branchName" value={branch.branchName || ''} onChange={(e) => handleBranchChange(index, e)} />
                                                            <FormInput label="Location ID" name="branchLocation" value={branch.branchLocation || ''} onChange={(e) => handleBranchChange(index, e)} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" onClick={addBranch} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                                <span className="w-5 h-5 mr-2">{faPlusCircle}</span> Add Branch
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50" disabled={isOrgLoading}>
                                        {isOrgLoading ? <span className="animate-spin w-5 h-5 mr-3">{faSpinner}</span> : <span className="w-5 h-5 mr-3">{faSave}</span>}
                                        {isOrgLoading ? 'Saving...' : 'Save Organization Settings'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* --- Branding Tab --- */}
                        {activeTab === 'branding' && (
                            <form onSubmit={handleOrgSettingsSubmit} className="space-y-6 animate-fade-in-up">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                                    <div className="p-8">
                                        <h2 className="text-xl font-bold text-slate-800 mb-1">Branding & Appearance</h2>
                                        <p className="text-sm text-slate-500 mb-6">Customize the look and feel of your portal.</p>
                                        
                                        <div className="space-y-5">
                                            <FormInput label="Logo URL" name="logoUrl" value={orgFormState.logoUrl || ''} onChange={handleOrgFormChange} placeholder="https://..." />
                                            <FormInput label="Favicon URL" name="appFaviconUrl" value={orgFormState.appFaviconUrl || ''} onChange={handleOrgFormChange} placeholder="https://.../favicon.ico" />
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer" onClick={() => setOrgFormState(prev => ({...prev, isGlassEffectEnabled: !prev.isGlassEffectEnabled}))}>
                                                <div className="flex items-center gap-3">
                                                    <span className={orgFormState.isGlassEffectEnabled ? 'text-blue-600' : 'text-slate-400'}>
                                                        {orgFormState.isGlassEffectEnabled ? faToggleOn : faToggleOff}
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-slate-700">Enable Glass Effect</p>
                                                        <p className="text-xs text-slate-500">Adds blur and transparency to UI elements.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <hr className="border-slate-100" />
                                            <h3 className="text-lg font-semibold text-slate-700">Color Theme</h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPicker label="Navbar Start" name="navbarColorStart" value={orgFormState.navbarColorStart} onChange={handleOrgFormChange} />
                                                <ColorPicker label="Navbar End" name="navbarColorEnd" value={orgFormState.navbarColorEnd} onChange={handleOrgFormChange} />
                                                <ColorPicker label="Sidebar Start" name="sidebarColorStart" value={orgFormState.sidebarColorStart} onChange={handleOrgFormChange} />
                                                <ColorPicker label="Sidebar End" name="sidebarColorEnd" value={orgFormState.sidebarColorEnd} onChange={handleOrgFormChange} />
                                                <ColorPicker label="Navbar Text" name="navbarTextColor" value={orgFormState.navbarTextColor} onChange={handleOrgFormChange} />
                                                <ColorPicker label="Sidebar Text" name="sidebarTextColor" value={orgFormState.sidebarTextColor} onChange={handleOrgFormChange} />
                                                <ColorPicker label="Sidebar Selection" name="sidebarSelectionColor" value={orgFormState.sidebarSelectionColor} onChange={handleOrgFormChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                        <button type="submit" disabled={isOrgLoading} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70">
                                            {isOrgLoading ? <span className="animate-spin w-5 h-5">{faSpinner}</span> : <span className="w-5 h-5">{faSave}</span>}
                                            {isOrgLoading ? 'Saving...' : 'Save Branding'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Live Preview Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Live Preview</h3>
                                    <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
                                        <div 
                                            className="w-1/3 h-full flex flex-col p-4 transition-all duration-300"
                                            style={{
                                                background: `linear-gradient(to bottom, ${orgFormState.sidebarColorStart}, ${orgFormState.sidebarColorEnd})`,
                                                color: orgFormState.sidebarTextColor
                                            }}
                                        >
                                            <div className="w-3/4 h-2 rounded-full bg-current opacity-20 mb-3"></div>
                                            <div className="w-full h-2 rounded-full bg-current opacity-70 mb-2"></div>
                                            <div className="w-1/2 h-2 rounded-full bg-current opacity-20"></div>
                                        </div>
                                        <div className="w-2/3 h-full flex flex-col">
                                            <div 
                                                className="w-full h-8 flex items-center px-4 shadow-md z-10"
                                                style={{
                                                    background: `linear-gradient(to right, ${orgFormState.navbarColorStart}, ${orgFormState.navbarColorEnd})`,
                                                    color: orgFormState.navbarTextColor
                                                }}
                                            >
                                                <div className="w-1/4 h-2 rounded-full bg-current opacity-70"></div>
                                            </div>
                                            <div className="p-4 space-y-2">
                                                <div className="w-full h-3 rounded-full bg-slate-200"></div>
                                                <div className="w-3/4 h-3 rounded-full bg-slate-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                        
                        {/* --- Subscription Tab --- */}
                        {activeTab === 'subscription' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in-up">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="text-yellow-500 w-6 h-6">{faCrown}</span>
                                    Subscription & Plan
                                </h2>
                                {(!plans || plans.length === 0) ? ( <p>Could not load plan details.</p> ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <PlanCard plan={currentPlan} isCurrent={true} />
                                        {otherPlans.map(plan => (
                                            <PlanCard key={plan.plan_key} plan={plan} isCurrent={false} onUpgrade={handleUpgradeClick} isLoading={isBillingLoading === plan.plan_key} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- Danger Zone Tab --- */}
                        {activeTab === 'danger' && (
                             <div className="bg-white rounded-2xl shadow-sm border-2 border-red-500/30 p-8 animate-fade-in-up space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-red-700">Danger Zone</h2>
                                    <p className="text-sm text-slate-500 mt-1">Be careful! These actions are permanent and cannot be undone.</p>
                                </div>
                                
                                <div className="border-t border-slate-100 pt-6">
                                    <h3 className="font-semibold text-slate-800">Reset All Passwords</h3>
                                    <p className="text-sm text-slate-500 mb-3">This will force every user in your organization to reset their password upon their next login.</p>
                                    <button 
                                        onClick={() => toast.error("This feature is not yet implemented.")} 
                                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Reset Passwords
                                    </button>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <h3 className="font-semibold text-red-700">Delete Organization</h3>
                                    <p className="text-sm text-slate-500 mb-3">This will permanently delete your organization, all its data, and all user accounts. This action is not recoverable.</p>
                                    <button 
                                        disabled={true}
                                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg transition-colors opacity-50 cursor-not-allowed"
                                    >
                                        Delete This Organization
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Child Components ---

const TabButton = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isActive 
            ? 'bg-blue-50 text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`}
    >
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
    </button>
);

const FormInput = ({ label, name, type = "text", value, onChange, icon, readOnly = false, required = false, placeholder = "" }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
            {icon && <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">{icon}</span>}
            <input 
                type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} required={required} placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${readOnly ? 'text-slate-500 cursor-not-allowed' : 'text-slate-800'}`}
            />
        </div>
    </div>
);

const ColorPicker = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <input
            type="color"
            name={name}
            value={value || '#000000'}
            onChange={onChange}
            className="w-10 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent"
        />
    </div>
);

const ToggleSwitch = ({ label, enabled, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${enabled ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'} border`}
    >
        <span className={`font-semibold ${enabled ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
        <div className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}></span>
        </div>
    </button>
);


const PlanCard = ({ plan, isCurrent, onUpgrade, isLoading }) => {
    // Calculate yearly savings
    let savings = 0;
    if (!isCurrent && plan.price_monthly > 0 && plan.price_yearly > 0) {
        const monthlyTotal = plan.price_monthly * 12;
        if (monthlyTotal > plan.price_yearly) {
            savings = Math.round(((monthlyTotal - plan.price_yearly) / monthlyTotal) * 100);
        }
    }

    return (
        <div className={`rounded-2xl p-6 flex flex-col ${isCurrent ? 'border-2 border-blue-500 bg-blue-50 shadow-lg' : 'border border-slate-200 bg-white hover:shadow-xl transition-all hover:-translate-y-1'}`}>
            {isCurrent && <span className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Current Plan</span>}
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
            
            {/* --- UPDATED: Show all pricing options --- */}
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                {isCurrent ? (
                    <div className="text-center">
                        <span className="text-3xl font-extrabold text-slate-800">₹{plan.price}</span>
                        <span className="text-sm text-slate-500"> / {plan.billing_cycle}</span>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Monthly</span> <span className="font-semibold">₹{plan.price_monthly}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Quarterly</span> <span className="font-semibold">₹{plan.price_quarterly}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Half-Yearly</span> <span className="font-semibold">₹{plan.price_half_yearly}</span></div>
                        <div className="flex justify-between text-sm font-bold text-blue-600 border-t border-slate-200 pt-1 mt-1"><span>Yearly</span> <span>₹{plan.price_yearly}</span></div>
                        {savings > 0 && <div className="text-xs text-center text-green-600 font-bold mt-1">Save {savings}% with Yearly</div>}
                    </div>
                )}
            </div>
            
            {isCurrent && (
                <div className="mb-4 space-y-1">
                    <div className="flex items-center text-slate-600 text-sm">
                        <span className="w-4 h-4 mr-2">{faCalendarAlt}</span>
                        <span>Renews: {plan.subscription_expires_at ? new Date(plan.subscription_expires_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
            )}

            <ul className="space-y-2.5 text-sm text-slate-600 mt-2 flex-grow">
                <li className="flex items-center gap-2"><span className="w-4 text-blue-500">{faUsers}</span> {plan.max_users === -1 ? "Unlimited" : plan.max_users} Users</li>
                <li className="flex items-center gap-2"><span className="w-4 text-blue-500">{faBuilding}</span> {plan.max_locations === -1 ? "Unlimited" : plan.max_locations} Locations</li>
                <li className={`flex items-center gap-2 ${plan.features_analytics ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                    <span className={`w-4 ${plan.features_analytics ? 'text-green-500' : 'text-slate-300'}`}>{plan.features_analytics ? faCheckCircle : faTimes}</span> Advanced Analytics
                </li>
                <li className={`flex items-center gap-2 ${plan.features_video_calling ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                    <span className={`w-4 ${plan.features_video_calling ? 'text-green-500' : 'text-slate-300'}`}>{plan.features_video_calling ? faCheckCircle : faTimes}</span> Video Calling
                </li>
            </ul>
            
            {!isCurrent && (
                <button 
                    type="button"
                    onClick={() => onUpgrade(plan.plan_key)}
                    disabled={isLoading}
                    className="mt-6 w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                    {isLoading ? <span className="animate-spin w-4 h-4">{faSpinner}</span> : <span className="w-4 h-4">{faStar}</span>}
                    {isLoading ? 'Processing...' : `Upgrade to ${plan.name}`}
                </button>
            )}
        </div>
    );
};

export default AdminSettingsPage;