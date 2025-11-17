import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-6">
                Sorry, you do not have the necessary permissions to access this page.
            </p>
            <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Go to Login
            </Link>
        </div>
    );
};

export default Unauthorized;