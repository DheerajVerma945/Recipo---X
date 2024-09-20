import React, { useEffect, useState } from 'react';
import { FaCalendar, FaHistory, FaKey, FaSignOutAlt, FaUserTimes } from 'react-icons/fa';
import { logoutAll, getAllSessions, updatePassword, user } from '../appwriteService/auth';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader2 from '../components/Loader2';

function Settings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('password');
    const [oldPass, setOldPass] = useState('');
    const [pass, setPass] = useState('');
    const [joinData, setJoinData] = useState({});
    const [allSessionData, setAllSessionData] = useState([]);
    const { session } = useSelector((state) => state.auth);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const userId = session?.userId;
    useEffect(() => {
        if (!userId) {
            setError('User must be logged in to access this page');
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const joiningData = await user();
                const allSessions = await getAllSessions();
                setJoinData(joiningData);
                setAllSessionData(allSessions.sessions || []);
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const handleChangeUpdatedPass = (e) => {
        setPass(e.target.value);
    };

    const handleChangeOldPass = (e) => {
        setOldPass(e.target.value);
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updatePassword(pass, oldPass);
            setSuccessMsg('Password updated successfully');
            setError('');
        } catch (error) {
            setError('Error updating password. Please ensure the old password is correct.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutFromAllDevices = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await logoutAll();
            setSuccessMsg('Logged out from all devices successfully.');
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 2000);
        } catch (error) {
            setError('Error logging out from all devices.');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className='flex items-center justify-center h-screen text-red-500'>
                {error}
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row mt-24 items-center mb-28 md:mb-10 lg:mb-10">
            {loading && <Loader2 />}
            <div className="bg-white p-6 w-full md:w-64 lg:w-80 rounded-r-md shadow-2xl h-full mb-5">
                <div className="flex flex-col gap-5">
                    <button
                        onClick={() => {
                            setActiveTab('password');
                            setError('');
                            setSuccessMsg('');
                        }
                        }
                        className={`p-2 md:p-4 rounded-lg flex items-center ${activeTab === 'password' ? 'bg-[#8a3331] text-white' : 'text-gray-700'} transition-colors space-x-2`}
                    >
                        <FaKey className="text-lg" />
                        <span className='text-left text-sm md:text-md lg:text-lg'>Password</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('loginActivity')
                            setError('');
                            setSuccessMsg('');
                        }}
                        className={`p-2 md:p-4 rounded-lg flex items-center ${activeTab === 'loginActivity' ? 'bg-[#8a3331] text-white' : 'text-gray-700'} transition-colors space-x-2`}
                    >
                        <FaHistory className="text-lg" />
                        <span className='text-left whitespace-nowrap text-sm md:text-md lg:text-lg'>Login Activity</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('joiningDate')
                            setError('');
                            setSuccessMsg('');
                        }}
                        className={`p-2 md:p-4 rounded-lg flex items-center ${activeTab === 'joiningDate' ? 'bg-[#8a3331] text-white' : 'text-gray-700'} transition-colors space-x-2`}
                    >
                        <FaCalendar className="text-lg" />
                        <span className='text-left text-sm md:text-md lg:text-lg'>Joining Date</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('logoutAll')
                            setError('');
                            setSuccessMsg('');
                        }}
                        className={`p-2 md:p-4 rounded-lg flex items-center ${activeTab === 'logoutAll' ? 'bg-[#8a3331] text-white' : 'text-gray-700'} transition-colors space-x-2`}
                    >
                        <FaSignOutAlt className="text-lg" />
                        <span className='text-left text-sm md:text-md lg:text-lg'>Logout All</span>
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 w-full h-full flex items-center flex-col justify-center mb-5">
                {activeTab === 'password' && (
                    <div className='flex flex-col items-center'>
                        <h2 className="text-lg font-semibold mb-5">Change Password</h2>
                        <form onSubmit={changePassword} className="w-full max-w-sm">
                            <input
                                type="password"
                                placeholder="Enter current password"
                                onChange={handleChangeOldPass}
                                value={oldPass}
                                className="border p-2 mb-4 w-full"
                            />
                            <input
                                type="password"
                                placeholder="Enter new password"
                                onChange={handleChangeUpdatedPass}
                                value={pass}
                                className="border p-2 mb-4 w-full"
                            />
                            <button className={`bg-blue-500 text-white py-2 px-4 rounded w-full ${!oldPass || !pass ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!oldPass || !pass}>
                                Update Password
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'loginActivity' && (
                    <div className='flex flex-col items-center gap-10'>
                        <h2 className="text-lg font-semibold mb-4">Login Activity</h2>
                        {allSessionData.length > 0 && (
                            <div className="w-full max-w-4xl">
                                <h3 className="text-xl font-bold mb-4">Total Sessions ({allSessionData.length})</h3>
                                <div className={`grid ${allSessionData.length > 1 ? 'grid-cols-2 md:grid-cols-3 gap-4' : 'h-full'}`}>
                                    {allSessionData.map((sessions) => (
                                        <div
                                            key={sessions.$id}
                                            className="flex bg-gray-100 p-4 rounded-lg shadow-md"
                                        >
                                            <div className="flex-1 items-center justify-center mb-4">
                                                <h3 className="text-xl font-bold mb-2">Session Details</h3>
                                                <p className="text-md font-semibold">Created At:</p>
                                                <p className="text-sm text-gray-700 mb-2">{new Date(sessions.$createdAt).toLocaleString()}</p>
                                                <p className="text-md font-semibold">Country Name:</p>
                                                <p className="text-sm text-gray-700 mb-2">{sessions.countryName}</p>
                                                <p className="text-md font-semibold">IP Address:</p>
                                                <p className="text-sm text-gray-700 mb-2">{sessions.ip}</p>
                                                <p className="text-md font-semibold">Device:</p>
                                                <p className="text-sm text-gray-700">{sessions.deviceName}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {activeTab === 'joiningDate' && (
                    <div className='flex flex-col items-center gap-2'>
                        <h2 className="text-lg font-semibold">User Data</h2>
                        <p className="text-md text-gray-700 font-semibold">Name: {joinData.name}</p>
                        <p className="text-md text-gray-700 font-semibold">Email: {joinData.email}</p>
                        <p className="text-md text-gray-700 font-semibold">User joined on: {new Date(joinData.registration).toLocaleDateString()}</p>
                        <p className="text-md text-gray-700 font-semibold">Profile Updated: {new Date(joinData.$updatedAt).toLocaleDateString()}</p>
                    </div>
                )}

                {activeTab === 'logoutAll' && (
                    <div className='flex flex-col items-center'>
                        <h2 className="text-lg font-semibold mb-4">Logout from All Devices</h2>
                        <p className='text-mg text-gray-700 m-3'>End all active sessions and logout of all devices</p>
                        <button
                            onClick={handleLogoutFromAllDevices}
                            className="bg-red-500 text-white py-2 px-4 rounded w-full max-w-sm"
                        >
                            Logout from All Devices
                        </button>
                    </div>
                )}

                {error && <p className="text-red-500 m-4">{error}</p>}
                {successMsg && <p className="text-green-500 m-4">{successMsg}</p>}
            </div>
        </div>
    );
}

export default Settings;
