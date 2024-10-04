"use client";
import FinancePerformance from '@/app/components/layout/FinancePerformance';
import FinanceTable from '@/app/components/layout/FinanceTable';
import React from 'react';

const Finances = () => {

  return (
    <div className='px-6 md:px-10'>
      <div className="bg-white sticky top-0 z-10">
        <h1 className="font-bold text-lg lg:text-xl 2xl:text-2xl pt-2 md:pt-6 bg-white">Finances</h1>
      </div>
      <p className='pb-2 text-neutral-400 text-sm font-medium'>The data includes all active, ended, or canceled deals. This report represents unaudited data, please refer to your invoice for accurate settlement numbers.</p>
      <FinancePerformance />
      <FinanceTable />
    </div >
  );
};

export default Finances;