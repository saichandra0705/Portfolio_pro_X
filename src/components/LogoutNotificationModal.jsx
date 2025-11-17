import React from 'react';

const LogoutNotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    // Overlay for the modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal content box */}
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center transform transition-all duration-300 scale-100 opacity-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Logged Out</h3>
        <p className="text-gray-700 mb-6">
          You have been logged out. Please log in again to continue.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default LogoutNotificationModal;