import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Note: tailwindcss/vite is deprecated. Use postcss config instead if possible.
// import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: "/Portfolio_pro_X/",
  plugins: [react()], // Removed tailwindcss() - Configure via postcss.config.js
  esbuild: {
    loader: 'jsx',
    // Adjust include/exclude if needed, but this is typical for JS files using JSX
    include: /src\/.*\.(js|jsx)$/,
    exclude: [], // Ensure node_modules isn't included if problems arise
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // --- ADDED optimizeDeps SECTION ---
  optimizeDeps: {
    include: [
      'react-icons/gi', // Explicitly include Grommet Icons
      'react-icons/fa', // Explicitly include Font Awesome Icons
      // Add any other react-icons sets you use here, e.g., 'react-icons/md'
    ],
  },
  // --- END optimizeDeps SECTION ---
  server: {
    proxy: {
      '/api': { // More robust proxy configuration
           target: 'http://localhost:5000',
           changeOrigin: true, // Recommended for virtual hosted sites
           secure: false,      // If your backend is not HTTPS
      }
    },
    // Optional: Add watch config if HMR is unreliable in some environments
    // watch: {
    //   usePolling: true,
    // },
    hmr: {
        overlay: true // Keep the error overlay enabled
    }
  },
});

