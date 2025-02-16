"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { DatePicker, Tab, Tabs } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import dynamic from 'next/dynamic';
import { MdOutlineFileUpload } from 'react-icons/md';
import Image from 'next/image';
import { RxCheck, RxCross1, RxCross2 } from 'react-icons/rx';
import useCategories from '@/app/hooks/useCategories';
import Loading from '@/app/components/shared/Loading/Loading';
import useProductsInformation from '@/app/hooks/useProductsInformation';
import ProductSearchSelect from '@/app/components/layout/ProductSearchSelect';
import useOffers from '@/app/hooks/useOffers';
import { HiCheckCircle } from 'react-icons/hi2';

const Editor = dynamic(() => import('@/app/utils/Editor/Editor'), { ssr: false });
const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const AddOffer = () => {

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [offerDiscountType, setOfferDiscountType] = useState('Percentage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [offerDescription, setOfferDescription] = useState("");
  const [image, setImage] = useState(null);
  const [categoryList, isCategoryPending] = useCategories();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productList, isProductPending] = useProductsInformation();
  const [offerList, isOfferPending] = useOffers();
  const [productIdError, setProductIdError] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

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

  const handleProductSelectionChange = async (selectedIds) => {
    if (selectedIds.length === 0) {
      setProductIdError(true);
      setSelectedProductIds([]); // ✅ Ensure state is reset properly
      return false;
    }

    setProductIdError(false);

    // Get categories of the selected products
    const selectedProductsCategories = selectedIds?.map(
      (prodId) => productList?.find((p) => p?.productId === prodId)?.category
    );

    // Check if any selected product is already in another offer
    const hasConflict = selectedIds?.some((prodId) =>
      offerList?.some((offer) =>
        offer?.selectedProductIds?.includes(prodId)
      )
    );

    // Check if any selected product's category is already in another offer
    const categoryConflict = selectedProductsCategories?.some((category) =>
      offerList?.some((offer) =>
        offer?.selectedCategories.includes(category)
      )
    );

    if (hasConflict) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="ml-6 p-1.5 rounded-full bg-red-500">
            <RxCross1 className="h-4 w-4 text-white rounded-full" />
          </div>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900">
                  Your selected product is already part of another offer.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please choose a different product or remove it from the other offer.
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
      return false;
    }

    if (categoryConflict) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="ml-6 p-1.5 rounded-full bg-red-500">
            <RxCross1 className="h-4 w-4 text-white rounded-full" />
          </div>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900">
                  Your selected product is already part of another category.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please choose a different product or remove that category from the other offer.
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
      return false;
    }

    // ✅ Ensure state updates correctly
    setSelectedProductIds([...selectedIds]);
    return true;
  };

  // Handle category selection
  const handleCategorySelectionChange = async (categoryLabel) => {
    let updatedSelectedCategories;

    // If the category is already selected, remove it
    if (selectedCategories?.includes(categoryLabel)) {
      updatedSelectedCategories = selectedCategories?.filter((category) => category !== categoryLabel);
    } else {
      updatedSelectedCategories = [...selectedCategories, categoryLabel];
    }

    // Step 1: Get the list of product IDs already part of any offers
    const productsInOffers = offerList?.flatMap((offer) => offer?.selectedProductIds);

    // Step 2: Check if the selected categories are already part of an offer
    const categoryConflict = updatedSelectedCategories?.some((category) =>
      offerList?.some((offer) => offer?.selectedCategories?.includes(category)) // Check if category is already in offer
    );

    // Step 3: Check if any of the selected categories' products are already part of an offer
    const hasProductConflict = updatedSelectedCategories?.some((category) => {
      const categoryProducts = productList?.filter((product) => product?.category === category)?.map((product) => product?.productId);
      return categoryProducts?.some((prodId) => productsInOffers?.includes(prodId)); // If any of these products are already in the offer
    });

    // Step 4: Handle conflicts (either category conflict or product conflict)
    if (categoryConflict) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="ml-6 p-1.5 rounded-full bg-red-500">
            <RxCross1 className="h-4 w-4 text-white rounded-full" />
          </div>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900">
                  {`${categoryLabel} are already in another offer.`}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please choose a different category or remove it from the other offer.
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
      return; // Don't update the selected categories if there's a category conflict
    };

    if (hasProductConflict) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="ml-6 p-1.5 rounded-full bg-red-500">
            <RxCross1 className="h-4 w-4 text-white rounded-full" />
          </div>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900">
                  {`Products in ${categoryLabel} are already in another offer`}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a different category or remove its products from the other offer.
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
      return; // Don't update the selected categories if there's a product conflict
    };

    // Update selected categories only if no conflicts
    setCategoryError(false);
    setSelectedCategories(updatedSelectedCategories);
  };

  // Filter categories based on search input and remove already selected categories
  const filteredCategories = categoryList?.filter((category) =>
    category?.label?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sorting A → Z

  const handleGoBack = async () => {
    localStorage.setItem('activeTabMarketingPage', "create promotions");
    router.push("/dash-board/marketing");
  }

  const onSubmit = async (data) => {
    const { offerTitle, offerDiscountValue, expiryDate, maxAmount, minAmount, badgeTitle } = data;

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

    // Check if the selected tab is "Products"
    if (selectedTab === "Products") {
      if (selectedProductIds.length === 0) {
        setProductIdError(true);
        return;
      } else {
        setProductIdError(false); // Clear error if there are selected IDs
      }
    }

    // Check if the selected tab is "Categories"
    if (selectedTab === "Categories") {
      if (selectedCategories.length === 0) {
        setCategoryError(true);
        return;
      } else {
        setCategoryError(false); // Clear error if there are selected categories
      }
    }

    setIsSubmitting(true);

    try {
      const offerData = {
        offerTitle,
        badgeTitle,
        offerDiscountValue,
        offerDiscountType,
        offerDescription,
        selectedCategories,
        expiryDate: formattedExpiryDate,
        maxAmount: maxAmount ? maxAmount : 0,
        minAmount: minAmount ? minAmount : 0,
        offerStatus: true,
        imageUrl,
        selectedProductIds
      };

      const response = await axiosPublic.post('/addOffer', offerData);
      if (response.data.insertedId) {
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
                    Offer Published!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    The offer has been successfully launched!
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
        localStorage.setItem('activeTabMarketingPage', "view performance");
        router.push("/dash-board/marketing");
      }
    } catch (err) {
      toast.error("Failed to publish offer!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCategoryPending || isProductPending || isOfferPending) {
    return <Loading />
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-screen-2xl px-6 2xl:px-0 mx-auto'>

        <div className='max-w-screen-xl mx-auto pt-3 sticky top-0 z-10 bg-gray-50'>
          <div className='flex items-center justify-between'>
            <h3 className='w-full font-semibold text-lg md:text-xl lg:text-2xl'>Offer Configuration</h3>
            <button className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' onClick={() => handleGoBack()}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-xl mx-auto pt-1 pb-6 flex flex-col'>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6'>
            <div className='grid grid-cols-1 lg:col-span-5 gap-8 mt-3 py-3 h-fit'>
              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>
                <div>
                  <label htmlFor='offerTitle' className='flex justify-start font-medium text-[#9F5216] pb-2'>Offer Title *</label>
                  <input id='offerTitle' placeholder='Enter Offer Title'  {...register("offerTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="text" />
                  {errors.offerTitle?.type === "required" && (
                    <p className="text-red-600 text-left">Offer Title is required</p>
                  )}
                </div>
                <div>
                  <label htmlFor='badgeTitle' className='flex justify-start font-medium text-[#9F5216] pb-2'>Badge Title *</label>
                  <input id='badgeTitle' placeholder='Enter Badge Title'  {...register("badgeTitle", { required: true, maxLength: 12 })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" maxLength="12" type="text" />
                  {errors.badgeTitle?.type === "required" && (
                    <p className="text-red-600 text-left">Badge Title is required</p>
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

              </div>

              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>

                <div>
                  <label htmlFor='minAmount' className='flex justify-start font-medium text-[#9F5216] pb-2'>Minimum Order Amount *</label>
                  <input id='minAmount' {...register("minAmount")} placeholder='Enter Minimum Order Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="number" />
                </div>

                {offerDiscountType === "Percentage" && <div>
                  <label htmlFor='maxAmount' className='flex justify-start font-medium text-[#9F5216] pb-2'>Maximum Capped Amount *</label>
                  <input id='maxAmount' {...register("maxAmount")} placeholder='Enter Maximum Capped Amount' className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="number" />
                </div>}

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
              </div>
            </div>
            <div className='grid grid-cols-1 lg:col-span-7 gap-8 mt-3 py-3 h-fit'>

              <div className='flex flex-col bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>
                <Tabs
                  aria-label="Product and Category Selection"
                  selectedKey={selectedTab}
                  onSelectionChange={handleTabChangeForCategoryOrProduct}
                >
                  <Tab key="Products" title="Products">
                    <div>
                      <label htmlFor='Product Selection' className='flex justify-start font-medium text-[#9F5216] pb-2'>Product Selection *</label>
                      <ProductSearchSelect
                        productList={productList}
                        onSelectionChange={handleProductSelectionChange}
                        selectedProductIds={selectedProductIds}
                      />
                      {productIdError && <p className="text-red-600 text-left">Please select at least one product ID</p>}
                    </div>
                  </Tab>
                  <Tab key="Categories" title="Categories">
                    <div>
                      <label htmlFor='Category' className='flex justify-start font-medium text-[#9F5216] pb-2'>Category Selection *</label>
                      <div className="w-full mx-auto" ref={dropdownRef}>
                        {/* Search Box */}
                        <input
                          type="text"
                          value={isDropdownOpen ? searchTerm : selectedCategories.join(", ")} // Show selected IDs when closed
                          onChange={(e) => setSearchTerm(e?.target?.value)}
                          onClick={() => setIsDropdownOpen(true)} // Toggle dropdown on input click
                          placeholder="Search & Select by Categories"
                          className="mb-2 w-full rounded-md border border-gray-300 p-2 outline-none transition-colors duration-1000 focus:border-[#9F5216] overflow-hidden text-ellipsis whitespace-nowrap"
                        />

                        {/* Dropdown list for search results */}
                        {isDropdownOpen && (
                          <div className="border flex flex-col gap-1.5 p-2 max-h-64 overflow-y-auto rounded-lg">
                            {filteredCategories?.length > 0 ? (
                              filteredCategories?.map((category) => (
                                <div
                                  key={category?._id}
                                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-1 transition-[border-color,background-color] duration-300 ease-in-out hover:border-[#d7ecd2] hover:bg-[#fafff9] ${selectedCategories?.includes(category?.label) ? 'border-[#d7ecd2] bg-[#fafff9]' : 'border-neutral-100'}`}
                                  onClick={() => handleCategorySelectionChange(category?.label)}
                                >
                                  <div className='flex items-center gap-1'>
                                    <Image
                                      width={4000}
                                      height={4000}
                                      src={category?.imageUrl}
                                      alt={category?.label}
                                      className="h-12 w-12 object-cover rounded"
                                    />
                                    <span className="ml-2 font-medium">{category?.label}</span>
                                  </div>
                                  <HiCheckCircle
                                    className={`pointer-events-none size-7 text-[#60d251] transition-opacity duration-300 ease-in-out ${selectedCategories?.includes(category?.label) ? "opacity-100" : "opacity-0"}`}
                                  />
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No categories found</p>
                            )}
                          </div>
                        )}

                      </div>
                      {categoryError && <p className="text-red-600 text-left">Select at least one category</p>}
                    </div>
                  </Tab>
                </Tabs>

              </div>

              <div className='flex flex-col gap-6 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>
                <div className='flex w-full flex-col gap-2'>
                  <label htmlFor='offerDescription' className='flex justify-start font-medium text-[#9F5216]'>Offer Description</label>
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

          <div className='flex justify-end items-center mt-3'>

            <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#ffddc2] hover:bg-[#fbcfb0]'} relative z-[1] flex items-center gap-x-3 rounded-lg  px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out font-bold text-[14px] text-neutral-700 mt-4 mb-8`}>
              {isSubmitting ? 'Submitting...' : 'Submit'} <MdOutlineFileUpload size={20} />
            </button>

          </div>

        </form>

      </div >
    </div >
  );
};

export default AddOffer;