import React from 'react';
import trendingImage from "../../../../../public/card-images/trending-image.jpg";
import trendingImage2 from "../../../../../public/card-images/trending-image-2.jpg";
import trendingImage3 from "../../../../../public/card-images/trending-image-3.jpg";
import thunder from "../../../../../public/card-images/thunder.svg";
import trendingSvg from "../../../../../public/card-images/trending.svg";
import { FaArrowRightLong } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';

const Trending = () => {
  return (
    <div className='relative max-w-screen-xl mx-auto'>
      <div className='z-[-1]'>
        <div className='w-[150px] h-[150px] xl:w-[214px] xl:h-[187px] bg-[#FEDCBF] rounded-[100%] absolute md:left-[90%] top-[85%] left-[75%] 2xl:left-[100%] translate-x-[-50%] translate-y-[-50%] blur-[60px] md:blur-[40px]' />
        <div className='w-[150px] h-[150px] xl:w-[214px] xl:h-[187px] bg-[#FEDCBF] rounded-[100%] absolute top-[40%] lg:top-[35%] translate-x-[-50%] translate-y-[-50%] blur-[60px] md:blur-[40px]' />
        <div className='w-[150px] h-[150px] xl:w-[214px] xl:h-[187px] bg-[#E0FCDC] rounded-[100%] absolute top-[20%] left-[60%] translate-x-[-50%] translate-y-[-50%] blur-[60px] md:blur-[40px]' />
      </div>
      <div
        style={{
          backgroundImage: `url(${trendingSvg.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat md:left-[20%] md:top-2'
      />
      <div style={{ backgroundImage: `url(${thunder.src})`, }}
        className='absolute inset-0 z-0 top-5 md:top-0 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:150px_75px] md:left-[40%] bg-no-repeat'
      />
      <div className='max-w-screen-xl mx-auto px-5 2xl:px-0 py-8 md:py-10 lg:py-18 relative'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-4xl pt-4 md:pt-6'>See What’s Trending Now</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/">View All <span className='border border-black rounded-full p-1 md:p-2'><FaArrowRightLong /></span></Link>
        </div>
        <div className='pt-6 grid grid-cols-3 gap-6 lg:gap-3 lg:pt-16 xl:pt-28'>
          <div>
            <Image src={trendingImage} alt='card-image-1' className='rounded-2xl' />
            <div className='pt-4 space-y-1'>
              <h1 className='font-semibold'>৳ 1,200</h1>
              <p className='font-medium text-sm'>University Limited Polo</p>
              <p className='text-[#696969] text-xs'>Polo T-shirt</p>
            </div>
          </div>
          <div>
            <Image src={trendingImage2} alt='card-image-1' className='rounded-2xl' />
            <div className='pt-4 space-y-1'>
              <h1 className='font-semibold'>৳ 2,600</h1>
              <p className='font-medium text-sm'>Night shed Blue Set</p>
              <p className='text-[#696969] text-xs'>Night Dress</p>
            </div>
          </div>
          <div>
            <Image src={trendingImage3} alt='card-image-1' className='rounded-2xl' />
            <div className='pt-4 space-y-1'>
              <h1 className='font-semibold'>৳ 800</h1>
              <p className='font-medium text-sm'>Office Classic</p>
              <p className='text-[#696969] text-xs'>Formal Shirt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;