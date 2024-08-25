"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const ThirdStepOfAddProduct = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);


    try {
      const response = await axiosPublic.post('/',);
      if (response.status === 201) {
        toast.success('Product Details added successfully!');
        reset();
        router.push("/dash-board/products/add-product")
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Failed to add Product Details. Please try again!');
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Shipping Details</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-between px-6 lg:px-8 xl:px-10 2xl:px-12 py-3'>
          <Link href='/dash-board/products/add-product-2' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            <FaArrowLeft /> Previous Step
          </Link>
          <button type='submit' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThirdStepOfAddProduct;