import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-[#8a3333] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap  justify-between">
          <div className="w-full md:w-1/3 m-2 mb-4 md:mb-0 ">
            <h1 className="text-2xl font-bold mb-2">Recipo X</h1>
            <p className="text-sm md:text-base">
              We believe everyone can be a good chef. They just need a cookbook.
              We are here to help you get started.
            </p>
          </div>

          <div className="w-full md:w-1/4 m-2 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-4 md:mb-2 lg:mb-2">Quick Links</h2>
            <ul className="text-sm md:text-base space-y-4 md:space-y-2 lg:space-y-2">
              <li>
                <Link to="/" className="hover:underline" onClick={() => {
                  window.scrollTo({ top: 0 })
                }}>Home</Link>
              </li>
              <li>
                <Link to="/feed" className="hover:underline" onClick={() => {
                  window.scrollTo({ top: 0 })
                }}>Feed</Link>
              </li>
              <li>
                <a href="mailto:recipox.contact@gmail.com" className="hover:underline">Contact</a>
              </li>
            </ul>
          </div>

          <div className="w-full m-2 md:w-1/4">
            <h2 className="text-xl hidden md:block lg:block font-semibold mb-2">Socials</h2>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="https://github.com/DheerajVerma945"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <FaGithub className='text-4xl m-2 md:text-2xl lg:text-2xl' />
              </a>

              <a
                href="https://www.linkedin.com/vermadheeraj945"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className='text-4xl m-2 md:text-2xl lg:text-2xl' />
              </a>
              <a
                href="https://www.instagram.com/vermadheeraj_945/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className='text-4xl m-2 md:text-2xl lg:text-2xl' />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white-700 mt-6 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Recipo X. All rights reserved.</p>
          <p className="mt-2">
            Designed and developed by{' '}
            <a
              href="https://www.linkedin.com/in/vermadheeraj945"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Dheeraj Verma
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
