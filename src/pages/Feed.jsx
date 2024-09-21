import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Loader2 from '../components/Loader2';
import { useSelector } from 'react-redux';

const shuffleArray = (array) => {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};

const Feed = () => {
  const { categoriesandDoc, status, error } = useSelector((state) => state.config);
  const documents = categoriesandDoc.allDocuments;
  const shuffledDocuments = shuffleArray(documents);

  return (
    <div className="flex relative  flex-col items-center mt-40 p-4 bg-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className=" absolute left-5 top-0  text-gray-100 overflow-hidden rounded-full bg-blue-500"
        aria-label="Go back"
      >
        <FaArrowLeft className="inline m-2  " />
      </button>
      <h1 className="text-gray-800 mt-8 p-3 text-center font-bold text-2xl mb-10">
        Find Your Next Favourite Recipe Here
      </h1>
      {status === 'loading' && <Loader2 />}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="w-full  max-w-screen-lg">

        {shuffledDocuments.map((doc) => (
          <div key={doc.$id} className="mb-4">
            <RecipeCard doc={doc} />
          </div>
        ))}
      </div>
    </div>
  );
};

const RecipeCard = ({ doc }) => {
  const { session } = useSelector((state) => state.auth);
  const userId = session?.userId;
  return (
    <div key={doc.$id} className="bg-white shadow-lg rounded-2xl relative overflow-hidden">
      <div className="bg-white bg-opacity-75 rounded-md p-1 m-0 mt-5 ml-5 text-blue-700 font-semibold">
        <Link to={userId ? `/user/${doc['userId']}` : '#'} className="hover:underline text-blue-700 font-semibold"
          onClick={window.scrollTo({ top: 0 })}>
          {userId ? (doc['PostedBy'] || "Anonymous") : 'Anonymous'}
        </Link>
      </div>
      <Link to={`/meal/${doc.$id}`} className="block"
        onClick={() => window.scrollTo({ top: 0 })}>
        <div className="p-4 flex flex-col items-center">
          <div className="text-xl font-bold mb-2">{doc['Recipe-Name']}</div>
          <img
            src={doc['Image']}
            alt={doc['Recipe-Name']}
            className="h-64 w-64 object-cover mb-2"
          />
        </div>
        <p className='ml-5 mb-5 text-gray-700 font-semibold text-lg '>Likes:{doc.Likes}</p>
      </Link>
    </div>
  );
};

export default Feed;
