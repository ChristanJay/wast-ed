import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const Hero = () => {
  const el = useRef(null); // Create a reference for Typed.js

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['Segregation.', 'Collection.', 'Sustainability.'],
      typeSpeed: 80,
      backSpeed: 100,
      loop: true,
    });

    return () => typed.destroy(); // Cleanup Typed instance on unmount
  }, []);

  return (
    <div className='text-white bg-gradient-to-t from-[#004d00] to-[#000000]'>
      <div className='max-w-[800px] w-full h-screen mx-auto text-center flex flex-col justify-center px-4'>
        <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          WAST.ED
        </h1>
        <div className='flex justify-center items-center whitespace-nowrap md:text-5xl sm:text-4xl text-2xl font-bold py-4'>
          <span className='mr-2'>Fast and Reliable for</span>
          <span className='text-[#00ff00]' ref={el}></span>
        </div>
        <p className='md:text-2xl text-lg text-gray-300 py-4'>
          An innovative mobile application for efficient waste collection and smart segregation.
        </p>
        <button className='self-center bg-[#00df9a] text-black w-[200px] rounded-md font-medium py-3 transition-all duration-300 ease-in-out hover:bg-[#00df9a] hover:text-white'>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;