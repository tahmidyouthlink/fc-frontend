"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Select, SelectItem, Tab, Tabs } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import dynamic from 'next/dynamic';
import useCategories from '@/app/hooks/useCategories';
import { MdOutlineFileUpload } from 'react-icons/md';

const Editor = dynamic(() => import('@/app/utils/Editor/Editor'), { ssr: false });
const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const EditOffer = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [categoryList, isCategoryPending] = useCategories();
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerDiscountType, setOfferDiscountType] = useState('Percentage');
  const [expiryDate, setExpiryDate] = useState(''); // Initial state set to an empty string
  const [offerDescription, setOfferDescription] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sizeError, setSizeError] = useState(false);
  const [dateError, setDateError] = useState(false)
  const [offerDetails, setOfferDetails] = useState(null);

  const handleTabChange = (key) => {
    setOfferDiscountType(key);
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
    const fetchOfferData = async () => {
      try {
        const response = await axiosPublic.get(`/getSingleOffer/${id}`);
        const offer = response.data;

        // Ensure the expiry date is set to midnight to avoid timezone issues
        const fetchedExpiryDate = formatDateForInput(offer.expiryDate);

        // Set form fields with fetched offer data
        setValue('offerCode', offer?.offerCode);
        setValue('offerTitle', offer?.offerTitle);
        setValue('offerDiscountValue', offer?.offerDiscountValue);
        setExpiryDate(fetchedExpiryDate); // Ensure no time zone shift
        setValue('maxAmount', offer?.maxAmount || 0);
        setValue('minAmount', offer?.minAmount || 0);
        setOfferDiscountType(offer?.offerDiscountType);

        setOfferDescription(offer?.offerDescription || "");
        setImage(offer?.imageUrl || null);
        setCategories(categoryList);

        // Set selected categories
        setSelectedCategories(offer?.selectedCategories || []);
        setOfferDetails(offer);
        setIsLoading(false);
      } catch (err) {
        console.error(err); // Log error to the console for debugging
        toast.error("Failed to fetch offer code details!");
      }
    };

    fetchOfferData();
  }, [id, axiosPublic, setValue, categoryList, setOfferDetails]);

  const uploadToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.data && data.data.url) {
        return data.data.url; // Imgbb URL of the uploaded image
      } else {
        console.error('Error uploading image:', data);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Immediately upload the selected image to Imgbb
      const uploadedImageUrl = await uploadToImgbb(file);

      if (uploadedImageUrl) {
        // Update the state with the Imgbb URL instead of the local blob URL
        setImage({
          src: uploadedImageUrl,
          file: file,
        });
      }
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    document.getElementById('imageUpload').value = ''; // Clear the file input
  };

  const handleCategoryArray = (keys) => {
    const selectedArray = [...keys];
    setSelectedCategories(selectedArray);
  };

  const onSubmit = async (data) => {
    const { offerCode, offerTitle, offerDiscountValue, maxAmount, minAmount } = data;

    let hasError = false;

    // Initialize imageUrl with the existing one
    let imageUrl = offerDetails.imageUrl || '';

    // If a new image is uploaded, upload it to Imgbb
    if (image && image.file) {
      imageUrl = await uploadToImgbb(image.file);
      if (!imageUrl) {
        toast.error('Image upload failed, cannot proceed.');
        hasError = true;
      }
    } else if (image === null) {
      // If the image is removed, explicitly set imageUrl to an empty string
      imageUrl = '';
    }

    if (!expiryDate) {
      setDateError(true);
      hasError = true;
    } else {
      setDateError(false);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedExpiryDate = new Date(expiryDate);

      if (selectedExpiryDate < today) {
        toast.error("Expiry date cannot be in the past.");
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedDiscount = {
        offerCode,
        offerTitle,
        offerDiscountValue,
        offerDiscountType,
        expiryDate,
        maxAmount: maxAmount || 0,
        minAmount: minAmount || 0,
        offerDescription,
        selectedCategories,
        imageUrl
      };

      const res = await axiosPublic.put(`/updateOffer/${id}`, updatedDiscount);
      if (res.data.modifiedCount > 0) {
        toast.success('Offer updated successfully!');
        router.push('/dash-board/marketing');
      } else {
        toast.error('No changes detected.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error editing offer:', error);
      toast.error('Failed to update offer. Please try again!');
      setIsSubmitting(false);
    }
  };

  if (isLoading || isCategoryPending) {
    return <Loading />;
  }

  return (
    <div className='bg-gray-50  min-h-screen'>
      <div className='max-w-screen-2xl px-0 md:px-6 2xl:px-0 mx-auto'>

        <div className='max-w-screen-lg mx-auto flex items-center pt-3 md:pt-6'>
          <h3 className='w-full text-center font-semibold text-xl lg:text-2xl'>Edit Offer Code</h3>
        </div>

        {/* Your form code */}
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-xl mx-auto pt-1 pb-6 flex flex-col gap-6'>

          <div className='grid grid-cols-1 lg:grid-cols-12'>
            <div className='grid grid-cols-1 lg:col-span-7 xl:col-span-7 gap-8 mt-6 px-6 py-3'>
              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                <div>
                  <label htmlFor='offerCode' className='flex justify-start font-medium text-[#D2016E]'>Offer Code *</label>
                  <input id='offerCode' {...register("offerCode", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="text" />
                  {errors.offerCode?.type === "required" && (
                    <p className="text-red-600 text-left">Offer Code is required</p>
                  )}
                </div>

                <div>
                  <label htmlFor='offerTitle' className='flex justify-start font-medium text-[#D2016E]'>Offer Title *</label>
                  <input id='offerTitle' {...register("offerTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="text" />
                  {errors.offerTitle?.type === "required" && (
                    <p className="text-red-600 text-left">Offer Title is required</p>
                  )}
                </div>

                <div className="flex w-full flex-col">
                  <Tabs
                    aria-label="Select Discount Type"
                    selectedKey={offerDiscountType} // Default select based on fetched data
                    onSelectionChange={handleTabChange}
                  >
                    <Tab key="Percentage" title="Percentage">Percentage (%)</Tab>
                    <Tab key="Amount" title="Amount">Amount (Taka)</Tab>
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
                          {categories?.map((category) => (
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
                  <label htmlFor='maxAmount' className='flex justify-start font-medium text-[#D2016E]'>Maximum Capped Amount</label>
                  <input id='maxAmount' {...register("maxAmount")} placeholder='Enter Maximum Capped Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                </div>

                <div>
                  <label htmlFor='minAmount' className='flex justify-start font-medium text-[#D2016E]'>Minimum Order Amount</label>
                  <input id='minAmount' {...register("minAmount")} placeholder='Enter Minimum Order Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                </div>

                <div className="space-y-2">
                  <label htmlFor='expiryDate' className='block text-[#D2016E] font-medium text-sm'>
                    Expiry Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    {...register("expiryDate", { required: true })}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)} // Update state with the input value
                    className="w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000"
                  />
                  {dateError && (
                    <p className="text-red-600 text-sm mt-1">Expiry Date is required</p>
                  )}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 lg:col-span-5 xl:col-span-5 gap-8 mt-6 px-6 py-3'>

              <div className='flex flex-col gap-6 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

                <div className='flex w-full flex-col gap-2'>
                  <label htmlFor='offerDescription' className='flex justify-start font-medium text-[#D2016E] pb-2'>Offer Description</label>
                  <Controller
                    control={control}
                    name="offerDescription"
                    render={({ field }) => (
                      <Editor
                        {...field}
                        value={offerDescription}
                        onChange={setOfferDescription}
                      />
                    )}
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
                        src={typeof image === 'string' ? image : image.src}
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

          <div className='flex justify-between items-center px-5'>

            <Link className='flex items-center gap-2 font-medium text-white rounded-lg bg-[#D2016E] hover:bg-[#d2016dca] py-2 px-4' href={"/dash-board/marketing"}> <FaArrowLeft /> Go Back</Link>

            <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#D2016E] hover:bg-[#d2016dca]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
              {isSubmitting ? 'Submitting...' : 'Update offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOffer;