"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { DatePicker, Select, SelectItem, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import dynamic from 'next/dynamic';
import { MdOutlineFileUpload } from 'react-icons/md';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import useCategories from '@/app/hooks/useCategories';
import Loading from '@/app/components/shared/Loading/Loading';

const Editor = dynamic(() => import('@/app/utils/Editor/Editor'), { ssr: false });
const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const AddOffer = () => {

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [categoryList, isCategoryPending] = useCategories();
  const [offerDiscountType, setOfferDiscountType] = useState('Percentage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [offerDescription, setOfferDescription] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleTabChange = (key) => {
    setOfferDiscountType(key);
  };

  const handleShowDateError = (date) => {
    setDateError(!date);
  };

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

  const handleCategoryArray = (keys) => {
    const selectedArray = [...keys];
    setSelectedCategories(selectedArray);
  };

  const onSubmit = async (data) => {
    const { offerCode, offerTitle, offerDiscountValue, expiryDate, maxAmount, minAmount } = data;

    // Check if expiryDate is selected
    if (!expiryDate) {
      setDateError(true);
      return;
    } else {
      setDateError(false);

      // Validate date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedExpiryDate = new Date(expiryDate);

      if (selectedExpiryDate < today) {
        toast.error("Expiry date cannot be in the past.");
        return;
      }
    }

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
      const offerData = {
        offerCode,
        offerTitle,
        offerDiscountValue,
        offerDiscountType,
        offerDescription,
        selectedCategories,
        expiryDate: formattedExpiryDate,
        maxAmount: maxAmount ? maxAmount : 0,
        minAmount: minAmount ? minAmount : 0,
        offerStatus: true,
        imageUrl
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

  if (isCategoryPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50  min-h-screen'>
      <div className='max-w-screen-2xl px-6 2xl:px-0 mx-auto'>

        <div className='max-w-screen-xl mx-auto flex items-center pt-3 md:pt-6'>
          <h3 className='w-full text-center font-semibold text-xl lg:text-2xl'>Create New Offer</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-xl mx-auto pt-1 pb-6 flex flex-col gap-6'>

          <div className='grid grid-cols-1 lg:grid-cols-12'>
            <div className='grid grid-cols-1 lg:col-span-7 xl:col-span-7 gap-8 mt-6 px-6 py-3'>
              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                <div>
                  <label htmlFor='offerCode' className='flex justify-start font-medium text-[#D2016E] pb-2'>Offer Code *</label>
                  <input id='offerCode' placeholder='Enter Offer Code'  {...register("offerCode", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="text" />
                  {errors.offerCode?.type === "required" && (
                    <p className="text-red-600 text-left">Offer Code is required</p>
                  )}
                </div>

                <div>
                  <label htmlFor='offerTitle' className='flex justify-start font-medium text-[#D2016E] pb-2'>Offer Title *</label>
                  <input id='offerTitle' placeholder='Enter Offer Title'  {...register("offerTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="text" />
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
                    <Tab className='text-[#D2016E]' key="Percentage" title="Percentage">Percentage (%) *</Tab>
                    <Tab className='text-[#D2016E]' key="Amount" title="Amount">Amount (Taka) *</Tab>
                  </Tabs>

                  <input
                    type="number"
                    {...register('offerDiscountValue', { required: true })}
                    className='custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000'
                    placeholder={`Enter ${offerDiscountType} Discount`} // Correct placeholder
                  />
                  {errors.offerDiscountValue?.type === "required" && (
                    <p className="text-red-600 text-left">Discount Value is required</p>
                  )}
                </div>

                <div className="mt-4">
                  <Controller
                    name="categories"
                    control={control}
                    defaultValue={selectedCategories}
                    render={({ field }) => (
                      <div>
                        <Select
                          label="Select offer related categories"
                          selectionMode="multiple"
                          value={selectedCategories}
                          placeholder="Select Categories"
                          selectedKeys={new Set(selectedCategories)}
                          onSelectionChange={(keys) => {
                            handleCategoryArray(keys);
                            field.onChange([...keys]);
                          }}
                        >
                          {categoryList?.map((category) => (
                            <SelectItem key={category.key}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    )}
                  />
                </div>

              </div>

              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                <div>
                  <label htmlFor='maxAmount' className='flex justify-start font-medium text-[#D2016E] pb-2'>Maximum Capped Amount</label>
                  <input id='maxAmount' {...register("maxAmount")} placeholder='Enter Maximum Capped Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                </div>

                <div>
                  <label htmlFor='minAmount' className='flex justify-start font-medium text-[#D2016E] pb-2'>Minimum Order Amount</label>
                  <input id='minAmount' {...register("minAmount")} placeholder='Enter Minimum Order Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                </div>

                <div>
                  <label htmlFor='expiryDate' className='flex justify-start font-medium text-[#D2016E] pb-2'>Offer Expire On *</label>
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
                    <p className="text-red-600 text-left">Please select Offer Expire Date.</p>
                  )}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 lg:col-span-5 xl:col-span-5 gap-8 mt-6 px-6 py-3'>
              <div className='flex flex-col gap-6 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

                <div className='flex w-full flex-col gap-2'>
                  <label htmlFor='offerDescription' className='flex justify-start font-medium text-[#D2016E]'>Offer Description</label>
                  <Controller
                    name="offerDescription"
                    defaultValue=""
                    control={control}
                    render={() => <Editor
                      value={offerDescription}
                      onChange={(value) => {
                        setOfferDescription(value);
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

            <Link className='flex items-center gap-2 font-medium text-white rounded-lg bg-[#D2016E] hover:bg-[#d2016dca] py-2 px-4' href={"/dash-board/marketing"}> <FaArrowLeft /> Go Back</Link>

            <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#D2016E] hover:bg-[#d2016dca]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

          </div>

        </form>

      </div >
    </div >
  );
};

export default AddOffer;