"use client";
import FinancePerformance from '@/app/components/layout/FinancePerformance';
import FinanceTable from '@/app/components/layout/FinanceTable';
import RefundedPayments from '@/app/components/layout/RefundedPayments';
import React, { useState } from 'react';

const Finances = () => {

  const [activeTab, setActiveTab] = useState('completed');

  return (
    <div className='px-6 md:px-10'>
      <div className="bg-white sticky top-0 z-10">
        <h1 className="font-bold text-lg md:text-xl lg:text-3xl text-neutral-700 py-1 2xl:py-3 bg-white">FINANCES</h1>

        <div className="flex items-center gap-3 bg-white">

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'completed' ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 hover:text-neutral-800 after:bottom-0 
        after:h-[2px] after:bg-neutral-800 after:transition-all after:duration-300
        ${activeTab === 'completed' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'refunded' ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-neutral-800 hover:text-neutral-800 after:transition-all after:duration-300
        ${activeTab === 'refunded' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('refunded')}
          >
            Refunded
          </button>

        </div>
      </div>

      {activeTab === "completed" && <div className='pt-4'>
        <h1 className='font-bold'>Performance</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>The data includes all Pending, Paid, Canceled, or Refunded transactions.</p>
        <FinancePerformance />
      </div>}

      {activeTab === "refunded" && <div className='pt-4'>
        <h1 className='font-bold'>Performance</h1>
        <p className='pt-1 text-neutral-400 text-sm font-medium'>The data includes all Pending, Paid, Canceled, or Refunded transactions.</p>
        <RefundedPayments />
      </div>}

      <div className='mt-12 md:mt-16'>
        <h1 className='font-bold'>Recent Transactions</h1>
        <p className='pt-1 pb-6 text-neutral-400 text-sm font-medium'>Please use the following table to view your transactions.</p>
        <FinanceTable />
      </div>
    </div >
  );
};

export default Finances;