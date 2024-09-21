import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verify } from '../appwriteService/auth';
import Loader2 from '../components/Loader2';
import { checkSessionThunk } from '../store/authSlice';
import { useDispatch } from 'react-redux';


const VerifyPage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [otp, setOtp] = useState('');
  const [loading,setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleVerification = async (e) => {
    setLoading(true);
    setErrorMessage('');
    e.preventDefault();
    setSuccessMessage('');
    try {
      await verify(userId, otp);
      setSuccessMessage('Email verified and logged in successfully! Redirecting to Home...');
      setErrorMessage('');
      setTimeout(() => {
        dispatch(checkSessionThunk());
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.message.includes("Creation of a session is prohibited when a session is active")) {
        setErrorMessage('Active account needs to be logged out first');
      } else {
        setErrorMessage('Verification failed. Please check your OTP and try again.');
      }
      setSuccessMessage('');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  gap-20 items-center justify-center min-h-screen bg-gray-100">
      {loading && <Loader2/>}
      <p className="text-center text-gray-700 mt-4 mb-6 text-lg font-medium">
        An email has been sent to you. Please enter the OTP below to verify your account.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Email</h2>
        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {successMessage && (
            <div className="mb-4 text-green-600 text-center">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-red-600 text-center">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
