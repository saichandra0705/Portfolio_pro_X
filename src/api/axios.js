import axios from "axios";

/**
 * Dynamically determines the correct API base URL based on the browser's current hostname.
 * This is the core of the multi-tenant routing.
 */
const getApiBaseUrl = () => {
    const hostname = window.location.hostname; // e.g., "test3.localhost" or "localhost"
    const port = 5000; // Your backend port

    // Differentiate between platform admin URLs (at localhost) and tenant URLs (at subdomains)
    if (hostname === 'localhost') {
        // This handles the platform admin UI, e.g., http://localhost:5173/platform/dashboard
        return `http://localhost:${port}/api`;
    }
    
    // This handles all tenant subdomains, e.g., http://test3.localhost:5173
    return `http://${hostname}:${port}/api`;
};

// Create a base Axios instance. The baseURL will be set reliably by the interceptor.
const instance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * This interceptor is the critical fix. It runs BEFORE every single request is sent.
 * By setting the baseURL here, we guarantee it's always correct and avoid any
 * race conditions that can happen on page load.
 */
instance.interceptors.request.use(
    (config) => {
        // 1. Set or override the baseURL dynamically for EVERY request.
        config.baseURL = getApiBaseUrl();

        // 2. Attach the authentication token from local storage.
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 3. (Optional but recommended for debugging) Log the final URL to the console.
        // This will let you see in your browser's console if the URL is correct for every call.
        console.log(`[AXIOS] Sending request to: ${config.baseURL}${config.url}`);

        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default instance;

