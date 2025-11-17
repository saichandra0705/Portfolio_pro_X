import React, { useState, useEffect } from 'react';
import { useAuth } from '/src/contexts/AuthContext';
import axios from '/src/api/axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSave, faKey, faSpinner, faUser, faEnvelope, faPhone, 
    faShieldAlt, faCheckCircle, faEdit, faTimes, faCamera, 
    faIdBadge, faCalendarAlt, faHistory, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

// --- Helper Functions ---
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

// Helper Component for Detail Rows (Used in View Mode)
const DetailItem = ({ label, value, icon, isStatus = false }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={icon} className="text-sm" />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-slate-700 font-medium">
                {value}
                {isStatus && <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-sm ml-2" title="Verified" />}
            </p>
        </div>
    </div>
);

// --- Custom Animations ---
const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
`;

const AdminProfilePage = () => {
    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // Added for tabs

    // Form State (for editing)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Initialize data from the authenticated user
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Saving changes...');

        try {
            // 1. Update Profile Info
            const profileRes = await axios.put('/profile/update', {
                name: formData.name,
                phone_number: formData.phone_number,
            });
            // Update context with new user data
            updateUser(profileRes.data.user);

            // 2. Update Password (if provided)
            if (passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    throw new Error("New passwords do not match.");
                }
                if (passwordData.newPassword.length < 6) {
                    throw new Error("New password must be at least 6 characters.");
                }
                if (!passwordData.currentPassword) {
                    throw new Error("Current password is required to set a new one.");
                }

                await axios.put('/profile/change-password', {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                });
            }

            toast.success('Profile updated successfully!', { id: toastId });
            setIsEditing(false);
            // Clear password fields after successful update
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to update profile.';
            toast.error(msg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        // Handle case where user is not yet loaded or is logged out
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4 text-blue-500" />
                    <p>Loading User Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-600 selection:bg-blue-100">
            <style>{pageStyles}</style>
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
                
                {/* --- Profile Header Card (View Mode) / Action Bar (Edit Mode) --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 relative">
                            <span className="text-3xl font-bold">{user?.name?.charAt(0).toUpperCase() || <FontAwesomeIcon icon={faUser} />}</span>
                            {isEditing && (
                                <button className="absolute bottom-[-10px] right-[-10px] p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors border-4 border-white" title="Change Avatar (Placeholder)">
                                    <FontAwesomeIcon icon={faCamera} className="text-sm" />
                                </button>
                            )}
                        </div>
                        {/* Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    <FontAwesomeIcon icon={faShieldAlt} className='mr-1' /> {capitalize(user.role)}
                                </span>
                                <span className="text-slate-400 text-sm">•</span>
                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-xs" /> {user.email}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full md:w-auto">
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faEdit} /> Edit Profile
                            </button>
                        ) : (
                            <button 
                                type="submit" form="profile-form" disabled={loading}
                                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                                Save Changes
                            </button>
                        )}
                        {isEditing && (
                            <button onClick={() => setIsEditing(false)} className="flex-1 md:flex-none p-2.5 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center">
                                <FontAwesomeIcon icon={faTimes} className="text-lg" />
                            </button>
                        )}
                    </div>
                </div>

                {/* --- Tabs --- */}
                <div className="flex border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Security & Access
                    </button>
                </div>

                {/* --- Content Area --- */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                        
                        {/* Card 1: Personal Details / Edit Form */}
                        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Personal Information</h3>
                            
                            {isEditing ? (
                                <form id="profile-form" onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                            <input 
                                                type="text" name="name" value={formData.name} onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                                            <input 
                                                type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email (Read-only)</label>
                                            <input 
                                                type="email" value={formData.email} readOnly
                                                className="w-full px-4 py-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                    <DetailItem label="Full Name" value={user.name} icon={faUser} />
                                    <DetailItem label="Email Address" value={user.email} icon={faEnvelope} isStatus={true} />
                                    <DetailItem label="Phone Number" value={user.phone_number || 'Not provided'} icon={faPhone} />
                                    <DetailItem label="Joined Date" value={new Date(user.created_at).toLocaleDateString()} icon={faCalendarAlt} />
                                    <DetailItem label="User ID" value={user.id} icon={faIdBadge} />
                                    <DetailItem label="Role" value={capitalize(user.role)} icon={faShieldAlt} />
                                </div>
                            )}
                        </div>

                        {/* Card 2: Status & Permissions (View only) */}
                        {!isEditing && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Account Status</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <span className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheckCircle} /> Active Account
                                        </span>
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-500" /> Current Role
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            This account has **{capitalize(user.role)}** privileges, granting full access to system administration features.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </div>
                )}
                
                {activeTab === 'security' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fade-in-up">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faKey} className="text-blue-500" /> Change Password
                        </h3>
                        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                            <div className="space-y-4 bg-yellow-50/50 p-5 rounded-xl border border-yellow-100">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                                    <input 
                                        type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange}
                                        placeholder="Required to set new password"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                                        <input 
                                            type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                                        <input 
                                            type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button 
                                    type="submit" disabled={loading}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminProfilePage;