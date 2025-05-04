import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type ErrorPageProps = {
  code?: number;
  message?: string;
};

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  code = 404, 
  message = 'The page you are looking for was not found.'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorState = location.state as { code?: number; message?: string } | null;
  
  const errorCode = errorState?.code || code;
  const errorMessage = errorState?.message || message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">{errorCode}</h1>
        <p className="text-xl text-gray-700 mb-6">{errorMessage}</p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 