"use client";
import React from 'react';
import AddColors from '@/app/components/layout/AddColors';
import AddTags from '@/app/components/layout/AddTags';
import AddVendors from '@/app/components/layout/AddVendors';

const Variants = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>
        <AddColors />
        <AddTags />
        <AddVendors />
      </div>
    </div>
  );
};

export default Variants;