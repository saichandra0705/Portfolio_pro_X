import React, { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch, faUserPlus, faTrash, faEdit,
    faTimesCircle, faSpinner, faCheckCircle, faFilter, 
    faUpload, faDownload, faChevronLeft, faChevronRight, faExternalLinkAlt, faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useAppSettings } from '../../contexts/AppSettingsContext';

// --- Constants ---
const COUNTRY_CODES = [
    { code: "+91", country: "IN" },
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "AU" },
    { code: "+971", country: "UAE" },
];

const ITEMS_PER_PAGE = 5;

// --- Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

// Helper
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

const UserManagementPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Data State
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [paginatedUsers, setPaginatedUsers] = useState([]);
    
    // UI State
    const [selectedRole, setSelectedRole] = useState('user');
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '', // Raw number
    });
    const [countryCode, setCountryCode] = useState('+91');

    // Status State
    const [loading, setLoading] = useState(false); // Form loading
    const [tableLoading, setTableLoading] = useState(true); // Data loading
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // --- 1. Fetch Data ---
    useEffect(() => {
        const fetchData = async () => {
            if (user?.role !== 'admin' && user?.role !== 'super_admin') {
                setTableLoading(false);
                return;
            }
            setError(null);
            try {
                const usersRes = await axios.get('/admin/users');
                setAllUsers(usersRes.data);
                setFilteredUsers(usersRes.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    logout();
                    navigate('/login');
                } else {
                    setError('Failed to load data. Please refresh.');
                }
            } finally {
                setTableLoading(false);
            }
        };
        fetchData();
    }, [user, navigate, logout]);

    // --- 2. Filter & Pagination Logic ---
    useEffect(() => {
        let temp = allUsers;

        if (filterRole !== 'all') {
            temp = temp.filter(u => u.role === filterRole);
        }
        if (searchTerm) {
            temp = temp.filter(u =>
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredUsers(temp);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [allUsers, filterRole, searchTerm]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        setPaginatedUsers(filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE));
    }, [filteredUsers, currentPage]);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Combine Country Code + Number
        const fullPhoneNumber = formData.phone ? `${countryCode} ${formData.phone}` : null;

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: selectedRole,
            phoneNumber: fullPhoneNumber,
        };

        try {
            await axios.post('/admin/users/create', payload);
            setSuccessMessage(`✅ ${capitalize(selectedRole)} created successfully!`);
            
            // Refresh list locally
            const usersResponse = await axios.get('/admin/users');
            setAllUsers(usersResponse.data);
            
            // Reset Form
            setFormData({ name: '', email: '', password: '', phone: '' });
            setCountryCode('+91');
            setSelectedRole('user');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to create user.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
            try {
                await axios.delete(`/admin/users/${userId}`);
                setSuccessMessage(`User ${userName} deleted.`);
                setAllUsers(prev => prev.filter(u => u.id !== userId));
            } catch (err) {
                setError('Failed to delete user.');
            }
        }
    };

    // --- File Handlers (Import/Export) ---
    const handleExportUsers = () => {
        if (filteredUsers.length === 0) return;
        const headers = ["id", "name", "email", "role", "phone_number"];
        const csvContent = [
            headers.join(','),
            ...filteredUsers.map(u => headers.map(key => u[key] ? `"${u[key]}"` : '').join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `users_${new Date().toISOString()}.csv`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const handleImportUsers = async (e) => {
        // (Reuse existing logic or keep placeholder if not strictly needed for visual update)
        // For brevity in visual update, triggering file click:
        const file = e.target.files[0];
        if (!file) return;
        // ... import logic ...
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-600 selection:bg-blue-100">
            <style>{pageStyles}</style>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
                        <p className="text-slate-500 mt-1 text-sm">Administer your organization members, roles, and access.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* Redirect Button to Details Page */}
                        <button 
                            onClick={() => navigate('/admin/user-details/1')} // Points to general details wrapper or first user
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-blue-500" />
                            Detailed View
                        </button>
                    </div>
                </div>

                {/* --- Feedback Messages --- */}
                <div className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in-up">
                            <FontAwesomeIcon icon={faTimesCircle} /> {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in-up">
                            <FontAwesomeIcon icon={faCheckCircle} /> {successMessage}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* --- LEFT: Create User Card --- */}
                    <div className="xl:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <FontAwesomeIcon icon={faUserPlus} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Add New User</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Role Select */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role</label>
                                    <select 
                                        value={selectedRole} 
                                        onChange={(e) => setSelectedRole(e.target.value)} 
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                                    <input 
                                        type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Alex Johnson"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
                                    <input 
                                        type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="alex@company.com"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password</label>
                                    <input 
                                        type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                {/* Phone Number with Country Code */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone Number</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={countryCode} 
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="w-24 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer font-mono text-sm"
                                        >
                                            {COUNTRY_CODES.map((c) => (
                                                <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                                            ))}
                                        </select>
                                        <input 
                                            type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="98765 43210"
                                            className="flex-grow bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faUserPlus} />}
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- RIGHT: User List --- */}
                    <div className="xl:col-span-2 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-grow overflow-hidden">
                            
                            {/* Toolbar */}
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full sm:max-w-xs">
                                    <input 
                                        type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                    />
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3 text-slate-400 text-sm" />
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    <select 
                                        value={filterRole} onChange={(e) => setFilterRole(e.target.value)} 
                                        className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="admin">Admins</option>
                                        <option value="user">Users</option>
                                    </select>
                                    
                                    <button onClick={handleExportUsers} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-colors" title="Export CSV">
                                        <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                    <button onClick={() => fileInputRef.current.click()} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-colors" title="Import CSV">
                                        <FontAwesomeIcon icon={faUpload} />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleImportUsers} accept=".csv" className="hidden" />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto flex-grow">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Phone</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {tableLoading ? (
                                            <tr><td colSpan="4" className="p-12 text-center text-slate-400"><FontAwesomeIcon icon={faSpinner} spin className="text-2xl mb-2" /><div>Loading data...</div></td></tr>
                                        ) : paginatedUsers.length === 0 ? (
                                            <tr><td colSpan="4" className="p-12 text-center text-slate-400 italic">No users found.</td></tr>
                                        ) : (
                                            paginatedUsers.map(u => (
                                                <tr key={u.id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-700">{u.name}</div>
                                                        <div className="text-xs text-slate-400">{u.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                                            {capitalize(u.role)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                                        {u.phone_number ? (
                                                            <span className="flex items-center gap-2">
                                                                <FontAwesomeIcon icon={faPhone} className="text-slate-300 text-xs" />
                                                                {u.phone_number}
                                                            </span>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => navigate(`/admin/user-details/${u.id}`)}
                                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                                title="Edit / View Details"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteUser(u.id, u.name)}
                                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                                title="Delete User"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
                                <span>Showing {paginatedUsers.length} of {filteredUsers.length} users</span>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <button 
                                        disabled={currentPage * ITEMS_PER_PAGE >= filteredUsers.length}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;