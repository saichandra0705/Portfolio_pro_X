import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const ViewTenantPage = () => {
    const [tenants, setTenants] = useState([]);
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const { data } = await axios.get('/platform/tenants');
                setTenants(data);
            } catch (error) {
                toast.error('Failed to load tenants.');
            }
        };
        fetchTenants();
    }, []);

    const handleImpersonate = async () => {
        if (!selectedTenantId) {
            toast.error("Please select a tenant first.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`/platform/tenants/${selectedTenantId}/impersonate`);
            
            // The magic: open the tenant's admin dashboard in a new tab
            const tenantUrl = `http://${data.subdomain}.localhost:5173/admin`;
            
            // Store the special token in sessionStorage, which is specific to the new tab
            // This is better than localStorage because it won't overwrite your main platform admin login
            const newTab = window.open(tenantUrl, '_blank');
            if (newTab) {
                // We use a small delay to ensure the new tab is ready
                setTimeout(() => {
                    newTab.sessionStorage.setItem('token', data.token);
                    newTab.location.reload(); // Reload the page to apply the new token
                }, 1000);
                 toast.success(`Opening ${data.subdomain}'s dashboard in a new tab...`);
            } else {
                toast.error("Could not open new tab. Please disable your pop-up blocker.");
            }

        } catch (error) {
            toast.error("Failed to start impersonation session.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">View as Tenant Admin</h1>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <label className="block text-lg font-medium text-gray-700 mb-2">Select Tenant</label>
                <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                >
                    <option value="">-- Select a tenant to view --</option>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subdomain})</option>)}
                </select>

                <button
                    onClick={handleImpersonate}
                    disabled={!selectedTenantId || loading}
                    className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Generating Session...' : 'View Admin Dashboard'}
                </button>
            </div>
        </div>
    );
};

export default ViewTenantPage;

