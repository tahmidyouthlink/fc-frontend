import Link from 'next/link';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

const ThirdStepOfAddProduct = () => {
  return (
    <div className='bg-gray-50'>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Shipping Details</h3>
      <form>
        <div className='flex justify-between px-6 lg:px-8 xl:px-10 2xl:px-12 py-3'>
          <Link href='/dash-board/products/add-product-2' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            <FaArrowLeft /> Previous Step
          </Link>
          <button type='submit' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            Submit
          </button>

        </div>
      </form>
    </div>
  );
};

export default ThirdStepOfAddProduct;