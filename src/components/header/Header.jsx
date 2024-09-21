import React, { useState } from 'react';
import { Logo } from "../index";
import { FaHeart, FaUser } from 'react-icons/fa';
import HeaderDropDown from './HeaderDropDown';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.auth);
  const [showAlert, setShowAlert] = useState(false);

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (session) {
      navigate('/profile');
    }
    else {
      setShowAlert(true)
      setInterval(() => {
        setShowAlert(false)
      }, 5000);
    }
  };
  const handlefavouritesClick = (e) => {
    e.preventDefault();
    if (session) {
      navigate('/favourites');
    } else {
      setShowAlert(true)
      setInterval(() => {
        setShowAlert(false)
      }, 5000);
    }
  }

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className='fixed top-0 left-0 right-0  w-full z-40 bg-[#8a3333]'>
      <div className='flex flex-row items-center gap-10 text-white px-4'>
        <Logo />
        <div className='flex flex-row w-full items-center justify-end gap-3 md:gap-4 lg:gap-5 relative'>
          <button
            onClick={handlefavouritesClick}
            className="m-2"
          >
            <FaHeart color='white' className='text-lg md:text-xl lg:text-2xl' />
          </button>
          <button
            className="m-2"
            onClick={handleProfileClick}
          >
            <FaUser className='text-lg md:text-xl lg:text-2xl' />
          </button>
          <HeaderDropDown />
        </div>
      </div>
      {showAlert && (
        <div className="fixed  left-0 right-0 bg-gray-800 text-white text-center py-2 z-10">
          <p>You need to log in to access this page.</p>
          <button
            className="absolute top-2 right-4 text-white"
            onClick={handleCloseAlert}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
