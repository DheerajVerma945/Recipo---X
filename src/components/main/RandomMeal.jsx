import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EditorsChoice from "../../../public/files/EditorsChoice.png"

const RandomMeal = React.memo(() => {
  const [hide, setHide] = useState(false);


  const hideItem = useCallback(() => {
    setHide(true);
  }, []);

  const { randomMeal } = useSelector((state) => state.config);

  return (
    <div className="flex items-center justify-center mt-10  mb-5">

      <div className={`text-white relative p-5 transition-opacity duration-1000 rounded-lg max-w-4xl ${hide ? 'hidden opacity-0' : 'opacity-100'} ${randomMeal ? "bg-gray-500 shadow-lg " : "hidden"}`}>
        <img
          style={{ transform: 'rotate(-25deg)' }}
          src={EditorsChoice}
          alt="Editor's Choice"
          className={`h-20 md:h-24 lg:h-24 absolute -top-4 -left-4 `}
        />
        <div className='flex  flex-col items-center gap-4'>

          {randomMeal && (
            <>
              <img
                src={randomMeal.Image}
                alt={randomMeal['Recipe-Name']}
                className='h-40 w-40 min-w-[150px] mt-5 rounded-lg shadow-2xl object-cover'
              />
              <div>
                <h3 className="text-lg md:text-xl min-w-[250px] text-center font-bold mb-3">
                  {randomMeal['Recipe-Name'].length > 30 ? `${randomMeal['Recipe-Name'].slice(0, 30)}...` : randomMeal['Recipe-Name']}
                </h3>
                <div className='flex flex-row justify-center items-center gap-4'>
                  <Link
                    to={`/meal/${randomMeal.$id}`}
                    onClick={() => window.scrollTo({ top: 0 })}
                    className='bg-blue-600 text-white px-2 md:px-4 lg:px-6  py-2 lg:py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-center'
                  >
                    Checkout
                  </Link>
                  <button
                    className='bg-gray-600 text-white px-2 md:px-4 lg:px-6  py-2 lg:py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 text-center'
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
