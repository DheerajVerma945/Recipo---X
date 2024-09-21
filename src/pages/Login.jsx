import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../store/authSlice';
import Loader2 from '../components/Loader2';
import { reVerification } from '../appwriteService/auth';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { status } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const[userId,setUserId] = useState(null);

    const handleSubmit = async (event) => {
        setLoading(true);
        setError('');
        event.preventDefault();

        try {
            const res = await dispatch(loginThunk({ email, password })).unwrap();
            if(res.error && res.error === "Please verify your email to log in."){
                setError("Please verify your email to log in.");
                setUserId(res.id);
                setLoading(false);
                return;
            }
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col pt-32 items-center justify-center min-h-screen bg-gray-100 p-4">
            {loading && <Loader2 />}
            <p className="text-lg font-semibold text-gray-800 mb-8 text-center">
                Join the Recipe Revolution: Log In and Spice Up Your Cooking!
            </p>
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                            <label className="text-sm text-gray-600 flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    className="mr-2"
                                />
                                Show Password
                            </label>
                        </div>
                    </div>
                    {error && (
                        <p className="text-red-500 text-center text-sm mt-2">{error}</p>
                    )}
                    {error === "Please verify your email to log in." && 
                    <p className='inline m-3 font-semibold text-blue-600 hover:underline cursor-pointer'
                        onClick={()=>{
                            reVerification(userId,email);
                            navigate(`/verify/${userId}`);
                        }}
                    >
                        Verify
                    </p>
                    }
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {status === 'loading' ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">Don't have an account?</p>
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
