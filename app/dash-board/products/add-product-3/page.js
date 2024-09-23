"use client";
import { shippingServices } from '@/app/components/layout/shippingServices';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useShippingZones from '@/app/hooks/useShippingZones';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const ThirdStepOfAddProduct = () => {

  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { handleSubmit } = useForm();
  const [shippingList, isShippingPending] = useShippingZones();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState([]);
  const [sizeError, setSizeError] = useState(false);

  // Toggle card selection
  const toggleCardSelection = (shipping) => {
    const isSelected = selectedShipmentHandler.some(
      (handler) => handler.shippingZone === shipping.shippingZone
    );

    if (isSelected) {
      // If already selected, remove from selectedShipmentHandler
      const updatedSelection = selectedShipmentHandler.filter(
        (handler) => handler.shippingZone !== shipping.shippingZone
      );
      setSelectedShipmentHandler(updatedSelection);
    } else {
      // Add the full shipping object to the selectedShipmentHandler
      const updatedSelection = [...selectedShipmentHandler, shipping];
      setSelectedShipmentHandler(updatedSelection);

      if (sizeError) {
        setSizeError(false);
      }
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    if (selectedShipmentHandler.length === 0) {
      setSizeError(true);
      setIsSubmitting(false);
      return;
    }

    const storedProductTitle = localStorage.getItem('productTitle');
    const storedRegularPrice = localStorage.getItem('regularPrice');
    const storedUploadedImageUrls = JSON.parse(localStorage.getItem('uploadedImageUrls') || '[]');
    const storedDiscountType = localStorage.getItem('discountType');
    const storedDiscountValue = localStorage.getItem('discountValue');
    const storedProductDetails = localStorage.getItem('productDetails');
    const storedMaterialCare = localStorage.getItem('materialCare');
    const storedSizeFit = localStorage.getItem('sizeFit');
    const storedCategory = localStorage.getItem('category');
    const storedSubCategories = JSON.parse(localStorage.getItem('subCategories') || '[]');
    const storedGroupOfSizes = JSON.parse(localStorage.getItem('groupOfSizes') || '[]');
    const storedAllSizes = JSON.parse(localStorage.getItem('allSizes') || '[]');
    const storedAvailableColors = JSON.parse(localStorage.getItem('availableColors') || '[]');
    const storedNewArrival = localStorage.getItem('newArrival');
    const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    const storedTags = JSON.parse(localStorage.getItem('tags') || '[]');
    const storedVariants = JSON.parse(localStorage.getItem('productVariants') || '[]');

    const wholeProductData = {
      productTitle: storedProductTitle,
      regularPrice: storedRegularPrice,
      imageUrls: storedUploadedImageUrls,
      discountType: storedDiscountType,
      discountValue: storedDiscountValue,
      productDetails: storedProductDetails,
      materialCare: storedMaterialCare,
      sizeFit: storedSizeFit,
      category: storedCategory,
      subCategories: storedSubCategories,
      groupOfSizes: storedGroupOfSizes,
      allSizes: storedAllSizes,
      availableColors: storedAvailableColors,
      newArrival: storedNewArrival,
      vendors: storedVendors,
      tags: storedTags,
      productVariants: storedVariants,
      shippingDetails: selectedShipmentHandler
    }

    try {
      // Post the entire selectedShipmentHandler array, which contains full shipping details
      const response = await axiosPublic.post('/addProduct', wholeProductData);

      if (response?.data?.insertedId) {
        toast.success('Product Details added successfully!');
        router.push("/dash-board/products/existing-products");
      }
    } catch (error) {
      console.error("Error response:", error.response || error.message);
      setIsSubmitting(false);
      toast.error('Failed to add Product Details. Please try again!');
    }
  };

  if (isShippingPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Shipping Details</h3>

      <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-2xl mx-auto mt-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-6'>
          {shippingList?.map((shipping, index) => {
            const isSelected = selectedShipmentHandler.some(
              (handler) => handler.shippingZone === shipping?.shippingZone
            );
            return (
              <div
                key={index}
                onClick={() => toggleCardSelection(shipping)} // Pass full shipping details
                className={`cursor-pointer flex flex-col gap-4 p-5 md:p-7 rounded-lg transition-all duration-200 ${isSelected ? 'border-2 border-blue-500 bg-gray-50 duration-300' : 'border border-gray-200 bg-white'
                  }`}
              >
                {/* Shipping Zone Title - Large and Bold */}
                <h1 className="text-2xl font-bold text-gray-900 text-center">{shipping?.shippingZone}</h1>

                {/* Mapping over selectedShipmentHandler to display names and logos */}
                <div className='flex items-center justify-center gap-4'>
                  {shipping?.selectedShipmentHandler?.map((handlerName, handlerIndex) => {
                    const handler = shippingServices.find(service => service.name === handlerName);

                    return (
                      <div key={handlerIndex} className="p-4 rounded-lg flex flex-col items-center justify-center h-40 w-40">
                        {handler?.logoURL && (
                          <Image
                            src={handler.logoURL}
                            alt={handler.name}
                            width={100}
                            height={100}
                            className="mb-2 object-contain h-32 w-32"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {sizeError && (
          <p className='text-red-600 text-left mt-4 max-w-screen-xl px-6'>Please select at least one shipping handler.</p>
        )}

        <div className='flex justify-between mt-6 px-6'>
          <Link href='/dash-board/products/add-product-2' className='flex items-center gap-2 mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium'>
            <FaArrowLeft /> Previous Step
          </Link>
          <button disabled={isSubmitting} type='submit' className={`mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium`}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

    </div>
  );
};

export default ThirdStepOfAddProduct;