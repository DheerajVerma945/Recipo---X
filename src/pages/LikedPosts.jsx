import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getLikedPosts, clearLikedPosts } from '../appwriteService/user';
import { getDocumentById } from '../appwriteService/config';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

function LikedPosts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { session } = useSelector((state) => state.auth);
  const userId = session?.userId;

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!userId) {
        setError("User must be logged in .");
        return
      };

      try {
        const likedIds = await getLikedPosts(userId);
        if (likedIds.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const allDocs = await Promise.all(
          likedIds.map(async (id) => {
            try {
              return await getDocumentById(id);
            } catch (error) {
              return null;
            }
          })
        );
        const docs = allDocs.filter(doc => doc !== null);

        setData(docs);
        setData(docs);
      } catch (error) {
        setError('Failed to fetch liked posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [userId]);


  const handleClearAll = async () => {
    try {
      setAlertMessage('All liked posts have been cleared.');
      await clearLikedPosts(userId);
      setData([]);
    } catch (error) {
      setError('Failed to clear liked posts.');
    } finally {
      setShowClearConfirm(false);
    }
  };

  const handleConfirmClear = () => {
    setShowClearConfirm(true);
  };

  const handleCancelClear = () => {
    setShowClearConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-lg pt-40 pb-40 text-red-600">{error}</p>;
  }

  if (data.length === 0) {
    return <div className='flex items-center justify-center h-screen'>
      <p className="text-center text-lg">No liked posts found .</p>
    </div>;
  }

  return (
    <div className="pt-40 w-full mx-auto bg-white shadow-md rounded-lg p-4 relative">
      {showClearConfirm && (
        <div className="absolute inset-0 w-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-11/12 max-w-sm">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to clear all liked posts?</h2>
            <div className="flex justify-end">
              <button
                onClick={handleCancelClear}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
              >
                No
              </button>
              <button
                onClick={handleClearAll}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="text-green-600 text-center mb-4 transition-opacity opacity-100">
          {alertMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Liked Posts <span className='text-xl  font-semibold'>({data.length})</span></h1>

        <button
          onClick={handleConfirmClear}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaTrash className="mr-2" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((doc) => (
          <Link
            key={doc.$id}
            to={`/meal/${doc.$id}`}
            className="bg-white shadow-lg rounded-lg p-4 block"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            {doc.Image ? <img
              src={doc['Image']}
              alt={doc['Recipe-Name']}
              className="h-48 w-full object-cover mb-4 rounded-lg"
            /> : <div className='flex flex-col items-center justify-center gap-3 '>
              <h2 className="text-xl font-semibold mb-2">{doc['Recipe-Name']}</h2>
              <p className="text-lg  mb-2">{doc['Category']}</p>
            </div>

            }
            {doc.Image && <h2 className="text-xl font-semibold mb-2">{doc['Recipe-Name']}</h2>}
            <p className="text-gray-700">Likes: {doc.Likes || 0}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LikedPosts;
