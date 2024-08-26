"use client";
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Discounts = () => {

  const router = useRouter();

  return (
    <div>

      <div className='sticky top-0 z-10 flex justify-end max-w-screen-2xl mx-auto px-6'>
        <Button onClick={() => router.push('/dash-board/discounts/add-discount')} className='mt-6 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
          New Discounts
        </Button>
      </div>

    </div>
  );
};

export default Discounts;