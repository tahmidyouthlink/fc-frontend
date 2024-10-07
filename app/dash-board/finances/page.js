"use client";
import FinancePerformance from '@/app/components/layout/FinancePerformance';
import FinanceTable from '@/app/components/layout/FinanceTable';
import RefundedPayments from '@/app/components/layout/RefundedPayments';
import React, { useState } from 'react';

const Finances = () => {

  const [activeTab, setActiveTab] = useState('paid payments');

  return (
    <div className='px-6 md:px-10'>
      <div className="bg-white sticky top-0 z-10">
        <h1 className="font-bold text-lg lg:text-xl 2xl:text-2xl py-1 2xl:py-3 bg-white">Finances</h1>

        <div className="flex items-center gap-3 bg-white">

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'paid payments' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 hover:text-[#D2016E] after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'paid payments' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('paid payments')}
          >
            Paid Payments
          </button>

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'refunded payments' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] hover:text-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'refunded payments' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('refunded payments')}
          >
            Refunded Payments
          </button>

        </div>
      </div>

      {activeTab === "paid payments" && <div className='pt-4'>
        <h1 className='font-bold'>Promotion Performance</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>The data includes all active, ended, or canceled deals. This report represents unaudited data, please refer to your invoice for accurate settlement numbers.</p>
        <FinancePerformance />
      </div>}

      {activeTab === "refunded payments" && <div className='pt-4'>
        <h1 className='font-bold'>Promotion Performance</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>The data includes all active, ended, or canceled deals. This report represents unaudited data, please refer to your invoice for accurate settlement numbers.</p>
        <RefundedPayments />
      </div>}

      <div className='mt-12 md:mt-16'>
        <h1 className='font-bold'>Recent Promotions</h1>
        <p className='pt-1 pb-6 text-neutral-400 text-sm font-medium'>Please use the following table to view your past and upcoming promotions.</p>
        <FinanceTable />
      </div>
    </div >
  );
};

export default Finances;