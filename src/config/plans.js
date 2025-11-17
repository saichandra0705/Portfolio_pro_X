//D:\code software\HMS\hospital-frontend1\vite-project\src\config\plans.js
export const PLAN_FEATURES = {
  basic: {
    name: 'Basic Plan',
    maxDoctors: 10,
    maxLocations: 1,
    maxReceptionists: 5,
    analytics: false,
    videoConsult: false,/////
  },
  pro: {
    name: 'Pro Plan',
    maxDoctors: 50,
    maxLocations: 5,
    maxReceptionists: 25,
    analytics: true,
    videoConsult: false,
  },
  enterprise: {
    name: 'Enterprise Plan',
    maxDoctors: Infinity, // Unlimited
    maxLocations: Infinity,
    maxReceptionists: Infinity,
    analytics: true,
    videoConsult: true,
  }
};

// Helper hook to easily get the current tenant's plan
// You would create this in a context, like useAuth or useAppSettings
export const useTenantPlan = () => {
    const { user } = useAuth(); // Assuming 'user' has tenant info
    const plan = user?.tenant?.plan || 'basic'; // Get plan from user
    return PLAN_FEATURES[plan];
};