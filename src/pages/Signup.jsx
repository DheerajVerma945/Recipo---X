import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupThunk } from '../store/authSlice';
import Loader2 from '../components/Loader2';
import { createUserDoc } from '../appwriteService/user';
const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleSubmit = async (event) => {
    setVerificationMessage('');
    setLoading(true);
    event.preventDefault();

    if (password !== confirmPassword) {
      setVerificationMessage('Passwords do not match.');
      setLoading(false);
      return;
    }
    let result ;
    try {
      result = await dispatch(signupThunk({ email, password, name })).unwrap();
      await createUserDoc(result.userId, name);
      if (!result.verified) {
        navigate(`/verify/${result.userId}`);
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setVerificationMessage(result.message || error.message || 'Signup failed. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-32 justify-center min-h-screen bg-gray-100">
      {loading && <Loader2 />}
      <h1 className=" font-extrabold text-center text-gray-800 mb-4">
        Be Part of the Recipe Magic: Create Your Free Account Today!
      </h1>
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {verificationMessage && (
            <div className="text-red-600 text-center text-sm">
              {verificationMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {status === 'loading' ? 'Signing...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Login</Link>
        </div>
      </div>
    </div>

  );
};

export default SignupPage;
