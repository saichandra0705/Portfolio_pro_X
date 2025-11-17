// D:\code software\HMS backup\templet\raghu sir project\project_X\X-frontend\vite-project\src\components\MobileMenuButton.jsx
import React from 'react';

const MobileMenuButton = ({ toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className="md:hidden p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    </button>
  );
};

export default MobileMenuButton;