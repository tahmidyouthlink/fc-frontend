"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const EditPromo = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState('Percentage');

  const handleTabChange = (key) => {
    setDiscountType(key);
  };

  // Format date to yyyy-mm-dd for date input field
  const formatDateForInput = (dateStr) => {
    const date = new Date(dateStr);
    const day = (`0${date.getDate()}`).slice(-2);
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        const response = await axiosPublic.get(`/getSinglePromo/${id}`);
        const promo = response.data;

        // Set form fields with fetched promo data
        setValue('promoCode', promo.promoCode);
        setValue('discountValue', promo.discountValue);
        setValue('expiryDate', formatDateForInput(promo.expiryDate));
        setValue('maxAmount', promo.maxAmount || 0);
        setValue('minAmount', promo.minAmount || 0);

        setDiscountType(promo.discountType);
        setIsLoading(false);
      } catch (err) {
        console.error(err); // Log error to the console for debugging
        toast.error("Failed to fetch promo code details!");
      }
    };

    fetchPromoCode();
  }, [id, axiosPublic, setValue]);

  const onSubmit = async (data) => {
    const { promoCode, discountValue, expiryDate, maxAmount, minAmount } = data;
    setIsSubmitting(true);

    try {
      const updatedDiscount = {
        promoCode,
        discountValue,
        discountType,
        expiryDate,
        maxAmount: maxAmount || 0,
        minAmount: minAmount || 0,
      };

      const res = await axiosPublic.put(`/updatePromo/${id}`, updatedDiscount);
      if (res.data.modifiedCount > 0) {
        toast.success('Promo updated successfully!');
        router.push('/dash-board/discounts');
      } else {
        toast.error('No changes detected.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error editing promo:', error);
      toast.error('Failed to update promo. Please try again!');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='max-w-screen-2xl px-0 md:px-6 2xl:px-0 mx-auto'>

      <div className='max-w-screen-lg mx-auto flex items-center pt-3 md:pt-6'>
        <h3 className='w-full text-center font-medium md:font-semibold text-[13px] md:text-xl lg:text-2xl'>Edit Promo Code</h3>
      </div>

      {/* Your form code */}
      <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-lg mx-auto p-6 flex flex-col gap-6'>
        <div>
          <label htmlFor='promoCode' className='flex justify-start font-medium text-[#9F5216]'>Promo Code *</label>
          <input id='promoCode' {...register("promoCode", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="text" />
          {errors.promoCode?.type === "required" && (
            <p className="text-red-600 text-left">Promo Code is required</p>
          )}
        </div>

        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Discount Type"
            selectedKey={discountType} // Default select based on fetched data
            onSelectionChange={handleTabChange}
          >
            <Tab key="Percentage" title="Percentage">Percentage (%)</Tab>
            <Tab key="Amount" title="Amount">Amount (Taka)</Tab>
          </Tabs>

          <input
            type="number"
            {...register('discountValue', { required: true })}
            className='custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000'
            placeholder={`Enter ${discountType} Discount`} // Correct placeholder
          />
          {errors.discountValue?.type === "required" && (
            <p className="text-red-600 text-left">Discount Value is required</p>
          )}
        </div>

        <div>
          <label htmlFor='maxAmount' className='flex justify-start font-medium text-[#9F5216]'>Maximum Capped Amount</label>
          <input id='maxAmount' {...register("maxAmount")} placeholder='Enter Maximum Capped Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="number" />
        </div>

        <div>
          <label htmlFor='minAmount' className='flex justify-start font-medium text-[#9F5216]'>Minimum Order Amount</label>
          <input id='minAmount' {...register("minAmount")} placeholder='Enter Minimum Order Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="number" />
        </div>

        <div>
          <label htmlFor='expiryDate' className='flex justify-start font-medium text-[#9F5216]'>Expiry Date *</label>
          <input
            id='expiryDate'
            type="date"
            {...register("expiryDate", { required: "Expiry Date is required" })}
            className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
          />
          {errors.expiryDate && (
            <p className="text-red-600 text-left">{errors.expiryDate.message}</p>
          )}
        </div>

        <div className='flex justify-between items-center mt-4 mb-8'>

          <Link className='flex items-center gap-2 font-medium text-white rounded-lg bg-[#9F5216] hover:bg-[#9f5116c9] py-2 px-4' href={"/dash-board/discounts"}> <FaArrowLeft /> Go Back</Link>

          <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
            {isSubmitting ? 'Submitting...' : 'Update Promo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPromo;