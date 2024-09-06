"use client";
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Offer = () => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className='px-0 md:px-6'>

      <div className='flex flex-col-reverse lg:flex-row items-center justify-between px-6 max-w-screen-2xl mx-auto my-6 gap-6'>

        <div className="flex space-x-0 md:space-x-4 border-b mb-4 text-xs md:text-base">
          <button
            className={`relative py-2 px-4 font-medium transition-all duration-300
${activeTab === 'all' ? 'text-blue-600' : 'text-gray-600'}
after:absolute after:left-0 after:right-0 after:bottom-0 
after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
${activeTab === 'all' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
`}
            onClick={() => setActiveTab('all')}
          >
            All
            {/* ({allPromos?.length || 0}) */}
          </button>

          <button
            className={`relative py-2 px-4 font-medium transition-all duration-300
${activeTab === 'active' ? 'text-blue-600' : 'text-gray-600'}
after:absolute after:left-0 after:right-0 after:bottom-0 
after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
${activeTab === 'active' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
`}
            onClick={() => setActiveTab('active')}
          >
            Active Offers
            {/* ({activePromos?.length || 0}) */}
          </button>

          <button
            className={`relative py-2 px-4 font-medium transition-all duration-300
${activeTab === 'expired' ? 'text-blue-600' : 'text-gray-600'}
after:absolute after:left-0 after:right-0 after:bottom-0 
after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
${activeTab === 'expired' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
`}
            onClick={() => setActiveTab('expired')}
          >
            Used Offers
            {/* ({expiredPromos?.length || 0}) */}
          </button>
        </div>

        <Button onClick={() => router.push('/dash-board/discounts/offer/add-offer')} className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium my-2 mx-6 md:mx-4'>
          Create a new Offer
        </Button>

      </div>

    </div>
  );
};

export default Offer;