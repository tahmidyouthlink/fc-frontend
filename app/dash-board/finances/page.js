"use client";
import FinancePerformance from '@/app/components/layout/FinancePerformance';
import React from 'react';

const Finances = () => {

  return (
    <div className='px-6 md:px-10'>
      <div className="bg-white sticky top-0 z-10">
        <h1 className="font-bold text-lg lg:text-xl 2xl:text-2xl py-1 2xl:py-3 bg-white">Finances</h1>

        <h1 className='font-bold'>Performance</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>The data includes all active, ended, or canceled deals. This report represents unaudited data, please refer to your invoice for accurate settlement numbers.</p>
        <FinancePerformance />
      </div>
    </div >
  );
};

export default Finances;