import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { updatePost, userPosts, deletePost } from '../appwriteService/user';
import { Link } from 'react-router-dom';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import Loader2 from '../components/Loader2';
import Loader from '../components/Loader';

function MyPosts() {
  const [data, setData] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState('');
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const { session } = useSelector((state) => state.auth);
  const userId = session?.userId;

  useEffect(() => {
    setPostLoading(true);
    const fetchPosts = async () => {
      if (!userId) {
        setError('User must be logged in.');
        setPostLoading(true);
        return;
      }

      try {
        const docs = await userPosts(userId);
        if (docs) {
          setData(docs);
        }
      } catch (error) {
        setError('Failed to fetch posts.');
      } finally {
        setPostLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleEdit = async (updatedPost) => {
    setLoading(true);
    try {
      await updatePost(editPost.$id, updatedPost);
      setUpdateMsg('Post Updated Successfully');
      setTimeout(() => setUpdateMsg(''), 2000);
      const updatedData = data.map((doc) =>
        doc.$id === editPost.$id ? { ...doc, ...updatedPost } : doc
      );
      setData(updatedData);
      setEditPost(null);
    } catch (error) {
      setError('Failed to update post.');
    }
    finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await handleDelete(docId);
      setDocId('');
      setConsent(false);
    } catch (error) {
      setError(error);
    }
    finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setConsent(false);
  };

  const handleDelete = async (postId) => {
    setLoading(true);
    try {
      await deletePost(postId, userId);
      setDeleteMessage('Post Deleted Successfully');
      setTimeout(() => setDeleteMessage(''), 2000);
      const updatedData = data.filter((doc) => doc.$id !== postId);
      setData(updatedData);
    } catch (error) {
      setError('Failed to delete post.');
    }
    finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }
  if (postLoading) {
    <div className='h-screen'>
      <Loader />
    </div>
  }

  else if (!data.length) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center gap-5 mb-60">
        <p className="text-center text-2xl">No posts found.</p>
        <Link
          to="/post"
          className="bg-gray-500 p-2 text-center text-white rounded-lg hover:bg-gray-700"
        >
          Let's get started
        </Link>
      </div>
    );
  }

  return (

    <section className="mt-40 pb-10 w-full mx-auto bg-white shadow-md rounded-lg p-4 relative">
      {loading && <Loader2 />}
      <h1 className="text-2xl font-bold m-5">
        Your Posts{' '}
        <span className="text-xl font-semibold">({data.length})</span>
      </h1>

      {editPost && (
        <div className="fixed inset-0 w-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
            <h2 className="text-lg font-bold mb-4">Edit Post</h2>

            <label htmlFor="RecipeName">Meal Name</label>
            <input
              type="text"
              value={editPost['Recipe-Name']}
              onChange={(e) =>
                setEditPost({ ...editPost, 'Recipe-Name': e.target.value })
              }
              className="border rounded w-full p-2 mb-4"
              placeholder="Recipe Name"
            />
            <label htmlFor="Ingredients">Ingredients</label>
            <textarea
              value={editPost['Ingredients']}
              onChange={(e) =>
                setEditPost({ ...editPost, 'Ingredients': e.target.value })
              }
              className="border rounded w-full p-2 mb-4"
              placeholder="Ingredients"
            />
            <label htmlFor="Recipe">Recipe</label>
            <textarea
              value={editPost['Recipe']}
              onChange={(e) =>
                setEditPost({ ...editPost, 'Recipe': e.target.value })
              }
              className="border rounded w-full p-2 mb-4"
              placeholder="Recipe"
            />
            <label htmlFor="Category">Category</label>
            <textarea
              value={editPost['Category']}
              onChange={(e) =>
                setEditPost({ ...editPost, 'Category': e.target.value })
              }
              className="border rounded w-full p-2 mb-4"
              placeholder="Category"
            />
            <label htmlFor="Area">Area</label>
            <textarea
              value={editPost['Area']}
              onChange={(e) =>
                setEditPost({ ...editPost, 'Area': e.target.value })
              }
              className="border rounded w-full p-2 mb-4"
              placeholder="Area"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditPost(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEdit(editPost)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {consent && (
        <div className="fixed inset-0 w-full bg-gray-800 bg-opacity-50 flex items-center flex-col justify-center z-30">
          <div className='bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm'>
            <h2 className="text-xl text-center m-3">
              Are you sure you want to delete this post?
            </h2>

            <div className="flex items-center  gap-10 justify-between">
              <button
                className="text-white rounded-md bg-gray-600 p-3 text-center"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="text-white rounded-md bg-red-600 p-3 text-center"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {updateMsg && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg transition-opacity duration-1000 fade-out">
          {updateMsg}
        </div>
      )}
      {deleteMessage && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg transition-opacity duration-1000 fade-out">
          {deleteMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((doc) => (
          <div
            key={doc.$id}
            className="rounded-lg p-4 bg-gray-100 m-5 border-2 shadow-xl relative"
          >
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setShowOptions(showOptions === true ? false : true)}
                className="text-white text-lg"
                aria-label="Post Options"
              >
                <FaEllipsisV color="black" />
              </button>
              {showOptions && (
                <div className="absolute top-3 right-4 bg-white rounded-md p-6 mt-2 z-30">
                  <button
                    onClick={() => {
                      setShowOptions(false)
                      setEditPost(doc)
                    }}
                    className="flex items-center text-blue-600 mb-2"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      setConsent(true);
                      setDocId(doc.$id);
                    }}
                    className="flex items-center text-red-600"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
            <Link to={`/meal/${doc.$id}`} className="block" onClick={() => window.scrollTo({ top: 0 })}>
              {doc.Image ? (
                <img
                  src={doc.Image}
                  alt={doc['Recipe-Name']}
                  className="h-[150px] w-full object-cover"
                />
              ) : (
                <div className="flex items-center flex-col gap-2 justify-center h-full">
                  <h2 className="text-lg md:text-xl font-semibold">{doc['Recipe-Name']}</h2>
                  <p className="text-md md:text-lg font-medium">{doc['Category']}</p>
                  <p className="text-md md:text-lg font-medium">{doc['Area']}</p>
                </div>
              )}
              {doc.Image && (
                <h2 className="text-lg md:text-xl font-semibold">{doc['Recipe-Name']}</h2>
              )}
              <p className="text-gray-700">Likes: {doc.Likes || 0}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyPosts;
