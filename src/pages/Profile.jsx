import React, { useEffect, useState } from 'react';
import { logout, updateName, user } from '../appwriteService/auth';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDoc, uploadDpAndGetUrl, updateDp, updateBio } from '../appwriteService/user';
import { FaCamera, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Loader2 from '../components/Loader2';
import { FaCheck } from 'react-icons/fa6';

function Profile() {
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [confirmDpUpload, setConfirmDpUpload] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [displayedProfile, setDisplayedProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [error, setError] = useState(null);
  const [uploadImage, setUploadImage] = useState(false);
  const userId = session?.userId;

  useEffect(() => {
    if (!userId) {
      setError("User must be logged in ");
      return;
    }
    const getData = async () => {
      setLoading(true);
      try {
        const data = await user();
        const userData = await getUserDoc(data.$id)
        setName(data.name);
        setBio(userData.Bio || '');
        setDisplayedProfile(userData.Dp);
      }
      catch (error) {
        console.error(error);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [session]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setDisplayedProfile(URL.createObjectURL(e.target.files[0]))
      setProfilePic(e.target.files[0]);
      setUploadImage(true);
    }
  };

  const dpChanger = async () => {
    try {
      setUploadImage(false);
      const link = await uploadDpAndGetUrl(profilePic);
      await updateDp(userId, link);
      setConfirmDpUpload(true);
      setInterval(() => {
        setConfirmDpUpload(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  }
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateBio(userId, bio);
      await updateName(name);
      setAlertMessage('Profile updated successfully');
      setTimeout(() => setAlertMessage(''), 1500);

    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile.');
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };



  const confirmLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/");
      window.location.reload();

    } catch (error) {
      console.log('Error in logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-44 pb-40  flex flex-col items-center relative">
      <div className='flex justify-start items-center w-full'>
      </div>

      {editing && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
          <div className={`bg-white  p-6 rounded-lg shadow-lg relative h-auto w-11/12 max-w-lg`}>
            <button
              onClick={() => setEditing(false)}
              className="absolute top-2 right-2 text-2xl md:text-2xl lg:text-3xl text-gray-600 hover:text-gray-800"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center justify-center mb-4">
              <label className="relative">
                <img
                  src={displayedProfile}
                  alt="Profile"
                  className="h-28 w-28 object-cover rounded-full border-2 border-gray-300"
                />
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />

                <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full">
                  <FaCamera className="text-gray-600" />
                </div>
              </label>
              {confirmDpUpload &&
                <FaCheck color='white' className='bg-green-500  rounded-full mt-5 inline  ml-2' />
              }
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-4 w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Update your name"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-4 w-full h-32 p-2 border border-gray-300 rounded-lg resize-none"
                placeholder="Update your bio"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showLogoutModal && (
        <div className="absolute inset-0 top-32 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg relative h-auto w-11/12 max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadImage && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg relative h-auto w-11/12 max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-8">Upload Image</h2>
            <div className="flex justify-between">
              <button
                onClick={() => setUploadImage(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={dpChanger}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}


      {loading && <Loader2 />}
      <div className={`w-full max-w-lg p-6 bg-gray-100 rounded-lg shadow-2xl ${loading ? "hidden" : ""} border-t-white`}>


        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {alertMessage && (
          <div className="text-green-600 text-center mb-4 transition-opacity opacity-100">
            {alertMessage}
          </div>
        )}

        {!loading && !error && (
          <div className="text-center mb-10 ">
            <div className="relative h-36 w-36 mx-auto rounded-full border-2 border-blue-500 overflow-hidden">
              <img
                src={displayedProfile}
                alt="Profile"
                className="absolute top-0 left-0 h-full w-full  object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              {name || 'No user name available'}
            </h1>

            {bio && <p className="text-lg text-gray-600 mt-2">{bio}</p>}

            <div className="mt-6 space-y-4">
              <Link
                to="/favourites"
                className="flex justify-between items-center text-lg ml-2 hover:bg-gray-200 p-2 rounded-lg transition-colors"
              >
                <span>Favourites</span>
                <FaChevronRight />
              </Link>
              <Link
                to="/liked-posts"
                className="flex justify-between items-center text-lg ml-2 hover:bg-gray-200 p-2 rounded-lg transition-colors"
              >
                <span>Liked Posts</span>
                <FaChevronRight />
              </Link>
              <Link
                to="/myPosts"
                className="flex justify-between items-center text-lg ml-2 hover:bg-gray-200 p-2 rounded-lg transition-colors"
              >
                <span>My Posts</span>
                <FaChevronRight />
              </Link>
              <button
                onClick={() => setEditing(true)}
                className="w-full flex justify-between items-center text-lg ml-2 hover:bg-gray-200  p-2 rounded-lg  transition-colors"
              >
                <span>Edit Profile</span>
                <FaChevronRight />
              </button>
              <button
                onClick={() => navigate("settings")}
                className="w-full flex justify-between items-center text-lg ml-2 p-2 rounded-lg hover:bg-gray-200  transition-colors"
              >
                <span>Settings</span>
                <FaChevronRight />
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex justify-between items-center text-lg ml-2   p-2 rounded-lg hover:bg-gray-200  transition-colors"
              >
                <span>Logout</span>
                <FaChevronRight />
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;
