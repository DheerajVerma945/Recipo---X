import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen mb-20 bg-gray-100  px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops! Page not found.</h1>
        <p className="text-gray-600 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <img
          src="https://media.giphy.com/media/A9EcBzd6t8DZe/giphy.gif"
          alt="Error illustration"
          className="w-full h-auto mb-6 rounded-lg"
        />
        <div className="flex justify-center items-center gap-10">
          <button
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
