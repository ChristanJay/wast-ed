import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import logos from '../assets/logos.png';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { Link as ScrollLink } from 'react-scroll'; // Import ScrollLink

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const location = useLocation(); // Get current route

  const handleNav = () => {
    setNav(!nav);
  };

  // Check if we are on the login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white bg-black'>
      <div className='flex items-center'>
        {/* Make the logo and text clickable and redirect to '/' (Home) */}
        <Link to="/" className="flex items-center">
          <img src={logos} alt="Logo" className='w-12 h-12 mr-2' />
          <h1 className='p-4 text-3xl font-bold text-[#fff]'>WAST.ED</h1>
        </Link>
      </div>

      {/* Conditionally render links based on whether we're on the login page */}
      {!isLoginPage && (
        <ul className='p-5 hidden md:flex'>
          {/* Home link */}
          <li className='p-5'>
            <span className='cursor-pointer hover:text-[#00df9a] transition-all duration-300 ease-in-out'>Home</span>
          </li>

          {/* Company link (scrolls to Analytics section) */}
          <li className='p-5'>
            <ScrollLink
              to="analytics-section" // This should match the id in Analytics.jsx
              smooth={true}
              duration={500}
              className="cursor-pointer hover:text-[#00df9a] transition-all duration-300 ease-in-out"
            >
              Company
            </ScrollLink>
          </li>

          {/* About link (scrolls to Footer section) */}
          <li className='p-5'>
            <ScrollLink
              to="footer-section" // This should match the id in Footer.jsx
              smooth={true}
              duration={500}
              className="cursor-pointer hover:text-[#00df9a] transition-all duration-300 ease-in-out"
            >
              About
            </ScrollLink>
          </li>

          {/* Conditionally render Log In button if not on /login page */}
          {location.pathname !== '/login' && (
            <li className='p-4'>
              <Link to="/login">
                <button className='bg-[#00df9a] hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded transition duration-300'>
                  Log In
                </button>
              </Link>
            </li>
          )}
        </ul>
      )}

      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile menu */}
      <ul className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-black ease-in-out duration-500' : 'ease-in-out duration-500 fixed left-[-100%]'}>
        <div className='flex items-center m-4'>
          <Link to="/" className="flex items-center">
            <img src={logos} alt="Logo" className='w-12 h-12 mr-2' />
            <h1 className='text-3xl font-bold text-[#fff]'>WAST.ED</h1>
          </Link>
        </div>
        
        {/* Conditionally render items in mobile menu */}
        {!isLoginPage && (
          <>
            <li className='p-4 border-b border-gray-600'>
              <span className='cursor-pointer hover:text-[#00df9a] transition-all duration-300 ease-in-out'>Home</span>
            </li>

            <li className='p-4 border-b border-gray-600'>
              <ScrollLink
                to="analytics-section" // This should match the id in Analytics.jsx
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-[#00df9a] transition-all duration-300 ease-in-out"
              >
                Company
              </ScrollLink>
            </li>

            <li className='p-4 border-b border-gray-600'>
              <ScrollLink
                to="footer-section" // This should match the id in Footer.jsx
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-[#00df9a] transition-all duration-300 ease-in-out"
              >
                About
              </ScrollLink>
            </li>
          </>
        )}

        {/* Conditionally render Log In button if not on /login page */}
        {location.pathname !== '/login' && (
          <li className='p-4'>
            <Link to="/login">
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300'>
                Log In
              </button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
