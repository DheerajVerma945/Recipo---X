import React, { useEffect, useState } from 'react';
import './Loader.css';
import jokes from "../../public/files/jokes";

const Loader = () => {
    const [joke, setJoke] = useState('');
    useEffect(() => {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        setJoke(randomJoke);
    }, []);


    return <>
        <div className="loader-container">
            <div className="animated-shape"></div>
        </div>
        <p className="mt-2 text-gray-600 font-bold text-lg text-center">{joke}</p>
    </>;
};

export default Loader;
