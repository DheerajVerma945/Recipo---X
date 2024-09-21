import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItemsByCategory } from '../store/configSlice';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
const Category = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categoriesandDoc, categoryItems, status, error } = useSelector((state) => state.config);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = categoriesandDoc.categories;

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchItemsByCategory(selectedCategory));
    }
  }, [selectedCategory, dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleItemClick = (itemId) => {
    window.scrollTo({ top: 0 });
    navigate(`/meal/${itemId}`);
  };

  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedItems = useMemo(() => categoryItems, [categoryItems]);

  if (status === 'loading') {
    return <>
      <div className="pt-40 m-10 overflow-x-auto scrollbar-hidden pb-4">
        <div className="flex items-center justify-start flex-nowrap gap-5 md:gap-8 lg:gap-12 w-full px-4 py-2 ">
          {memoizedCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`p-2 px-4 text-sm md:text-base lg:text-lg font-semibold rounded-full transition-colors ease-in-out duration-300 whitespace-nowrap 
                ${category === selectedCategory ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white hover:bg-gray-800 hover:text-gray-200 '}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="hidden lg:flex md:flex space-x-6 mb-5  gap-8 bg-gray-100 pb-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-52 bg-white shadow-2xl w-full rounded-lg overflow-hidden animate-pulse"
            style={{ marginLeft: index === 0 ? '20px' : '0' }}
          >
            <div className="h-[150px] w-full bg-gray-300"></div>
            <div className="p-4">
              <div className="bg-gray-300 h-6 w-3/4 mb-2"></div>
              <div className="bg-gray-300 h-4 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex lg:hidden md:hidden space-x-6 overflow-hidden gap-8 bg-gray-100 pb-4">
        {[...Array(1)].map((_, index) => (
          <div
            key={index}
            className="w-full h-52 bg-white shadow-2xl rounded-lg overflow-hidden animate-pulse"
            style={{ marginLeft: index === 0 ? '20px' : '0' }}
          >
            <div className="h-[120px] w-full bg-gray-300"></div>
            <div className="p-4">
              <div className="bg-gray-300 h-6 w-3/4 mb-2"></div>
              <div className="bg-gray-300 h-4 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  }

  if (status === 'failed') {
    return (
      <div className="pt-40 p-6 flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="p-6 pt-40 flex justify-center items-center">
        <p className="text-gray-600">No categories available</p>
      </div>
    );
  }

  return (
    <div className="p-6 pt-32  md:pt-40 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4   mr-5 ml-0 md:ml-5 lg:ml-10 text-gray-100 overflow-hidden rounded-full bg-blue-500"
        aria-label="Go back"
      >
        <FaArrowLeft className="inline m-2  " />
      </button>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-900">Categories</h2>

      <div className="overflow-x-auto scrollbar-hidden pb-4">
        <div className="flex items-center justify-start flex-nowrap gap-5 md:gap-8 lg:gap-12 px-4 py-2 w-full ">
          {memoizedCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`p-2 px-4 text-sm md:text-base lg:text-lg font-semibold rounded-full transition-colors ease-in-out duration-300 whitespace-nowrap 
                ${category === selectedCategory ? 'bg-gray-950 text-white' : 'bg-gray-600 text-white hover:bg-gray-800 hover:text-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memoizedItems.map((item) => (
          <div
            key={item.$id}
            className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl ease-in-out duration-300"
            onClick={() => handleItemClick(item.$id)}
          >
            <img
              src={item.Image}
              alt={item['Recipe-Name']}
              className="w-full h-48 object-cover mb-3 rounded-lg transition-transform transform hover:scale-105"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item['Recipe-Name']}</h3>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Category;
