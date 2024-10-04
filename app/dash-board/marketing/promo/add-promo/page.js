"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { DatePicker, Tab, Tabs } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const Editor = dynamic(() => import('@/app/utils/Editor/Editor'), { ssr: false });
const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const AddPromo = () => {

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoDiscountType, setPromoDiscountType] = useState('Percentage');
  const [dateError, setDateError] = useState(false);
  const [promoDescription, setPromoDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleTabChange = (key) => {
    setPromoDiscountType(key);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({
        src: URL.createObjectURL(file),
        file
      });
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const uploadImageToImgbb = async (image) => {
    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('key', apiKey);

    try {
      const response = await axiosPublic.post(apiURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.data && response.data.data.url) {
        return response.data.data.url; // Return the single image URL
      } else {
        toast.error('Failed to get image URL from response.');
      }
    } catch (error) {
      toast.error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
    }
    return null;
  };

  const handleGoBack = async () => {
    localStorage.setItem('activeTabMarketingPage', "create promotions");
    router.push("/dash-board/marketing");
  }

  const onSubmit = async (data) => {
    const { promoCode, promoDiscountValue, expiryDate, maxAmount, minAmount } = data;

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

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageToImgbb(image);
      if (!imageUrl) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    }
    setIsSubmitting(true);

    try {
      const discountData = {
        promoCode: promoCode.toUpperCase(),
        promoDiscountValue,
        promoDiscountType,
        expiryDate: formattedExpiryDate,
        maxAmount: maxAmount ? maxAmount : 0,
        minAmount: minAmount ? minAmount : 0,
        promoDescription,
        imageUrl,
        promoStatus: true
      };

      const response = await axiosPublic.post('/addPromoCode', discountData);
      if (response.data.insertedId) {
        toast.success('Promo published successfully!');
        localStorage.setItem('activeTabMarketingPage', "view performance");
        router.push("/dash-board/marketing");
      }
    } catch (err) {
      toast.error("Failed to publish promo!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-screen-2xl px-6 2xl:px-0 mx-auto'>

      <div className='max-w-screen-lg mx-auto flex items-center pt-3 md:pt-6'>
        <h3 className='w-full text-center font-semibold text-xl lg:text-2xl'>Create New Promo</h3>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-xl mx-auto pt-1 pb-6 flex flex-col gap-6'>

        <div className='grid grid-cols-1 lg:grid-cols-12'>
          <div className='grid grid-cols-1 lg:col-span-7 xl:col-span-7 gap-8 mt-6 px-6 py-3'>
            <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
              <div>
                <label htmlFor='promoCode' className='flex justify-start font-medium text-[#D2016E] pb-2'>Promo Code *</label>
                <input id='promoCode' placeholder='Enter Promo Code'  {...register("promoCode", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md uppercase" type="text" />
                {errors.promoCode?.type === "required" && (
                  <p className="text-red-600 text-left">Promo Code is required</p>
                )}
              </div>

              <div className="flex w-full flex-col">
                <Tabs
                  aria-label="Discount Type"
                  selectedKey={promoDiscountType}
                  onSelectionChange={handleTabChange}
                >
                  <Tab className='text-[#D2016E]' key="Percentage" title="Percentage">Percentage (%) *</Tab>
                  <Tab className='text-[#D2016E]' key="Amount" title="Amount">Amount (Taka) *</Tab>
                </Tabs>

                <input
                  type="number"
                  {...register('promoDiscountValue', { required: true })}
                  className='custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000'
                  placeholder={`Enter ${promoDiscountType} Discount`} // Correct placeholder
                />
                {errors.promoDiscountValue?.type === "required" && (
                  <p className="text-red-600 text-left">Discount Value is required</p>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
              <div>
                <label htmlFor='maxAmount' className='flex justify-start font-medium text-[#D2016E] pb-2'>Maximum Capped Amount</label>
                <input id='maxAmount' {...register("maxAmount", { required: true })} placeholder='Enter Maximum Capped Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                {errors.maxAmount?.type === "required" && (
                  <p className="text-red-600 text-left">Max Amount is required</p>
                )}
              </div>

              <div>
                <label htmlFor='minAmount' className='flex justify-start font-medium text-[#D2016E] pb-2'>Minimum Order Amount</label>
                <input id='minAmount' {...register("minAmount", { required: true })} placeholder='Enter Minimum Order Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                {errors.minAmount?.type === "required" && (
                  <p className="text-red-600 text-left">Min Amount is required</p>
                )}
              </div>

              <div>
                <label htmlFor='expiryDate' className='flex justify-start font-medium text-[#D2016E] pb-2'>Promo Expire On *</label>
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
                  className="w-full outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md"
                />

                {dateError && (
                  <p className="text-red-600 text-left">Please select Promo Expire Date.</p>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:col-span-5 xl:col-span-5 gap-8 mt-6 px-6 py-3'>
            <div className='flex flex-col gap-6 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

              <div className='flex w-full flex-col gap-2'>
                <label htmlFor='promoDescription' className='flex justify-start font-medium text-[#D2016E]'>Promo Description</label>
                <Controller
                  name="promoDescription"
                  defaultValue=""
                  control={control}
                  render={() => <Editor
                    value={promoDescription}
                    onChange={(value) => {
                      setPromoDescription(value);
                    }}
                  />}
                />
              </div>

              <div className='flex flex-col gap-4'>
                <input
                  id='imageUpload'
                  type='file'
                  className='hidden'
                  onChange={handleImageChange}
                />
                <label
                  htmlFor='imageUpload'
                  className='mx-auto flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white cursor-pointer'
                >
                  <MdOutlineFileUpload size={60} />
                  <div className='space-y-1.5 text-center'>
                    <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                      Upload Thumbnail
                    </h5>
                    <p className='text-sm text-gray-500'>
                      Photo Should be in PNG, JPEG or JPG format
                    </p>
                  </div>
                </label>

                {image && (
                  <div className='relative'>
                    <Image
                      src={image.src}
                      alt='Uploaded image'
                      height={100}
                      width={200}
                      className='w-3/4 mx-auto h-[350px] mt-4 rounded-md'
                    />
                    <button
                      onClick={handleImageRemove}
                      className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
                    >
                      <RxCross2 size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-between items-center px-6'>

          <button className='flex items-center gap-2 font-medium text-white rounded-lg bg-[#D2016E] hover:bg-[#d2016dca] py-2 px-4' onClick={() => handleGoBack()}><FaArrowLeft /> Go Back</button>

          <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#D2016E] hover:bg-[#d2016dca]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddPromo;