import Link from 'next/link';
import React from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import card1 from "../../../../../public/card-images/Card 1.jpg";
import card2 from "../../../../../public/card-images/Card 2.jpg";
import card3 from "../../../../../public/card-images/Card 3.jpg";
import card4 from "../../../../../public/card-images/Card 4.jpg";
import categoriesSvgImage from "../../../../../public/card-images/categories1.svg";
import arrowSvgImage from "../../../../../public/card-images/arrow.svg";
import Image from 'next/image';

const Category = () => {
  return (
    <div className='bg-[#FBEDE2] mt-16 md:mt-20 xl:mt-40 relative w-full'>
      <div
        style={{
          backgroundImage: `url(${categoriesSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 bg-contain top-60 w-full md:top-28 md:bg-cover bg-no-repeat 2xl:bg-contain 2xl:bg-center'
      />
      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-2 md:top-5 bg-[length:60px_30px] left-[60%] md:bg-[length:200px_100px] md:left-[58%] lg:left-[68%] 2xl:left-[60%] bg-no-repeat'
      />
      <div className='max-w-[1200px] mx-auto px-5 2xl:px-0 py-8 md:py-10 lg:py-12 relative z-10'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-4xl'>Browse Our Categories</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/">View All <span className='border border-black rounded-full p-1 md:p-2'><FaArrowRightLong /></span></Link>
        </div>
        <div className='pt-6 md:pt-16 grid grid-cols-2 md:grid-cols-4 gap-6'>
          <Image src={card1} alt='card-image-1' className='rounded-2xl' />
          <Image src={card2} alt='card-image-1' className='rounded-2xl' />
          <Image src={card3} alt='card-image-1' className='rounded-2xl' />
          <Image src={card4} alt='card-image-1' className='rounded-2xl' />
        </div>
      </div>
    </div>
  );
};

export default Category;