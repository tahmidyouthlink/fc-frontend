"use client";
import React from 'react';
import TransitionLink from "@/app/components/ui/TransitionLink";
import { FaArrowRightLong } from "react-icons/fa6";
import vector1 from "/public/bg-banner/vector1.png";
import vector2 from "/public/bg-banner/vector2.png";
import Image from "next/image";

const PreviewHomeContent = ({ searchParams }) => {

  const leftImage = searchParams.leftImage;
  const centerImage = searchParams.centerImage;
  const rightImage = searchParams.rightImage;

  return (
    <div className="relative flex h-dvh flex-col px-5 pb-6 pt-[100px] sm:h-[65dvh] sm:px-8 sm:pt-32 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 2xl:pb-[6vh] 2xl:pt-[calc(88px+6vh)] portrait:md:h-[75dvh] portrait:lg:h-[60dvh] landscape:h-dvh">
      <div className="z-[-2]">
        <div className="absolute left-[76%] top-[80%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#FEDCBF] blur-[40px] md:left-[90%] md:top-[50%] xl:h-[187px] xl:w-[214px] 2xl:left-[100%]"></div>
        <div className="absolute left-[10%] top-[40%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#FEDCBF] blur-[60px] md:left-[20%] md:blur-[40px] lg:top-[30%] xl:h-[187px] xl:w-[214px]"></div>
        <div className="absolute left-[60%] top-[20%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-[100%] bg-[#E0FCDC] blur-[60px] md:blur-[40px] xl:h-[187px] xl:w-[214px]"></div>
      </div>
      <div>
        <div className="relative flex items-center justify-evenly">
          <div className="size-8 max-sm:absolute max-sm:left-0 max-sm:top-[30%] sm:size-12 sm:-translate-y-1/2 lg:size-14">
            <Image src={vector1} alt="Squiggly shape" />
          </div>
          <div className="max-w-[88%] sm:max-w-[60%] md:max-w-lg lg:max-w-screen-sm">
            <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl portrait:[@media_(max-height:_700px)]:text-2xl">
              Discover <span className="text-[#9F5216]">Unique</span> Styles for
              This Season
            </h1>
            <p className="py-6 text-center text-[#383838] portrait:[@media_(max-height:_700px)]:text-sm">
              Uncover the latest trends with our one-of-a-kind men&apos;s
              fashion. Each item is uniquely designed and available in limited
              numbers.
            </p>
          </div>
          <div className="size-8 max-sm:absolute max-sm:right-0 max-sm:top-[30%] sm:size-12 sm:-translate-y-1/2 lg:size-14">
            <Image src={vector2} alt="Arrow shape" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-8">
          <TransitionLink
            href="/shop"
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold transition-[gap] duration-300 ease-in-out hover:gap-3"
          >
            Shop Now{" "}
            <span className="rounded-full border border-black p-2">
              <FaArrowRightLong size={12} />
            </span>
          </TransitionLink>
          <TransitionLink
            href="/login"
            className="flex cursor-pointer items-center gap-1 rounded-md bg-[#FBEDE2] px-4 py-2.5 text-sm font-semibold transition-[background-color] duration-300 ease-in-out hover:bg-[#F4D3BA]"
          >
            Join Us
          </TransitionLink>
        </div>
      </div>
      <div className="hero-images pointer-events-none flex grow justify-center gap-2 max-sm:mt-7 max-sm:flex-wrap md:-mt-2 md:gap-3 xl:-mt-3 xl:justify-between xl:gap-4 landscape:mt-auto landscape:max-h-[550px]">
        <div>
          {leftImage && <Image
            src={leftImage}
            alt="Hero section side image 1"
            width={0}
            height={0}
            fill
            sizes="50vw"
          />}
        </div>
        <div>
          {centerImage && <Image
            src={centerImage}
            alt="Hero section main image"
            width={0}
            height={0}
            fill
            sizes="50vw"
          />}
        </div>
        <div>
          {rightImage && <Image
            src={rightImage}
            alt="Hero section side image 2"
            width={0}
            height={0}
            fill
            sizes="50vw"
          />}
        </div>
      </div>
    </div>
  );
};

export default PreviewHomeContent;