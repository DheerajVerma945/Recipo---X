import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocumentsByLikes } from '../appwriteService/config';
import Loader from '../components/Loader';
import { FaArrowLeft } from 'react-icons/fa';

function Trending() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrendingMeals = async () => {
            try {
                const trendingMeals = await getDocumentsByLikes();
                setMeals(trendingMeals.slice(0, 25));
            } catch (error) {
                console.error('Error fetching trending meals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingMeals();
    }, []);

    const handleMealClick = (mealId) => {
        window.scrollTo({ top: 0 });
        navigate(`/meal/${mealId}`);
    };

    const getRankingEmoji = (index) => {
        if (index === 0) return '🏆';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    return (
        <div className='mt-40 flex flex-col'>

            {loading &&
                <div className='w-full h-screen'>
                    <Loader />
                </div>}
            {!loading && (
                <>

                    <div className=''>
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-4 absolute mr-5 ml-0 md:ml-5 lg:ml-10 text-gray-100 overflow-hidden hover:text-blue-700 focus:outline-none rounded-full bg-blue-500"
                            aria-label="Go back"
                        >
                            <FaArrowLeft className="inline m-2  " />
                        </button>
                        <h1 className='text-2xl md:text-3xl ml-10 lg:ml-5 md:ml-3 lg:text-4xl text-center font-bold text-gray-800 mb-8'>
                            Top 25 Trending Meals You’ll Love
                        </h1>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
                        {meals.map((meal, index) => (
                            <div
                                key={meal.$id}
                                className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                onClick={() => handleMealClick(meal.$id)}
                            >
                                <div className="relative">
                                    <img src={meal.Image} alt={meal['Recipe-Name']} className="w-full h-48 object-cover" />
                                    <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-sm flex items-center space-x-2">
                                        <span className="text-lg">{getRankingEmoji(index)}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold">{meal['Recipe-Name']}</h3>
                                    <p className="text-gray-600">Likes: {meal.Likes}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Trending;
