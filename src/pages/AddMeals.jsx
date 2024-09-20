import React, { useEffect, useState } from 'react';
import { uploadFileAndGetUrl, createDocument, addPost } from "../appwriteService/user";
import { user } from '../appwriteService/auth';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loader2 from '../components/Loader2';

const AddMeals = () => {
    const navigate = useNavigate();
    const [mealName, setMealName] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [image, setImage] = useState(null);
    const [youtubeLink, setYoutubeLink] = useState('');
    const [area, setArea] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [documentId, setDocumentId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await user();
                setUserData(data);
            }
            catch (error) {
                setError("User must be logged in .");
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!mealName || !recipe || !ingredients || !area || !category) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadFileAndGetUrl(image);
            }

            const id = await createDocument({
                mealName,
                recipe,
                ingredients,
                image: imageUrl,
                area,
                category,
                youtubeLink,
                user: userData
            });


            const userId = userData.$id;
            await addPost(userId, id);
            setDocumentId(id);
            setSuccess('Meal added successfully!');
            setMealName('');
            setRecipe('');
            setIngredients('');
            setImage(null);
            setYoutubeLink('');
            setArea('');
            setCategory('');
        } catch (error) {
            console.log("Error", error)
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative max-w-2xl pt-40 mx-auto bg-white shadow-md rounded-lg p-8">
            {loading && <Loader2 />}
            <button
                onClick={() => navigate(-1)}
                className="mb-4   mr-5 ml-0 md:ml-5 lg:ml-10 text-gray-100 overflow-hidden hover:text-blue-700 focus:outline-none rounded-full bg-blue-500"
                aria-label="Go back"
            >
                <FaArrowLeft className="inline m-2  " />
            </button>
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Meal</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && (
                    <>
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40"></div>
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                <p className="text-green-500">{success}</p>
                                {documentId && (
                                    <button
                                        onClick={() => navigate(`/meal/${documentId}`)}
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        View Your Post
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Meal Name *</label>
                    <input
                        type="text"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter meal name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients * (Make sure to seperate ingredients with comma ',' )</label>
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="List the ingredients"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Recipe * (Make sure to seperate steps with dot '.' )</label>
                    <textarea
                        value={recipe}
                        onChange={(e) => setRecipe(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Describe the recipe"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Image (Optional,But its good to have one)</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Area *</label>
                    <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter area"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category *</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter category"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">YouTube Link (Optional)</label>
                    <input
                        type="url"
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://youtube.com/..."
                    />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add Meal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMeals;
