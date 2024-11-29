import React from 'react';
import Laptop from '../assets/jude.jpg'; // Ensure this path is correct

const Analytics = () => {
  return (
    <div id="analytics-section" className='w-full bg-white py-16 px-4'>
      <div className='max-w-[1240px] mx-auto grid md:grid-cols-2'>
        {/* Check image path here */}
        <img className='w-[300px] mx-auto my-4' src={Laptop} alt='Laptop' />
        <div className='flex flex-col justify-center'>
          <h1 className='text-[#000000] font-bold '>WAST.ED</h1>
          <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>
            Meet WAST.ED, The no.1 waste segregation and pickup application.
          </h1>
          <p>
            Are you tired of seeing waste littered across your community and
            feeling powerless to make a difference? WAST.ED is here to transform
            the way we handle waste, making it easier and more efficient than
            ever before. Our mobile application empowers you to actively
            participate in waste collection and segregation, ensuring a cleaner
            and greener environment for everyone.
          </p>
          <button className='self-center bg-[#000000] text-white w-[200px] rounded-md font-medium py-3 transition-all duration-300 ease-in-out hover:bg-[#d3d3d3] hover:text-black hover:border'>
            Download App
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
