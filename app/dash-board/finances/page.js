"use client";
import FinancePerformance from '@/app/components/layout/FinancePerformance';
import PaymentCard from '@/app/components/layout/PaymentCard';
import React, { useState } from 'react';

const Finances = () => {

  const [activeTab, setActiveTab] = useState('finance performance');

  return (
    <div className='px-6 md:px-10'>
      <div className="bg-white sticky top-0 z-10">
        <h1 className="font-bold text-lg lg:text-xl 2xl:text-2xl py-1 2xl:py-3 bg-white">Finances</h1>

        <div className="flex items-center gap-3 bg-white">

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'finance performance' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 hover:text-[#D2016E] after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'finance performance' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('finance performance')}
          >
            Finance Performance
          </button>

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'payment method' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] hover:text-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'payment method' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('payment method')}
          >
            Payment Method
          </button>

        </div>
      </div>

      {activeTab === "finance performance" && <div className='pt-4'>
        <h1 className='font-bold'>Finance Performance</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>The data includes all active, ended, or canceled deals. This report represents unaudited data, please refer to your invoice for accurate settlement numbers.</p>
        <FinancePerformance />
      </div>}

      {activeTab === "payment method" && <div className='pt-4'>
        <h1 className='font-bold'>Choose Payment Methods</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>Our recommendations are tailored to suit your fashion commerce and customer preferences.</p>
        <PaymentCard />
      </div>
      }
    </div >
  );
};

export default Finances;