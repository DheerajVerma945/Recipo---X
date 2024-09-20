import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { getLatest } from '../../appwriteService/config';
import { Link, useNavigate } from 'react-router-dom';
function Latest() {
  const navigate = useNavigate();
  const [latestMealsData, setLatestMealsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await getLatest();
        if (response) {
          setLatestMealsData(response);
        }
      } catch (error) {
        console.error('Failed to fetch latest meals:', error);
        setError('Failed to load meals.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMealClick = (mealId) => {
    window.scrollTo({ top: 0 });
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className="p-8" id="latest">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">Latest</h1>
      {loading && (
        <div className="flex space-x-6 overflow-x-auto scrollbar-hidden gap-8 bg-gray-100 pb-4">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="min-w-[220px] h-[250px] lg:h-[300px] xs:h-[200px] bg-white shadow-2xl rounded-lg overflow-hidden animate-pulse"
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
      )}
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      {!loading && !error && latestMealsData.length > 0 && (
        <div className="flex overflow-x-auto gap-8 scrollbar-hidden bg-gray-100 pb-4">
          {latestMealsData.map((meal) => (
            <div
              key={meal.$id}
              className="min-w-[220px] h-[250px] lg:h-[300px] xs:h-[200px] bg-white shadow-2xl rounded-lg overflow-hidden cursor-pointer transition-transform transform mt-5 hover:scale-105 hover:shadow-xl"
              style={{ marginLeft: latestMealsData.indexOf(meal) === 0 ? '20px' : '0' }}
              onClick={() => handleMealClick(meal.$id)}
            >
              {meal.Image ? (
                <img
                  src={meal.Image}
                  alt={meal['Recipe-Name']}
                  className="h-[160px] lg:h-[200px] w-[205px]  rounded-md m-2 object-cover"
                />
              ) : (
                <div className='flex items-center flex-col gap-2 justify-center h-full'>
                  <h2 className="text-lg md:text-xl text-center font-semibold">
                    {meal['Recipe-Name'].length > 20 ? `${meal['Recipe-Name'].slice(0, 20)}...` : meal['Recipe-Name']}
                  </h2>

                  <p className='text-md md:text-lg text-center font-medium'>{meal['Category']}</p>
                  <p className='text-md md:text-lg text-center font-medium'>{meal['Area']}</p>
                </div>
              )}
              <div className="p-2">
                {meal.Image && <h2 className="text-lg md:text-xl text-center font-semibold">
                  {meal['Recipe-Name'].length > 20 ? `${meal['Recipe-Name'].slice(0, 20)}...` : meal['Recipe-Name']}
                </h2>
                }
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center">
            <Link
              to="/feed"
              className="flex items-center justify-center text-white bg-blue-500 hover:bg-blue-700 p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
              style={{ width: '60px', height: '60px' }}
            >
              <FaArrowRight className="text-xl" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Latest;
