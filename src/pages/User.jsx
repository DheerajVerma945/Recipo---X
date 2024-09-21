import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserDoc, userPosts } from '../appwriteService/user';
import { useSelector } from 'react-redux';
import Loader2 from '../components/Loader2';

function User() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [dp, setDp] = useState('');
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { session } = useSelector((state) => state.auth);
  const userId = session?.userId;

  useEffect(() => {

    if (!userId) {
      setError("Access denied. Please log in to view this user's profile.");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id === "recipoX_Unique") {
          setIsVerified(true);
        }
        const postData = await getUserDoc(id);
        setName(postData.userName);
        setDp(postData.Dp);
        postData.Bio && setBio(postData.Bio);
        if (postData.Posted.length > 0) {
          setTotalPosts(postData.Posted.length);
          const docs = await userPosts(id);
          setPosts(docs);
          let currLike = 0;
          for (const data of docs) {
            currLike += data.Likes;
          }
          setLikes(currLike);
        }
      }
      catch (error) {
        setError(error.message || "An error occured while fetching user data");
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, userId]);

  return (
    <div className="p-5 mt-40 bg-gray-200 rounded-xl shadow-2xl mb-20 max-w-6xl mx-auto">
      {loading && <Loader2 />}
      {error ? (
        <div className='text-center text-red-600 text-lg h-screen flex justify-center items-center font-semibold'>
          {error}
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start mb-8 space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="relative h-36 w-36 rounded-full border-2 border-blue-900 overflow-hidden flex-shrink-0">
              <img
                src={dp}
                alt={`${name}'s Profile Pic`}
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl inline font-bold text-gray-900">
                {name}
                {isVerified && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    width={20}
                    height={20}
                    className='inline ml-2 mb-1'
                    viewBox="0 0 256 256"
                    xmlSpace="preserve"
                  >
                    <defs></defs>
                    <g
                      style={{
                        stroke: "none",
                        strokeWidth: 0,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "none",
                        fillRule: "nonzero",
                        opacity: 1
                      }}
                      transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                    >
                      <path
                        d="M 49.66 1.125 L 49.66 1.125 c 4.67 -2.393 10.394 -0.859 13.243 3.548 l 0 0 c 1.784 2.761 4.788 4.495 8.071 4.66 l 0 0 c 5.241 0.263 9.431 4.453 9.694 9.694 v 0 c 0.165 3.283 1.899 6.286 4.66 8.071 l 0 0 c 4.407 2.848 5.941 8.572 3.548 13.242 l 0 0 c -1.499 2.926 -1.499 6.394 0 9.319 l 0 0 c 2.393 4.67 0.859 10.394 -3.548 13.242 l 0 0 c -2.761 1.784 -4.495 4.788 -4.66 8.071 v 0 c -0.263 5.241 -4.453 9.431 -9.694 9.694 h 0 c -3.283 0.165 -6.286 1.899 -8.071 4.66 l 0 0 c -2.848 4.407 -8.572 5.941 -13.242 3.548 l 0 0 c -2.926 -1.499 -6.394 -1.499 -9.319 0 l 0 0 c -4.67 2.393 -10.394 0.859 -13.242 -3.548 l 0 0 c -1.784 -2.761 -4.788 -4.495 -8.071 -4.66 h 0 c -5.241 -0.263 -9.431 -4.453 -9.694 -9.694 l 0 0 c -0.165 -3.283 -1.899 -6.286 -4.66 -8.071 l 0 0 C 0.266 60.054 -1.267 54.33 1.125 49.66 l 0 0 c 1.499 -2.926 1.499 -6.394 0 -9.319 l 0 0 c -2.393 -4.67 -0.859 -10.394 3.548 -13.242 l 0 0 c 2.761 -1.784 4.495 -4.788 4.66 -8.071 l 0 0 c 0.263 -5.241 4.453 -9.431 9.694 -9.694 l 0 0 c 3.283 -0.165 6.286 -1.899 8.071 -4.66 l 0 0 c 2.848 -4.407 8.572 -5.941 13.242 -3.548 l 0 0 C 43.266 2.624 46.734 2.624 49.66 1.125 z"
                        style={{
                          stroke: "none",
                          strokeWidth: 1,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "rgb(0,131,249)",
                          fillRule: "nonzero",
                          opacity: 1
                        }}
                        transform=" matrix(1 0 0 1 0 0) "
                        strokeLinecap="round"
                      />
                      <polygon
                        points="36.94,66.3 36.94,66.3 36.94,46.9 36.94,46.9 62.8,35.34 72.5,45.04 "
                        style={{
                          stroke: "none",
                          strokeWidth: 1,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "rgb(0,119,227)",
                          fillRule: "nonzero",
                          opacity: 1
                        }}
                        transform="  matrix(1 0 0 1 0 0) "
                      />
                      <polygon
                        points="36.94,66.3 17.5,46.87 27.2,37.16 36.94,46.9 60.11,23.7 69.81,33.39 "
                        style={{
                          stroke: "none",
                          strokeWidth: 1,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "rgb(255,255,255)",
                          fillRule: "nonzero",
                          opacity: 1
                        }}
                        transform="  matrix(1 0 0 1 0 0) "
                      />
                    </g>
                  </svg>

                )}
              </h2>
              {bio && <p className="text-lg sm:text-xl text-gray-600 mt-2">{bio}</p>}
              <div className="flex justify-center sm:justify-start space-x-8 mt-4 sm:mt-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900">Total Posts</h4>
                  <p className="text-gray-700">{totalPosts}</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900">Likes Received</h4>
                  <p className="text-gray-700">{likes}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {posts && posts.map((doc) => (
              <Link
                key={doc.$id}
                to={`/meal/${doc.$id}`}
                className="bg-white shadow-lg rounded-lg p-2 sm:p-4 flex flex-col justify-between"
              >
                {doc.Image ? (
                  <img
                    src={doc.Image}
                    alt={doc['Recipe-Name']}
                    className="h-[150px] w-full object-cover mb-2"
                  />
                ) : (
                  <div className='flex items-center flex-col gap-2 justify-center h-full'>
                    <h2 className="text-lg md:text-xl font-semibold">{doc['Recipe-Name']}</h2>
                    <p className="text-lg md:text-xl font-semibold">{doc['Category']}</p>
                    <p className="text-lg md:text-xl font-semibold">{doc['Area']}</p>

                  </div>
                )}
                <div className="sm:block hidden">
                  {doc.Image && <h2 className="text-xl font-semibold mb-2">{doc['Recipe-Name']}</h2>}
                </div>
                <p className="text-gray-700 text-center mt-auto">Likes: {doc.Likes || 0}</p>
              </Link>
            ))}
          </div>

        </>
      )}
    </div>

  );
}

export default User;
