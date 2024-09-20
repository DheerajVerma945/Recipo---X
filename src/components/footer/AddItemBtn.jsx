import React, { useState } from 'react';
import { FaTimes, FaPlus, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../Loader2'

function AddItemBtn() {
    const [showMessage, setShowMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { session } = useSelector((state) => state.auth);

    const handleClick = async () => {
        setLoading(true);
        if (!session) {
            setLoading(false);
            setShowMessage(true);

        } else {
            window.scrollTo({ top: 0 });
            navigate('/post');
        }
        setLoading(false);
    };

    return (
        <div>
            {loading && <Loader />}
            <div className='fixed flex justify-center items-center right-8 bottom-16 md:right-16 lg:right-20 lg:bottom-20 dp bg-blue-500 p-2'>
                <button onClick={handleClick} >
                    <FaPlus size={32} color='white' className='object-cover' />
                </button>
            </div>

            {showMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-50">
                    <div className="bg-gray-200 p-6 rounded-lg shadow-lg text-center relative">
                        <button
                            className="absolute top-2 right-2 p-1 bg-gray-300 rounded-full"
                            onClick={() => setShowMessage(false)}
                        >
                            <FaTimes size={16} color='black' />
                        </button>
                        <p className="text-black font-semibold mb-4 m-5">You need to log in to add items</p>
                        <button
                            className=" bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                            onClick={() => {
                                setShowMessage(false);
                                window.scrollTo({ top: 0 });
                                navigate('/login');
                            }}
                        >
                            <span className="mr-2 flex gap-2">Login <FaArrowRight size={14} className='relative top-1.5' /></span>

                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddItemBtn;
