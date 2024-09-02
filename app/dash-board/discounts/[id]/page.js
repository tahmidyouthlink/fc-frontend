"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { DateRangePicker, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RxCross2 } from 'react-icons/rx';


const EditPromo = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitted } } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState('Percentage');
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  const handleTabChange = (key) => {
    setDiscountType(key);
  };

  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        const response = await axiosPublic.get(`/getSinglePromo/${id}`);
        const promo = response.data;

        // Convert date strings to Date objects
        const parsedStartDate = new Date(promo.startDate);
        const parsedEndDate = new Date(promo.endDate);

        // Set form fields with fetched promo data
        setValue('promoCode', promo.promoCode);
        setValue('discountValue', promo.discountValue);
        setDiscountType(promo.discountType);

        // Set DateRangePicker value using JavaScript Date objects
        setSelectedDateRange([parsedStartDate, parsedEndDate]);

        setIsLoading(false);
      } catch (err) {
        console.error(err); // Log error to the console for debugging
        toast.error("Failed to fetch promo code details!");
      }
    };

    fetchPromoCode();
  }, [id, axiosPublic, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const updatedDiscount = {
        ...data,
        discountType
      };

      await axiosPublic.put(`/updatePromo/${params.id}`, updatedDiscount);

      toast.success('Promo updated successfully!');
      router.push('/dash-board/discounts');
    } catch (error) {
      toast.error('Failed to update promo. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='max-w-screen-2xl px-0 md:px-6 2xl:px-0 mx-auto'>

      <div className='flex justify-end pt-2 max-w-screen-lg mx-auto'>
        <button className='hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white px-1 py-0.5'>
          <Link href={"/dash-board/discounts"}><RxCross2 size={28} /></Link>
        </button>
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
          <DateRangePicker
            label="Discount Duration"
            visibleMonths={3}
            onChange={(range) => setSelectedDateRange(range)}
            value={selectedDateRange} // Ensure this is an array of [startDate, endDate]
            calendar="gregorian" // Ensure the calendar type matches the expected type
          />

        </div>

        <div className='flex justify-end items-center'>
          <button type='submit' disabled={isSubmitting} className={`mt-4 mb-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
            {isSubmitting ? 'Submitting...' : 'Update Promo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPromo;