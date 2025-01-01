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
import { RxCheck, RxCross2 } from 'react-icons/rx';
import dynamic from 'next/dynamic';
import useCategories from '@/app/hooks/useCategories';
import { MdOutlineFileUpload } from 'react-icons/md';
import useProductsInformation from '@/app/hooks/useProductsInformation';
import ProductSearchSelectId from '@/app/components/layout/ProductSearchSelectId';
import CategorySearchSelectId from '@/app/components/layout/CategorySearchSelectId';

const Editor = dynamic(() => import('@/app/utils/Editor/Editor'), { ssr: false });
const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const EditOffer = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerDiscountType, setOfferDiscountType] = useState('Percentage');
  const [expiryDate, setExpiryDate] = useState(''); // Initial state set to an empty string
  const [offerDescription, setOfferDescription] = useState("");
  const [image, setImage] = useState(null);
  const [categoryList, isCategoryPending] = useCategories();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [dateError, setDateError] = useState(false)
  const [offerDetails, setOfferDetails] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productList, isProductPending] = useProductsInformation();
  const [productIdError, setProductIdError] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Products');

  const handleTabChangeForCategoryOrProduct = (key) => {
    setSelectedTab(key);
    // Reset the other tab's value when switching tabs
    if (key === "Products") {
      setSelectedCategories([]); // Clear selected categories when switching to Products
    } else if (key === "Categories") {
      setSelectedProductIds([]); // Clear selected products when switching to Categories
    }
  };

  const handleTabChange = (key) => {
    setOfferDiscountType(key);
    setValue("maxAmount", '');
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
        setValue('offerTitle', offer?.offerTitle);
        setValue('badgeTitle', offer?.badgeTitle);
        setValue('offerDiscountValue', offer?.offerDiscountValue);
        setExpiryDate(fetchedExpiryDate); // Ensure no time zone shift
        setValue('maxAmount', offer?.maxAmount || 0);
        setValue('minAmount', offer?.minAmount || 0);
        setOfferDiscountType(offer?.offerDiscountType);

        setOfferDescription(offer?.offerDescription || "");
        setImage(offer?.imageUrl || null);

        setSelectedCategories(offer?.selectedCategories || []);
        setSelectedProductIds(offer?.selectedProductIds || []);

        // Determine which tab to show based on the fetched data
        if (offer?.selectedCategories?.length > 0) {
          setSelectedTab('Categories');
        } else if (offer?.selectedProductIds?.length > 0) {
          setSelectedTab('Products');
        } else {
          setSelectedTab('Products'); // Default tab if both are empty
        }

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

  const handleCategorySelectionChange = (selectedCats) => {
    setSelectedCategories(selectedCats);
    setCategoryError(selectedCats.length === 0);
  };

  const handleProductSelectionChange = (selectedIds) => {
    setSelectedProductIds(selectedIds);
    setProductIdError(selectedIds.length === 0);
  };

  const onSubmit = async (data) => {
    const { offerTitle, offerDiscountValue, maxAmount, minAmount, badgeTitle } = data;

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

    if (selectedTab === "Products" && selectedProductIds.length === 0) {
      setProductIdError(true);
      return;
    }

    if (selectedTab === "Categories" && selectedCategories.length === 0) {
      setCategoryError(true);
      return;
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedDiscount = {
        offerTitle,
        badgeTitle,
        offerDiscountValue,
        offerDiscountType,
        expiryDate,
        maxAmount: maxAmount || 0,
        minAmount: minAmount || 0,
        offerDescription,
        selectedCategories,
        imageUrl,
        selectedProductIds
      };

      const res = await axiosPublic.put(`/updateOffer/${id}`, updatedDiscount);
      if (res.data.modifiedCount > 0) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
          >
            <div className="pl-6">
              <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
            </div>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-gray-900">
                    Offer Updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    The offer has been successfully updated!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-text-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        })
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

  if (isLoading || isCategoryPending || isProductPending) {
    return <Loading />;
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-screen-2xl px-6 2xl:px-0 mx-auto'>

        <div className='max-w-screen-xl mx-auto pt-3 sticky top-0 z-10 bg-gray-50'>
          <div className='flex items-center justify-between'>
            <h3 className='w-full font-semibold text-lg md:text-xl lg:text-2xl'>Edit Offer Configuration</h3>
            <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/marketing"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
          </div>
        </div>

        {/* Your form code */}
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-xl mx-auto pt-1 pb-6 flex flex-col gap-6'>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6'>
            <div className='grid grid-cols-1 lg:col-span-7 xl:col-span-7 gap-8 mt-3 py-3 h-fit'>
              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>
                <div>
                  <label htmlFor='offerTitle' className='flex justify-start font-medium text-[#D2016E]'>Offer Title *</label>
                  <input id='offerTitle' {...register("offerTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="text" />
                  {errors.offerTitle?.type === "required" && (
                    <p className="text-red-600 text-left">Offer Title is required</p>
                  )}
                </div>
                <div>
                  <label htmlFor='badgeTitle' className='flex justify-start font-medium text-[#D2016E] pb-2'>Badge Title *</label>
                  <input id='badgeTitle' placeholder='Enter Badge Title'  {...register("badgeTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="text" />
                  {errors.badgeTitle?.type === "required" && (
                    <p className="text-red-600 text-left">Badge Title is required</p>
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

              </div>

              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>

                <div>
                  <label htmlFor='minAmount' className='flex justify-start font-medium text-[#D2016E]'>Minimum Order Amount *</label>
                  <input id='minAmount' {...register("minAmount")} placeholder='Enter Minimum Order Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                </div>

                {offerDiscountType === "Percentage" && <div>
                  <label htmlFor='maxAmount' className='flex justify-start font-medium text-[#D2016E]'>Maximum Capped Amount *</label>
                  <input id='maxAmount' {...register("maxAmount")} placeholder='Enter Maximum Capped Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md" type="number" />
                </div>}

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

            <div className='grid grid-cols-1 lg:col-span-5 xl:col-span-5 gap-8 mt-3 py-3'>

              <div className='flex flex-col bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

                <Tabs
                  aria-label="Product and Category Selection"
                  selectedKey={selectedTab}
                  onSelectionChange={handleTabChangeForCategoryOrProduct}
                >
                  <Tab key="Products" title="Products">
                    <div>
                      <label htmlFor='Product Title' className='flex justify-start font-medium text-[#D2016E] pb-2'>Product Title *</label>
                      {productList && (
                        <ProductSearchSelectId
                          productList={productList}
                          value={selectedProductIds}
                          onSelectionChange={handleProductSelectionChange}
                        />
                      )}
                      {productIdError && <p className="text-red-600 text-left">Select at least one product ID</p>}
                    </div>
                  </Tab>
                  <Tab key="Categories" title="Categories">
                    <div>
                      <label htmlFor='Category' className='flex justify-start font-medium text-[#D2016E] pb-2'>Category Selection *</label>
                      {categoryList && (
                        <CategorySearchSelectId
                          categoryList={categoryList}
                          value={selectedCategories} // Persist selected categories
                          onSelectionChange={handleCategorySelectionChange}
                        />
                      )}
                      {categoryError && <p className="text-red-600 text-left">Select at least one category</p>}
                    </div>
                  </Tab>
                </Tabs>

              </div>

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
                        height={3000}
                        width={3000}
                        className='w-full min-h-[200px] max-h-[200px] rounded-md object-contain'
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

          <div className='flex justify-end items-center'>

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