import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { getQuickRecipe } from '../../appwriteService/config';

function QuickRec() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quickRecipes, setQuickRecipes] = useState(() => {
    const storedRecipes = localStorage.getItem('quickRecipes');
    return storedRecipes ? JSON.parse(storedRecipes) : [];
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (quickRecipes.length === 0) {
          const response = await getQuickRecipe();
          setQuickRecipes(response);
          localStorage.setItem('quickRecipes', JSON.stringify(response));
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quickRecipes]);

  const handleRecipeClick = (recipeId) => {
    window.scrollTo({ top: 0 });
    navigate(`/meal/${recipeId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">Quick Recipes</h1>
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
      {!loading && !error && quickRecipes.length > 0 && (
        <div className="flex overflow-x-auto gap-8 scrollbar-hidden bg-gray-100 pb-4">
          {quickRecipes.map((recipe) => (
            <div
              key={recipe.$id}
              className="min-w-[220px] h-[250px] lg:h-[300px] xs:h-[200px] bg-white shadow-2xl rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl mt-5"
              style={{ marginLeft: quickRecipes.indexOf(recipe) === 0 ? '20px' : '0' }}
              onClick={() => handleRecipeClick(recipe.$id)}
            >
              <img
                src={recipe.Image}
                alt={recipe['Recipe-Name']}
                className="h-[160px] lg:h-[200px] w-[205px]  rounded-md m-2 object-cover"
              />
              <div className="p-2">
                <h2 className="text-lg md:text-xl text-center font-semibold">
                  {recipe['Recipe-Name'].length > 20 ? `${recipe['Recipe-Name'].slice(0, 20)}...` : recipe['Recipe-Name']}
                </h2>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center">
            <Link
              to="/feed"
              className="flex items-center justify-center text-white bg-blue-500 hover:bg-blue-700 p-3 mr-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
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

export default QuickRec;
