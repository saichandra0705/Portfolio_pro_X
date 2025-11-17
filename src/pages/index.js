// HMS\hospital-frontend1\vite-project\src\pages\index.js
// Auth Pages
export { default as LoginPage } from './auth/LoginPage.jsx';
export { default as RegisterPage } from './auth/RegisterPage.jsx';

// Common Pages
export { default as HomePage } from './common/HomePage.jsx';
export { default as Unauthorized } from './common/Unauthorized.jsx';

// Admin Pages
export { default as AdminDashboard } from './admin/AdminDashboard.jsx';
export { default as AdminProfilePage } from './admin/AdminProfilePage.jsx';
export { default as AdminSettingsPage } from './admin/AdminSettingsPage.jsx';
export { default as UserManagementPage } from './admin/UserManagementPage.jsx';
export { default as UserDetailPage } from './admin/UserDetailPage.jsx'; // Add this line

// Doctor Pages
export { default as DoctorDashboard } from './doctor/DoctorDashboard.jsx';
export { default as DoctorProfilePage } from './doctor/DoctorProfilePage.jsx';
export { default as DoctorSettingsPage } from './doctor/DoctorSettingsPage.jsx';
export { default as PatientListPage } from './doctor/PatientListPage.jsx';
export { default as PatientHistoryPage } from './doctor/PatientHistoryPage.jsx';

// Patient Pages
export { default as PatientDashboard } from './patient/PatientDashboard.jsx';
export { default as BookAppointmentPage } from './patient/BookAppointmentPage.jsx';
export { default as RescheduleAppointmentPage } from './patient/RescheduleAppointmentPage.jsx';
export { default as PatientProfilePage } from './patient/PatientProfilePage.jsx';
export { default as PatientSettingsPage } from './patient/PatientSettingsPage.jsx';

// Receptionist Pages
export { default as ReceptionistDashboard } from './receptionist/ReceptionistDashboard.jsx';
export { default as ReceptionistProfilePage } from './receptionist/ReceptionistProfilePage.jsx';
export { default as ReceptionistSettingsPage } from './receptionist/ReceptionistSettingsPage.jsx';

// Department Admin Pages
export { default as DepartmentAdminDashboard } from './department-admin/DepartmentAdminDashboard.jsx';
export { default as AddAvailabilityPage } from './department-admin/AddAvailabilityPage.jsx';