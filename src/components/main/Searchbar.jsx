import React, { useState, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SearchBar() {
    const [typed, setTyped] = useState("");
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const {categoriesandDoc} = useSelector((state) => state.config);
    const docs = categoriesandDoc.allDocuments;
    const handleChange = useCallback((e) => {
        setError("");
        const value = e.target.value;
        setTyped(value);

        if (value.trim()) {
            const filteredData = docs.filter((item) => 
                item['Recipe-Name']
                    .toLowerCase() 
                    .includes(value.toLowerCase())
            );
            setData(filteredData);
        } else {
            setData([]); 
        }
    }, [docs]);

    const handleSuggestionClick = (docId) => {
        window.scrollTo({ top: 0 });
        navigate(`/meal/${docId}`);
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (typed.trim()) {
            const meal = data[0] || null;
            if (meal) {
                navigate(`/meal/${meal.$id}`);
            } else {
                setError("Meal not found. You can add one.");
            }
        }
    };

    return (
        <div className='flex items-center pt-40 justify-center flex-col relative'>
            <form className='ml-10'>
                <input
                    type="text"
                    className='border-gray-600 w-60 md:w-80 lg:w-96 border-2 rounded-md p-2'
                    placeholder='Search'
                    value={typed}
                    onChange={handleChange}
                    aria-label='Search Input'
                />
                <button
                    onClick={handleSearchClick}
                    className='m-2 rounded-full relative top-1.5 md:top-1.5 lg:top-2'
                    aria-label='Search Button'
                >
                    <FaSearch className='text-2xl lg:text-3xl' />
                </button>
            </form>

            {typed.length > 0 && data.length > 0 && (
                <div className="flex flex-col items-center justify-center">
                    <ul className='absolute top-full mt-2 border border-gray-600 rounded-md w-60 md:w-80 lg:w-96 bg-white shadow-lg z-10 max-h-60 overflow-y-auto scrollbar-hidden'
                        role="listbox" aria-label="Search Suggestions">
                        {data.map((item) => (
                            <li
                                key={item.$id}
                                className='p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer'
                                onClick={() => handleSuggestionClick(item.$id)}
                                role="option"
                                aria-selected="false"
                            >
                                {item['Recipe-Name']}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && (
                <p className='flex items-center justify-center gap-5 flex-col bg-red-200 p-5 text-red-600 mt-5 rounded-lg'>
                    {error}
                </p>
            )}
        </div>
    );
}

export default SearchBar;
