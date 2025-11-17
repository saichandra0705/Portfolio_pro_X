import React, { useState, useEffect, useRef } from 'react';
// --- FIX: Using absolute paths from /src ---
import axios from '../../api/axios';
import { useAuth } from '/src/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '/src/contexts/AppSettingsContext';
import toast from 'react-hot-toast'; // Added toast for better feedback

// --- INLINE SVG ICONS ---
const faSearch = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const faDownload = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const faUpload = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>;
const faTrash = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.54 0c.342.052.682.107 1.022.166m11.518 0c-1.154.03-2.306.06-3.46.09L12.5 5.86m-1.08 0c.362.03.728.06 1.09.09m-6.52 0c.362.03.728.06 1.09.09m0 0C8.12 6.03 9.47 6.13 10.875 6.13m2.25 0c.362.03.728.06 1.09.09m0 0c1.406.03 2.756.06 4.125.09" /></svg>;
const faEdit = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const faChevronDown = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const faChevronUp = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>;
const faTimes = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const faUsers = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.12v.75A2.25 2.25 0 0 1 12.75 22H6.75A2.25 2.25 0 0 1 4.5 19.875v-9.375c0-1.036.84-1.875 1.875-1.875h3.14M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18 18.75a2.25 2.25 0 0 0 2.25-2.25V10.5a8.25 8.25 0 1 0-16.5 0v6a2.25 2.25 0 0 0 2.25 2.25H9M18 18.75A.75.75 0 0 0 17.25 18h-1.5A.75.75 0 0 0 15 18.75v.75M7.5 18.75A.75.75 0 0 0 6.75 18h-1.5A.75.75 0 0 0 4.5 18.75v.75" /></svg>;
const faUserPlus = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5H4.5m15 0a3 3 0 0 1 0 6H4.5m15-6a3 3 0 0 0-3-3H6m-1.5 6a3 3 0 0 1 3-3H12m0 0V3m0 0-3 3m3-3 3 3" /></svg>;
const faSpinner = <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const faCheckCircle = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const faTimesCircle = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
// --- END ICONS ---

// --- Custom Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

// Helper for API errors, logging out if 401
const handleApiError = (err, message, logout, navigate) => {
    if (err.response && err.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate('/login');
    } else {
        const errorMsg = err.response?.data?.message || err.message || message;
        toast.error(errorMsg);
        console.error(`${message}:`, err.response?.data || err.message);
    }
};

// Helper function to capitalize the first letter of a string
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// Generic Expanded Row Component
const ExpandedRow = ({ user }) => {
    const details = [
        { label: 'User ID', value: user.id },
        { label: 'Phone Number', value: user.phone_number || 'N/A' },
        { label: 'Role', value: capitalize(user.role) },
        { label: 'Joined Date', value: new Date(user.created_at).toLocaleDateString() },
        // You can add more fields here if needed
    ];

    return (
        <tr className="bg-blue-50/50 border-t border-blue-100 animate-fade-in-up">
            <td colSpan="5" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 p-2 rounded-lg border border-blue-100 bg-white">
                    {details.map((detail, index) => (
                        <div key={index} className='space-y-1'>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{detail.label}</p>
                            <p className="text-gray-800 font-medium">{detail.value}</p>
                        </div>
                    ))}
                </div>
            </td>
        </tr>
    );
};

const UserDetailPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState([]);

    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState(null); // Used primarily for non-toast errors like bulk
    const [successMessage, setSuccessMessage] = useState(null); // Used for bulk success
    const [bulkImportErrors, setBulkImportErrors] = useState([]);

    // State for editing a user
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Fetch all users
    const fetchData = async () => {
        if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) return;
        
        setTableLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const usersRes = await axios.get('/admin/users');
            setAllUsers(usersRes.data);
            setFilteredUsers(usersRes.data);

        } catch (err) {
            handleApiError(err, 'Failed to fetch user list', logout, navigate);
            setError('Failed to load user data. Access denied or API error.');
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    // Filter users based on search and role
    useEffect(() => {
        let tempUsers = allUsers;

        if (filterRole !== 'all') {
            tempUsers = tempUsers.filter(u => u.role === filterRole);
        }

        if (searchTerm) {
            tempUsers = tempUsers.filter(u =>
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(tempUsers);
    }, [allUsers, filterRole, searchTerm]);

    // Generic Export
    const handleExportUsers = () => {
        if (filteredUsers.length === 0) return toast.error('No users to export!');
        
        // Generic headers
        const headers = ["id", "name", "email", "role", "phone_number", "created_at"];
        
        const csvContent = [
            headers.join(','),
            ...filteredUsers.map(u => 
                headers.map(key => {
                    let value = u[key];
                    if (value === null || value === undefined) {
                        value = '';
                    } else if (typeof value === 'string' && value.includes(',')) {
                        value = `"${value}"`;
                    } else if (key === 'created_at') {
                        value = new Date(value).toLocaleDateString();
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        const filename = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${filteredUsers.length} users successfully!`);
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    // Generic Import
    const handleImportUsers = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const toastId = toast.loading('Processing bulk import...');
        setTableLoading(true);
        setError(null);
        setSuccessMessage(null);
        setBulkImportErrors([]);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            if (lines.length <= 1) {
                toast.error('The CSV file is empty or has no data.', { id: toastId });
                setTableLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const validHeaders = ['id', 'name', 'email', 'password', 'role', 'phone_number'];

            const usersToImport = lines.slice(1).map((line, index) => {
                const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Handles commas inside quotes
                const userObject = { row: index + 2 }; // Line number for error reporting
                
                headers.forEach((header, i) => {
                    if (validHeaders.includes(header)) {
                        let value = values[i]?.trim().replace(/"/g, '') || null;
                        if (header === 'id' && value) {
                            value = parseInt(value, 10) || null;
                        }
                        userObject[header] = value;
                    }
                });
                return userObject;
            });

            const usersToCreate = usersToImport.filter(u => !u.id && u.email);
            const usersToUpdate = usersToImport.filter(u => u.id && u.email);

            try {
                const results = { successes: 0, duplicates: 0, errors: [] };
                
                if (usersToCreate.length > 0) {
                    const createRes = await axios.post('/admin/users/bulk-create', usersToCreate);
                    results.successes += createRes.data.successes;
                    results.duplicates += createRes.data.duplicates;
                    results.errors.push(...createRes.data.errors.map(err => ({...err, row: err.row})));
                }

                if (usersToUpdate.length > 0) {
                    const updateRes = await axios.post('/admin/users/bulk-update', usersToUpdate);
                    results.successes += updateRes.data.successes;
                    results.errors.push(...updateRes.data.errors.map(err => ({...err, row: err.row})));
                }

                const finalMsg = `✅ Import complete. Created/Updated: ${results.successes}, Skipped/Duplicates: ${results.duplicates}. Errors: ${results.errors.length}`;
                toast.success(finalMsg, { id: toastId });
                setSuccessMessage(finalMsg);
                setBulkImportErrors(results.errors);

                // Re-fetch data
                await fetchData(); 

            } catch (err) {
                handleApiError(err, 'Bulk import failed', logout, navigate);
                const msg = err.response?.data?.message || 'Failed to import users.';
                toast.error(msg, { id: toastId });
                setError(msg);
            } finally {
                setTableLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete user: ${userName}? This action cannot be undone.`)) {
            return;
        }

        const toastId = toast.loading(`Deleting user ${userName}...`);
        try {
            await axios.delete(`/admin/users/${userId}`);
            toast.success(`User ${userName} deleted successfully.`, { id: toastId });
            setAllUsers(allUsers.filter(u => u.id !== userId));
        } catch (err) {
            handleApiError(err, `Failed to delete user ${userName}`, logout, navigate);
            toast.error(err.response?.data?.message || 'Failed to delete user.', { id: toastId });
        }
    };
    
    // Generic Edit
    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            role: user.role || 'user',
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    // Generic Update
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(`Updating user ${editingUser.name}...`);
        
        try {
            const payload = {
                name: editFormData.name || null,
                email: editFormData.email || null,
                phone_number: editFormData.phone_number || null,
                role: editFormData.role || 'user',
            };
            
            const response = await axios.put(`/admin/users/${editingUser.id}`, payload);

            toast.success(`User ${response.data.user.name} updated successfully!`, { id: toastId });
            setIsEditModalOpen(false);
            setEditingUser(null);
            
            // Re-fetch data
            await fetchData();

        } catch (err) {
            handleApiError(err, 'User update failed', logout, navigate);
            toast.error(err.response?.data?.message || 'Failed to update user. Please try again.', { id: toastId });
        }
    };

    const toggleRow = (id) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-6">You must be an administrator to view this page.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-600 selection:bg-blue-100">
            <style>{pageStyles}</style>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* --- Header --- */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                             {faUsers} User Management
                        </h1>
                        <p className="text-slate-500 mt-1">Manage, search, and audit all system users and their access levels.</p>
                    </div>
                    <button
                        onClick={() => toast.error("Feature not implemented yet!")}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> New User
                    </button>
                </div>
                
                {/* --- Main Content Card --- */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                    
                    {/* Filters and Actions */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                        <div className="flex flex-grow w-full md:w-auto items-center space-x-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{faSearch}</span>
                            </div>
                            
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full md:w-40 border border-gray-300 p-3 rounded-xl focus:ring-blue-500/50 focus:border-blue-500 text-sm bg-white cursor-pointer"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        {/* Import / Export Buttons */}
                        <div className="flex space-x-3 w-full md:w-auto">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImportUsers}
                                accept=".csv"
                                className="hidden"
                            />
                            <button
                                onClick={triggerFileUpload}
                                className="w-1/2 md:w-auto bg-blue-500 text-white py-2.5 px-4 rounded-xl hover:bg-blue-600 transition duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={tableLoading}
                            >
                                {tableLoading ? faSpinner : faUpload} Import
                            </button>
                            <button
                                onClick={handleExportUsers}
                                className="w-1/2 md:w-auto bg-green-500 text-white py-2.5 px-4 rounded-xl hover:bg-green-600 transition duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={filteredUsers.length === 0}
                            >
                                {faDownload} Export
                            </button>
                        </div>
                    </div>
                    
                    {/* Error and Success Messages */}
                    {(error || successMessage || bulkImportErrors.length > 0) && (
                        <div className="space-y-3 mb-6">
                            {error && (
                                <div className="bg-red-100 text-red-800 p-4 rounded-xl flex items-start shadow-sm">
                                    {faTimesCircle}
                                    <span className='font-medium'>{error}</span>
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-start shadow-sm">
                                    {faCheckCircle}
                                    <span className='font-medium'>{successMessage}</span>
                                </div>
                            )}
                            {bulkImportErrors.length > 0 && (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200">
                                    <h3 className="font-bold mb-2 flex items-center">Import Errors ({bulkImportErrors.length}):</h3>
                                    <ul className="list-disc list-inside text-sm max-h-40 overflow-y-auto pr-4">
                                        {bulkImportErrors.map((err, index) => (
                                            <li key={index}>
                                                <span className="font-semibold text-red-600">Line {err.row}:</span> {err.message} (Email: {err.email || 'N/A'})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* User Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                        {tableLoading ? (
                            <p className="p-6 text-center text-blue-600 font-medium flex items-center justify-center gap-2">
                                {faSpinner} Loading users...
                            </p>
                        ) : filteredUsers.length === 0 ? (
                            <p className="p-6 text-center text-gray-500">No users found matching your criteria.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredUsers.map(u => (
                                        <React.Fragment key={u.id}>
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button onClick={() => toggleRow(u.id)} className="text-gray-500 hover:text-blue-600 transition-colors">
                                                        {expandedRows.includes(u.id) ? faChevronUp : faChevronDown}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{u.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {capitalize(u.role)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                    <div className='flex space-x-2'>
                                                        <button
                                                            onClick={() => handleEditUser(u)}
                                                            className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                                                            title="Edit"
                                                        >
                                                            {faEdit}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id, u.name)}
                                                            className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Delete"
                                                        >
                                                            {faTrash}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedRows.includes(u.id) && <ExpandedRow user={u} />}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Edit User Modal */}
                {isEditModalOpen && editingUser && (
                    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center p-4 transition-opacity duration-300">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col transform scale-100 transition-transform duration-300 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h3 className="text-2xl font-bold text-slate-800">Edit User: {editingUser.name}</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                    {faTimes}
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                        <input 
                                            type="text" name="name" value={editFormData.name || ''} onChange={handleEditChange} 
                                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                        <input 
                                            type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} 
                                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                            required
                                        />
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                        <input 
                                            type="text" name="phone_number" value={editFormData.phone_number || ''} onChange={handleEditChange} 
                                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                                        <select
                                            name="role"
                                            value={editFormData.role || 'user'}
                                            onChange={handleEditChange}
                                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <div className='flex items-end'>
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-300 font-bold flex items-center justify-center gap-2"
                                        >
                                            {faEdit} Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailPage;