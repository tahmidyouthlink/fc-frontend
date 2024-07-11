import Link from 'next/link';
import React from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import bannerImage1 from "../../../../../public/bg-banner/banner-image-1.jpg";
import bannerImage2 from "../../../../../public/bg-banner/banner-image-2.jpg";
import bannerImage3 from "../../../../../public/bg-banner/banner-image-3.jpg";
import vector1 from "../../../../../public/bg-banner/vector1.png";
import vector2 from "../../../../../public/bg-banner/vector2.png";
import Image from 'next/image';

const Banner = () => {
  return (
    <div className='pt-20 relative max-w-[1200px] mx-auto'>
      <div className='z-[-1]'>
        <div className='w-[150px] h-[150px] xl:w-[214px] xl:h-[187px] bg-[#FEDCBF] rounded-[100%] absolute md:left-[90%] top-[80%] left-[76%] md:top-[50%] 2xl:left-[100%] translate-x-[-50%] translate-y-[-50%] blur-[40px]'></div>
        <div className='w-[150px] h-[150px] xl:w-[214px] xl:h-[187px] bg-[#FEDCBF] rounded-[100%] absolute top-[40%] lg:top-[30%] left-[10%] md:left-[20%] translate-x-[-50%] translate-y-[-50%] blur-[60px] md:blur-[40px]'></div>
        <div className='w-[150px] h-[150px] xl:w-[214px] xl:h-[187px] bg-[#E0FCDC] rounded-[100%] absolute top-[20%] left-[60%] translate-x-[-50%] translate-y-[-50%] blur-[60px] md:blur-[40px]'></div>
      </div>
      <div className='relative'>
        <div className='max-w-[1200px] mx-auto'>
          <div className='px-5 2xl:px-0'>
            <div className='flex items-center justify-center lg:px-12 xl:px-24'>
              <Image src={vector1} alt='vector1' className='hidden md:block' />
              <div className='max-w-screen-sm mx-auto'>
                <h1 className='font-semibold text-3xl md:text-4xl lg:text-5xl text-center pt-5 md:pt-10'>
                  Discover <span className='text-[#9F5216]'>Unique</span> Styles for Every Season
                </h1>
                <p className='text-[#383838] text-center py-6'>
                  Uncover the latest trends with our one-of-a-kind men’s fashion. Each item is uniquely designed and available in limited numbers.
                </p>
              </div>
              <Image src={vector2} alt='vector2' className='hidden md:block' />
            </div>
            <div className='flex justify-center gap-8 items-center'>
              <Link href="/" className='font-semibold flex items-center gap-2 text-sm'>
                Shop Now <span className='border border-black rounded-full p-2'><FaArrowRightLong size={12} /></span>
              </Link>
              <Link href="/" className='font-semibold flex items-center gap-1 text-sm bg-[#FBEDE2] px-4 py-2 rounded-md'>
                Join Us
              </Link>
            </div>
          </div>
          <div className='flex items-center justify-center xl:justify-between gap-2 md:gap-4 lg:gap-6 pt-12 md:pt-8 px-5 2xl:px-0'>
            <div className='w-[100px] h-[150px] sm:w-[150px] sm:h-[200px] md:w-[200px] md:h-[300px] lg:w-[305px] lg:h-[400px]'>
              <Image
                src={bannerImage1}
                alt='banner-full-image'
                layout='responsive'
                width={275}
                height={400}
                className='object-cover rounded-xl'
              />
            </div>
            <div className='pt-[30px] sm:pt-[40px] md:pt-[50px] lg:pt-[90px] w-[200px] h-[150px] sm:w-[300px] sm:h-[200px] md:w-[450px] md:h-[300px] lg:w-[632px] lg:h-[441px]'>
              <Image
                src={bannerImage2}
                alt='banner-full-image'
                layout='responsive'
                width={602}
                height={441}
                className='object-cover rounded-xl'
              />
            </div>
            <div className='w-[100px] h-[150px] sm:w-[150px] sm:h-[200px] md:w-[200px] md:h-[300px] lg:w-[305px] lg:h-[400px]'>
              <Image
                src={bannerImage3}
                alt='banner-full-image'
                layout='responsive'
                width={275}
                height={400}
                className='object-cover rounded-xl'
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Banner;