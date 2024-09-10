"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { DatePicker, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const AddOffer = () => {

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [offerDiscountType, setOfferDiscountType] = useState('Percentage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleTabChange = (key) => {
    setOfferDiscountType(key);
  };

  const handleShowDateError = (date) => {
    if (date) {
      setDateError(false);
      return;
    }
    setDateError(true);
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Get month and pad with 0 if needed
    const day = (`0${date.getDate()}`).slice(-2);       // Get day and pad with 0 if needed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data) => {
    const { offerTitle, offerDiscountValue, expiryDate, maxAmount, minAmount } = data;

    // Get today's date (ignoring time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset hours to make it a date-only comparison

    // Check if expiryDate is selected
    if (!expiryDate) {
      setDateError(true);
      return;  // Do not show toast here, just prevent submission
    }

    // Check if expiryDate is in the past
    const selectedExpiryDate = new Date(expiryDate);
    if (selectedExpiryDate < today) {
      toast.error("Expiry date cannot be in the past.");
      return;  // Prevent form submission
    }

    // If date is valid, reset the date error
    setDateError(false);

    const formattedExpiryDate = formatDate(expiryDate);
    setIsSubmitting(true);

    try {
      const offerData = {
        offerTitle,
        offerDiscountValue,
        offerDiscountType,
        expiryDate: formattedExpiryDate,
        maxAmount: maxAmount ? maxAmount : 0,
        minAmount: minAmount ? minAmount : 0,
        offerStatus: true
      };

      const response = await axiosPublic.post('/addOffer', offerData);
      if (response.data.insertedId) {
        toast.success('Offer published successfully!');
        router.push("/dash-board/marketing");
      }
    } catch (err) {
      toast.error("Failed to publish offer!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-screen-2xl px-6 2xl:px-0 mx-auto'>

      <div className='max-w-screen-lg mx-auto flex items-center pt-3 md:pt-6'>
        <h3 className='w-full text-center font-semibold text-xl lg:text-2xl'>Create New Offer</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-lg mx-auto py-6 flex flex-col gap-6'>

        <div>
          <label htmlFor='offerTitle' className='flex justify-start font-medium text-[#9F5216] pb-2'>Offer Title *</label>
          <input id='offerTitle' placeholder='Enter Offer Title'  {...register("offerTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="text" />
          {errors.offerTitle?.type === "required" && (
            <p className="text-red-600 text-left">Offer Title is required</p>
          )}
        </div>

        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Discount Type"
            selectedKey={offerDiscountType}
            onSelectionChange={handleTabChange}
          >
            <Tab className='text-[#9F5216]' key="Percentage" title="Percentage">Percentage (%) *</Tab>
            <Tab className='text-[#9F5216]' key="Amount" title="Amount">Amount (Taka) *</Tab>
          </Tabs>

          <input
            type="number"
            {...register('offerDiscountValue', { required: true })}
            className='custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000'
            placeholder={`Enter ${offerDiscountType} Discount`} // Correct placeholder
          />
          {errors.offerDiscountValue?.type === "required" && (
            <p className="text-red-600 text-left">Discount Value is required</p>
          )}
        </div>


        <div>
          <label htmlFor='maxAmount' className='flex justify-start font-medium text-[#9F5216] pb-2'>Maximum Capped Amount</label>
          <input id='maxAmount' {...register("maxAmount")} placeholder='Enter Maximum Capped Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="number" />
        </div>

        <div>
          <label htmlFor='minAmount' className='flex justify-start font-medium text-[#9F5216] pb-2'>Minimum Order Amount</label>
          <input id='minAmount' {...register("minAmount")} placeholder='Enter Minimum Order Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="number" />
        </div>

        <div>
          <label htmlFor='expiryDate' className='flex justify-start font-medium text-[#9F5216] pb-2'>Offer Expire On *</label>
          <DatePicker
            id='expiryDate'
            placeholder="Select date"
            aria-label="Select expiry date"
            onChange={(date) => {
              handleShowDateError(date);
              if (date instanceof Date && !isNaN(date)) {
                setValue('expiryDate', date.toISOString().split('T')[0]); // Ensure it's a valid Date object and format it as YYYY-MM-DD
              } else {
                setValue('expiryDate', date); // If DatePicker returns something else, handle it here
              }
            }}
            className="w-full outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
          />

          {dateError && (
            <p className="text-red-600 text-left">Please select Offer Expire Date.</p>
          )}
        </div>

        <div className='flex justify-between items-center mt-4 mb-8'>

          <Link className='flex items-center gap-2 font-medium text-white rounded-lg bg-[#9F5216] hover:bg-[#9f5116c9] py-2 px-4' href={"/dash-board/marketing"}> <FaArrowLeft /> Go Back</Link>

          <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddOffer;