import React from 'react';
import myImage from '../../assets/images/add.png';

const EmptyCard = () => {
  return (
    <div className='flex flex-col items-center justify-center text-white'>
      <div>
        <img src={myImage} alt="No Notes" className='w-40 sm:w-60 text-white mt-48 sm:mt-20' />
      </div>
      <div className='text-xs sm:text-lg font-medium text-slate-300 text-center leading-7 mt-6 sm:mt-10'>
        <p className='mb-2 sm:mb-4'>Start Creating your first Note!!</p>
        <p>Let's get Started!!</p>
      </div>
    </div>
  );
}

export default EmptyCard;
