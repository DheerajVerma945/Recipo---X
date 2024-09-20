import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

function Navigator() {
  const [showArr, setShowArr] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY >= 90 ? setShowArr(true) : setShowArr(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed right-5 bottom-5 ${showArr ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className='bg-yellow-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-red-300'
      >
        <FaArrowUp className='text-sm' />
      </button>
    </div>
  );
}

export default Navigator;
