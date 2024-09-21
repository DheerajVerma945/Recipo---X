import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderDropDown.css';
import { useDispatch, useSelector } from 'react-redux';
import { checkSessionThunk } from '../../store/authSlice';
import { logout } from '../../appwriteService/auth';

function HeaderDropDown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { session } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/");
      window.location.reload();

    } catch (error) {
      console.log('Error in logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = () => {
    toggleDropdown()
    setShowLogoutModal(true);
  };

  const confirmLogout = (confirm) => {
    setShowLogoutModal(false);
    if (confirm) {
      handleLogout();
    }
  };

  useEffect(() => {
    dispatch(checkSessionThunk());
  }, [dispatch]);

  const handleClick = () => {
    setShowCat((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setShowCat(false);
  };

  return (
    <div className={`relative ${showLogoutModal ? 'blur-background' : ''}`}>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg text-gray-800 font-semibold mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => confirmLogout(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => confirmLogout(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleDropdown}
        className="text-white p-2 rounded-md focus:outline-none"
      >
        {isOpen ? (
          <FaTimes className="text-lg md:text-xl lg:text-2xl" />
        ) : (
          <FaBars className="text-lg md:text-xl lg:text-2xl" />
        )}
      </button>

      <div
        className={`fixed inset-y-0 bg-[#8a3333] right-0 w-full md:w-2/3 lg:w-1/3 p-6 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <button
          onClick={toggleDropdown}
          className="absolute top-6 right-4 text-white "
        >
          <FaTimes className="h-6 w-6" />
        </button>


        <div className="flex flex-col items-center mt-16 space-y-6 text-white font-semibold text-lg">
          <div className="group">
            <div className='flex items-center justify-center mb-6'>
              <Link to="/" className="hover:underline" onClick={() => {
                toggleDropdown();
                window.scrollTo({ top: 0 })
              }}>
                Home
              </Link>
            </div>
            <button
              className="hover:underline inline-flex items-center justify-center w-full text-white focus:outline-none"
              onClick={handleClick}
            >
              <span className='ml-4 mr-2 '>Explore</span>
              {!showCat && <FaCaretDown />}
              {showCat && <FaCaretUp />}

            </button>
            <div className={`mt-2 ml-16 space-y-2 ${showCat ? 'flex flex-col' : 'hidden'}`}>
              <Link
                to="/mealByCategories"
                className="text-white hover:underline"
                onClick={toggleDropdown}
              >
                - Category
              </Link>
              <Link
                to="/mealByCountry"
                className="text-white hover:underline"
                onClick={toggleDropdown}
              >
                - Country
              </Link>
            </div>
          </div>

          <Link to="/trending" className="hover:underline" onClick={toggleDropdown}>
            Top Rated
          </Link>
          <Link to="/feed" className="text-white hover:underline" onClick={toggleDropdown}>
            Feed
          </Link>
          <a
            href="mailto:recipox.contact@gmail.com"
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Contact
          </a>

          {!session ? (
            <div className="flex flex-col items-center space-y-6">
              <Link to="/login" className="text-white hover:underline" onClick={toggleDropdown}>
                Log In
              </Link>
              <Link to="/signup" className="text-white hover:underline" onClick={toggleDropdown}>
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">

              <button className="text-white hover:underline" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="mt-32 text-center text-white text-sm sm:text-lg lg:text-xl  flex justify-center">
          <p className="gradient-text whitespace-nowrap  text-4xl  signature">
            Recipo X
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderDropDown;
