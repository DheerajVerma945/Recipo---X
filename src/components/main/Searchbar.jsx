import React, { useMemo, useState, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchMealSuggestions } from '../../appwriteService/config';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

function SearchBar() {
    const [typed, setTyped] = useState("");
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [cache, setCache] = useState({});

    const debouncedGetSuggestion = useMemo(() => debounce(async (query) => {
        if (query.trim()) {
            if (cache[query]) {
                setData(cache[query]);
                return;
            }
            try {
                const meals = await fetchMealSuggestions(query);
                setCache(prevCache => ({ ...prevCache, [query]: meals }));
                setData(meals);
            } catch (error) {
                console.log("Error fetching meal suggestions:", error);
                setData([]);
            }
        } else {
            setData([]);
        }
    }, 300), []);

    const handleChange = useCallback((e) => {
        setError("");
        const value = e.target.value;
        setTyped(value);
        debouncedGetSuggestion(value);
    }, [debouncedGetSuggestion]);

    const handleSuggestionClick = (docId) => {
        window.scrollTo({ top: 0 });
        navigate(`/meal/${docId}`);
    };

    const handleSearchClick = async (e) => {
        e.preventDefault();
        if (typed.trim()) {
            try {
                const meals = await fetchMealSuggestions(typed);
                const meal = meals[0] || null;

                if (meal) {
                    navigate(`/meal/${meal.$id}`);
                } else {
                    setError("Meal not found . \n You can add one");
                }
            } catch (error) {
                setError("An error occurred while searching.");
            }
        }
    };

    return (
        <div className='flex items-center pt-40 justify-center flex-col relative '>
            <form className='ml-10'>
                <input
                    type="text"
                    className='border-gray-600 w-60 md:w-80 lg:w-96 border-2 rounded-md p-2'
                    placeholder='Search'
                    value={typed}
                    onChange={handleChange}
                />
                <button
                    onClick={handleSearchClick}
                    className='m-2 rounded-full relative top-1.5 md:top-1.5 lg:top-2'
                    aria-label='Search'
                >
                    <FaSearch className='text-2xl lg:text-3xl' />
                </button>
            </form>

            {typed.length > 0 && data.length > 0 && (
                <div className="flex flex-col items-center justify-center">
                    <ul className='absolute top-full  mt-2 border border-gray-600 rounded-md w-60 md:w-80 lg:w-96 bg-white shadow-lg z-10 max-h-60 overflow-y-auto'>
                        {data.map((item) => (
                            <li
                                key={item.$id}
                                className='p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer'
                                onClick={() => handleSuggestionClick(item.$id)}
                            >
                                {item['Recipe-Name']}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error &&
                <p className='flex items-center justify-center gap-5 flex-col bg-red-200 p-5 text-red-600 mt-5 rounded-lg'>
                    {error}
                </p>
            }
        </div>
    );
}

export default SearchBar;
