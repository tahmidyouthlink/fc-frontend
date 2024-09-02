"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { DateRangePicker, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RxCross2 } from 'react-icons/rx';

const AddDiscount = () => {

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState('Percentage');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
  const [dateRangeError, setDateRangeError] = useState('');

  const handleTabChange = (key) => {
    setDiscountType(key);
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return null;
    return new Date(dateObj.year, dateObj.month - 1, dateObj.day).toDateString(); // Convert to "Sat Aug 31 2024"
  };

  // Effect to handle date range error display
  useEffect(() => {
    if (isSubmitted) {
      const startDate = formatDate(selectedDateRange?.start);
      const endDate = formatDate(selectedDateRange?.end);

      if (!startDate || !endDate) {
        setDateRangeError("Date range is required.");
      } else {
        setDateRangeError("");
      }
    }
  }, [selectedDateRange, isSubmitted]);

  const onSubmit = async (data) => {
    const { promoCode, discountValue } = data;

    const startDate = formatDate(selectedDateRange?.start);
    const endDate = formatDate(selectedDateRange?.end);

    if (!startDate || !endDate) {
      setDateRangeError("Date range is required.");
      return;
    } else {
      setDateRangeError("");
    }

    setIsSubmitting(true);

    try {
      const discountData = {
        promoCode,
        discountValue,
        discountType,
        startDate,
        endDate,
      };

      const response = await axiosPublic.post('/addPromoCode', discountData);
      if (response.data.insertedId) {
        toast.success('Discount published successfully!');
        router.push("/dash-board/discounts");
      }
    } catch (err) {
      toast.error("Failed to publish discount!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-screen-2xl px-0 md:px-6 2xl:px-0 mx-auto'>

      <div className='max-w-screen-lg mx-auto flex items-center pt-3 md:pt-6'>
        <h3 className='w-full text-center font-medium md:font-semibold text-[13px] md:text-xl lg:text-2xl'>Create New Promo Code</h3>
        <button className='hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white px-1 py-0.5'>
          <Link href={"/dash-board/discounts"}><RxCross2 size={28} /></Link>
        </button>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-lg mx-auto py-6 flex flex-col gap-6'>

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
            selectedKey={discountType}
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
          <DateRangePicker
            label="Discount Duration"
            visibleMonths={3}
            onChange={(range) => {
              setSelectedDateRange(range);
              // Clear the error when a valid date range is selected
              if (range?.start && range?.end) {
                setDateRangeError("");
              }
            }}
            value={selectedDateRange}
          />
          {dateRangeError && (
            <p className="text-red-600 text-left">{dateRangeError}</p> // Display date range error
          )}
        </div>

        <div className='flex justify-end items-center'>
          <button type='submit' disabled={isSubmitting} className={`mt-4 mb-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

    </div>
  );
};

export default AddDiscount;