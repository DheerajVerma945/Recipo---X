import React, { useEffect, useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { fetchCategoriesandDoc, getRandomMealThunk } from './store/configSlice';
import { useDispatch } from 'react-redux';
import { ErrorPage, Applayout } from "./components/index.js"
import RefreshIcon from "../public/files/RefreshIcon.png"
import "./HomeLoader.css"
import { AddMeals, Category, Favourites, Feed, Home, LikedPosts, LoginPage, Meal, MealByCountry, Profile, Settings, SignupPage, Trending, User, UserPosts, VerifyPage } from './pages/pages.js'


const Loader = () => (
    <div className="w-screen h-screen bg-white flex items-center justify-center fixed" style={{zIndex:100}}>
        <div className="loader relative flex items-center justify-center">
            <div className="circle level1"></div>
            <div className="circle level2"></div>
            <div className="circle level3"></div>
            <div className="relative h-44 w-44 mx-auto rounded-full overflow-hidden">
                <img
                    src={RefreshIcon}
                    alt="Refreshing"
                    className="absolute inset-0  object-cover"
                />
            </div>
        </div>
    </div>



);

function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(getRandomMealThunk());
        dispatch(fetchCategoriesandDoc());
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [dispatch]);

    const router = useMemo(() => createBrowserRouter([
        {
            path: "/",
            element: <Applayout />,
            errorElement: <ErrorPage />,
            children: [
                { path: "/", element: <Home /> },
                { path: "/profile", element: <Profile /> },
                { path: "/mealByCountry", element: <MealByCountry /> },
                { path: "/meal/:id", element: <Meal /> },
                { path: "/mealByCategories", element: <Category /> },
                { path: "/feed", element: <Feed /> },
                { path: "/login", element: <LoginPage /> },
                { path: "/signup", element: <SignupPage /> },
                { path: "/user/:id", element: <User /> },
                { path: "/post", element: <AddMeals /> },
                { path: "/verify/:userId", element: <VerifyPage /> },
                { path: "/trending", element: <Trending /> },
                { path: "/favourites", element: <Favourites /> },
                { path: "/liked-posts", element: <LikedPosts /> },
                { path: "/myPosts", element: <UserPosts /> },
                { path: "/profile/settings", element: <Settings /> }

            ]
        }
    ]), []);
    return (

        <div>
            {isLoading && <Loader />}
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
