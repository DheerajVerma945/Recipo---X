import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getMealsByAreaThunk } from '../store/configSlice';

function MealByCountry() {
  const [country, setCountry] = useState('Indian');
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mealsByArea, status, error } = useSelector((state) => state.config);

  useEffect(() => {
    dispatch(getMealsByAreaThunk(country));
  }, [country, dispatch]);

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    setShowMore(false);
  };

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleShowLess = () => {
    setShowMore(false);
  };

  const handleRecipeClick = (idMeal) => {
    window.scrollTo({ top: 0 });
    navigate(`/meal/${idMeal}`);
  };

  const displayedMeals = useMemo(() => {
    return Array.isArray(mealsByArea) ? (showMore ? mealsByArea : mealsByArea.slice(0, 10)) : [];
  }, [mealsByArea, showMore]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-40">
      <button
        onClick={() => navigate(-1)}
        className="mb-4   mr-5 ml-0 md:ml-5 lg:ml-10 text-gray-100 overflow-hidden hover:text-blue-700 focus:outline-none rounded-full bg-blue-500"
        aria-label="Go back"
      >
        <FaArrowLeft className="inline m-2  " />
      </button>
      <h2 className="text-4xl font-bold text-center mb-8">Meals by Country</h2>
      <div className="flex justify-center mb-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {['Indian', 'Mexican', 'Italian', 'Canadian', 'Japanese', 'American'].map((c) => (
            <button
              key={c}
              onClick={() => handleCountryChange(c)}
              className={`p-3 text-white rounded hover:bg-opacity-80 transition-colors ${c === country ? 'bg-blue-500' : 'bg-gray-500'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' ? (
        <>
          <div className="hidden lg:flex md:flex space-x-6  overflow-x-auto gap-8 bg-gray-100 pb-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="w-full h-52 bg-white shadow-2xl rounded-lg overflow-hidden animate-pulse"
                style={{ marginLeft: index === 0 ? '20px' : '0' }}
              >
                <div className="h-[150px] w-full bg-gray-300"></div>
                <div className="p-4">
                  <div className="bg-gray-300 h-6 w-3/4 mb-2"></div>
                  <div className="bg-gray-300 h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex lg:hidden md:hidden space-x-6  overflow-x-auto gap-8 bg-gray-100 pb-4">
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                className="w-full h-52 bg-white shadow-2xl rounded-lg overflow-hidden animate-pulse"
                style={{ marginLeft: index === 0 ? '20px' : '0' }}
              >
                <div className="h-[150px] w-full bg-gray-300"></div>
                <div className="p-4">
                  <div className="bg-gray-300 h-6 w-3/4 mb-2"></div>
                  <div className="bg-gray-300 h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedMeals.map((meal) => (
              <div
                key={meal.$id}
                className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleRecipeClick(meal.$id)}
              >
                <img
                  src={meal.Image}
                  alt={meal['Recipe-Name']}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{meal['Recipe-Name']}</h3>
              </div>
            ))}
          </div>
          {Array.isArray(mealsByArea) && mealsByArea.length > 10 && (
            <div className="text-center mt-10">
              {showMore ? (
                <button
                  onClick={handleShowLess}
                  className="bg-gray-950 text-white px-6 py-2 rounded-lg hover:bg-black"
                >
                  Show Less
                </button>
              ) : (
                <button
                  onClick={handleShowMore}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Show More
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MealByCountry;
