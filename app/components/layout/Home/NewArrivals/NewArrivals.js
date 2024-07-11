import Link from 'next/link';
import React from 'react';
import arrowSvgImage from "../../../../../public/card-images/arrow.svg";
import arrivals1 from "../../../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../../../public/card-images/arrivals2.svg";
import newArrivals1 from "../../../../../public/card-images/new-arrivals-1.jpg";
import newArrivals2 from "../../../../../public/card-images/new-arrivals-2.jpg";
import newArrivals3 from "../../../../../public/card-images/new-arrivals-3.jpg";
import Image from 'next/image';
import { FaArrowRightLong } from 'react-icons/fa6';

const NewArrivals = () => {
  return (
    <div className='bg-[#FBEDE2] mt-8 lg:mt-16 relative w-full'>
      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat left-[45%] lg:left-[60%] -top-[138px]'
      />
      <div
        style={{
          backgroundImage: `url(${arrivals2.src})`,
        }}
        className='absolute inset-0 z-0 bg-contain bg-center xl:-top-28 w-full bg-no-repeat'
      />
      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-2 md:top-5 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />
      <div className='max-w-[1200px] mx-auto px-5 2xl:px-0 py-8 md:py-10 lg:py-12 relative z-10'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-4xl'>Look at Our New Arrivals</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/">View All <span className='border border-black rounded-full p-1 md:p-2'><FaArrowRightLong /></span></Link>
        </div>
        <div className='pt-6 grid grid-cols-3 gap-6 lg:gap-3 lg:pt-16'>
          <div>
            <Image src={newArrivals1} alt='card-image-1' className='rounded-2xl' />
            <div className='pt-4 space-y-1'>
              <h1 className='font-semibold text-sm md:text-base'>৳ 1,200</h1>
              <p className='font-medium text-xs md:text-sm'>University Limited Polo</p>
              <p className='text-[#696969] text-[10px] md:text-xs'>Polo T-shirt</p>
            </div>
          </div>
          <div>
            <Image src={newArrivals2} alt='card-image-1' className='rounded-2xl' />
            <div className='pt-4 space-y-1'>
              <h1 className='font-semibold text-sm md:text-base'>৳ 2,600</h1>
              <p className='font-medium text-xs md:text-sm'>Night shed Blue Set</p>
              <p className='text-[#696969] text-[10px] md:text-xs'>Night Dress</p>
            </div>
          </div>
          <div>
            <Image src={newArrivals3} alt='card-image-1' className='rounded-2xl' />
            <div className='pt-4 space-y-1'>
              <h1 className='font-semibold text-sm md:text-base'>৳ 800</h1>
              <p className='font-medium text-xs md:text-sm'>Office Classic</p>
              <p className='text-[#696969] text-[10px] md:text-xs'>Formal Shirt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;