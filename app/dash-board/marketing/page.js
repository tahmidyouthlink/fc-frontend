"use client";
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import promo from "../../../public/card-images/promo.jpg";
import specialOffer from "../../../public/card-images/special-offer.jpg";
import RecentPromotions from '@/app/components/layout/RecentPromotions';
import PromotionPerformance from '@/app/components/layout/PromotionPerformance';

const Marketing = () => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('view performance');

  return (
    <div className='px-6 md:px-10'>
      <div className="bg-white sticky top-0 z-10">
        <h1 className="font-bold text-lg lg:text-xl 2xl:text-2xl py-1 2xl:py-3 bg-white">Marketing</h1>

        <div className="flex items-center gap-3 bg-white">

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'view performance' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 hover:text-[#D2016E] after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'view performance' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('view performance')}
          >
            View performance
          </button>

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'create promotions' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] hover:text-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'create promotions' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('create promotions')}
          >
            Create Promotions
          </button>

        </div>
      </div>

      {activeTab === "view performance" && <div className='pt-4'>
        <h1 className='font-bold'>Promotion Performance</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>The data includes all active, ended, or canceled deals. This report represents unaudited data, please refer to your invoice for accurate settlement numbers.</p>
        <PromotionPerformance />

        <h1 className='font-bold'>Recent Promotions</h1>
        <p className='pt-1 pb-8 text-neutral-400 text-sm font-medium'>Please use the following table to view your past and upcoming promotions.</p>
        <RecentPromotions />
      </div>}

      {activeTab === "create promotions" && <div className='pt-6'>
        <h1 className='font-bold text-xl'>Recommended For You</h1>
        <p className='pt-1 pb-8 text-neutral-400 font-medium'>Our recommendations are tailored to suit your fashion commerce and customer preferences.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-screen-2xl">
          {/* Promo Card */}
          <div className="flex-1 overflow-hidden rounded-lg shadow transition hover:shadow-lg flex flex-col">
            {/* Set the container to maintain the aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '38.25%' }}> {/* This maintains a 16:9 aspect ratio */}
              <Image
                alt="promo"
                src={promo} // Ensure this path is correct
                layout="fill"
                className="object-contain" // Ensures the full image is visible
              />
            </div>
            <div className="bg-white p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="mb-0.5 text-xl text-gray-900 font-bold">
                Launch Your Next Big Promo
              </h3>
              <p className="text-neutral-500 text-sm flex-grow">
                Capture your customers attention with a well-crafted promotion. Whether
                it is a seasonal sale or a flash discount, create a promo that aligns
                with your brand and drives conversions. Customize the offer, set the
                duration, and monitor its performance—all in one place.
              </p>
              <Button
                onClick={() => router.push('/dash-board/marketing/promo/add-promo')}
                className="bg-[#D2016E] hover:bg-[#d2016deb] text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium mt-4"
              >
                Create Promo
              </Button>
            </div>
          </div>

          {/* Offer Card */}
          <div className="flex-1 overflow-hidden rounded-lg shadow transition hover:shadow-lg flex flex-col">
            {/* Maintain the same aspect ratio for the second image */}
            <div className="relative w-full" style={{ paddingBottom: '38.25%' }}> {/* This maintains a 16:9 aspect ratio */}
              <Image
                alt="offer"
                src={specialOffer} // Ensure this path is correct
                layout="fill"
                className="object-contain" // Ensures the full image is visible
              />
            </div>
            <div className="bg-white p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="mb-0.5 text-xl text-gray-900 font-bold">
                Unlock Special Offer Deals
              </h3>
              <p className="text-neutral-500 text-sm flex-grow">
                Encourage repeat purchases and attract new customers with irresistible
                offers. Create limited-time deals that fit your strategy, whether it is
                a buy-one-get-one or a percentage discount. Stand out from the
                competition with offers that make your store a go-to for shoppers.
              </p>
              <button
                onClick={() => router.push('/dash-board/marketing/offer/add-offer')}
                className="bg-[#D2016E] hover:bg-[#d2016dca] text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium mt-4"
              >
                Create Offer
              </button>
            </div>
          </div>

          {/* bKash Card */}
          <div className="flex-1 overflow-hidden rounded-lg shadow transition hover:shadow-lg flex flex-col">
            {/* Set the container to maintain the aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '38.25%' }}> {/* This maintains a 16:9 aspect ratio */}
              <Image
                alt="promo"
                src="https://i.ibb.co.com/whx7gqH/download-1.png" // Ensure this path is correct
                layout="fill"
                className="object-contain" // Ensures the full image is visible
              />
            </div>
            <div className="bg-white p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="mb-0.5 text-xl text-gray-900 font-bold">
                Enjoy bKash Cashback Offer!
              </h3>
              <p className="text-neutral-500 text-sm flex-grow">
                Avail exciting cashback offers with bKash. Use bKash to pay for your purchases and get instant cashback directly to your account. Hurry, limited-time offer!
                Enjoy seamless transactions and more rewards with bKash.
              </p>
              <Button
                className="bg-[#D2016E] hover:bg-[#d2016deb] text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium mt-4"
              >
                Start Cashback
              </Button>
            </div>
          </div>
        </div>

      </div>
      }
    </div>
  );
};

export default Marketing;