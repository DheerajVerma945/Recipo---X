import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RandomMeal = React.memo(() => {
  const [hide, setHide] = useState(false);


  const hideItem = useCallback(() => {
    setHide(true);
  }, []);

  const { randomMeal } = useSelector((state) => state.config);

  return (
    <div className="flex items-center justify-center pt-10 px-4 lg:px-8 mb-5">
      <div className={` text-white p-3 transition-opacity duration-1000 rounded-lg max-w-4xl ${hide ? 'hidden opacity-0' : 'opacity-100'} ${randomMeal ? "bg-gray-500 shadow-lg " : ""}`}>
        <h2 className='m-3 pb-2 text-center text-xl lg:text-2xl font-bold'>Pick of the moment </h2>
        <div className='flex flex-col md:flex-col lg:flex-col items-center gap-4'>
          {randomMeal && (
            <>
              <img
                src={randomMeal.Image}
                alt={randomMeal['Recipe-Name']}
                className='h-28 rounded-lg shadow-2xl'
              />
              <div>
                <h3 className="text-lg md:text-xl text-center font-semibold mb-3">
                  {randomMeal['Recipe-Name'].length > 30 ? `${randomMeal['Recipe-Name'].slice(0, 30)}...` : randomMeal['Recipe-Name']}
                </h3>
                <div className='flex flex-row justify-center items-center gap-4'>
                  <Link
                    to={`/meal/${randomMeal.$id}`}
                    onClick={() => window.scrollTo({ top: 0 })}
                    className='bg-blue-600 text-white px-2 md:px-4 lg:px-6  py-2 lg:py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-center'
                  >
                    Checkout
                  </Link>
                  <button
                    className='bg-gray-600 text-white px-2 md:px-4 lg:px-6  py-2 lg:py-3 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 text-center'
                    onClick={hideItem}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div >
  );
});

export default RandomMeal;
