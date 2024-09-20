import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaHeart, FaThumbsUp } from 'react-icons/fa';
import { getDocumentById } from '../appwriteService/config';
import { incrementLike, decrementLike, addFavourite, removeFavourite, getUserDoc } from '../appwriteService/user';

function Meal() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.auth);
  const userId = session?.userId;

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await getDocumentById(id);
        setMeal(response);
        setLikes(response.Likes || 0);
      } catch (error) {
        setError('Failed to fetch meal data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!userId) return;

      try {
        const userDoc = await getUserDoc(userId);
        if (userDoc.LikedPost && userDoc.LikedPost.includes(id)) {
          setLiked(true);
        }
        if (userDoc.Favourites && userDoc.Favourites.includes(id)) {
          setAdded(true);
        }
      } catch (error) {
        console.log("Error getting user doc", error);
      }
    };

    fetchUserDoc();
  }, [userId, id]);

  const handleLikeClick = async () => {
    if (!userId) {
      setShowLoginMessage(true);
      return;
    }
    liked ? setLiked(false) : setLiked(true);

    if (liked) {
      setLikes(likes - 1);
      await decrementLike(id, likes, userId);
    } else {
      setLikes(likes + 1);
      await incrementLike(id, likes, userId);
    }
    setLiked(!liked);
  };

  const handleAddClick = async () => {
    if (!userId) {
      setShowLoginMessage(true);
      return;
    }

    if (added) {
      setAdded(false);
      await removeFavourite(userId, id);

    } else {
      setAdded(true);
      await addFavourite(userId, id);

    }
  };

  if (loading) {
    return (
      <div className='min-h-screen pt-40'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-lg text-red-600 flex justify-center items-center h-screen'>
        <p>{error}</p>
      </div>
    )
  }

  if (!meal) {
    return <p className="text-center text-lg">No meal found</p>;
  }

  const {
    'Recipe-Name': recipeName,
    Image: image,
    Ingredients: ingredients,
    Recipe: recipe,
    YouTube: youtube,
    PostedBy: postedBy,
    PostedDate: postedDate,
    userId: postedId,
  } = meal;

  const ingredientList = ingredients ? ingredients.split(',').map((ingredient, index) => (
    <li key={index} className="text-gray-700">
      {ingredient.trim()}
    </li>
  )) : [];

  const recipeSteps = recipe ? recipe.split('.').filter(step => step.trim() !== '') : [];

  return (
    <div className="mt-40 max-w-5xl mx-auto bg-white shadow-md rounded-lg p-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="mb-4   mr-5 ml-0 md:ml-5 lg:ml-10 text-gray-100 overflow-hidden hover:text-blue-700 focus:outline-none rounded-full bg-blue-500"
        aria-label="Go back"
      >
        <FaArrowLeft className="inline m-2  " />
      </button>

      <div className="absolute top-0 right-0 p-4 space-y-1 text-right bg-white bg-opacity-0 rounded-lg">
        <Link to={userId ? `/user/${postedId}` : '#'} className="hover:underline text-blue-700 font-semibold">
          {userId ? (postedBy || "Anonymous") : 'Anonymous'}
        </Link>
        {postedDate && <p className="text-gray-700 text-sm"> {new Date(postedDate).toLocaleDateString()}</p>}
      </div>

      <div className="flex items-center justify-center">
        {image &&
          <img
            src={image}
            alt={recipeName}
            className="h-48 object-cover rounded-lg mb-4"
          />
        }
      </div>
      <h1 className="text-2xl font-bold mb-2 text-center">{recipeName}</h1>
      <div className="mt-4 ml-4">
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc ml-6 space-y-2 max-h-80 overflow-y-auto">
          {ingredientList}
        </ul>
      </div>
      <div className="mt-4 ml-4">
        <h2 className="text-xl font-semibold mb-2">Recipe</h2>
        <ul className="list-disc ml-6 space-y-2 max-h-80 overflow-y-auto">
          {recipeSteps.map((step, index) => (
            <li key={index} className="text-gray-700">
              {step.trim()}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 ml-4">Likes: {likes}</p>
      <div className="flex justify-between items-center mt-4 ml-4">
        <button
          onClick={handleLikeClick}
          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
        >
          <FaThumbsUp className={`${liked ? "text-blue-600" : "text-black"}`} />
          <span className="p-1">{likes}</span>
        </button>

        <button
          onClick={handleAddClick}
          className={`flex items-center justify-center space-x-2 ${added ? 'text-pink-700' : 'text-pink-400'
            }`}
        >
          <FaHeart className="text-lg" />
          <span>{added ? 'Added' : 'Add'}</span>
        </button>
      </div>
      {showLoginMessage && (
        <div className="text-red-500 text-center mt-2">
          Please log in first to like or add to favourites.
        </div>
      )}
      {youtube && (
        <div className="mt-4 text-center">
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-lg"
          >
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
}

export default Meal;
