"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useShipmentHandlers from '@/app/hooks/useShipmentHandlers';
import useShippingZones from '@/app/hooks/useShippingZones';
import { Checkbox } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const ThirdStepOfAddProduct = () => {

  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { handleSubmit } = useForm();
  const [shippingList, isShippingPending] = useShippingZones();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // State for "select all"
  const [sizeError, setSizeError] = useState(false);
  const [shipmentHandlerList, isShipmentHandlerPending] = useShipmentHandlers();

  // Toggle card selection
  const toggleCardSelection = (shipping) => {
    const isSelected = selectedShipmentHandler.some(
      (handler) => handler.shippingZone === shipping.shippingZone
    );

    if (isSelected) {
      const updatedSelection = selectedShipmentHandler.filter(
        (handler) => handler.shippingZone !== shipping.shippingZone
      );
      setSelectedShipmentHandler(updatedSelection);
    } else {
      const updatedSelection = [...selectedShipmentHandler, shipping];
      setSelectedShipmentHandler(updatedSelection);

      if (sizeError) {
        setSizeError(false);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedShipmentHandler([]); // Deselect all
    } else {
      setSelectedShipmentHandler(shippingList); // Select all
      setSizeError(false);
    }
    setSelectAll(!selectAll); // Toggle selectAll state
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    if (selectedShipmentHandler.length === 0) {
      setSizeError(true);
      setIsSubmitting(false);
      return;
    }

    const storedFormattedDate = localStorage.getItem("formattedDate")
    const storedProductTitle = localStorage.getItem('productTitle');
    const storedProductWeight = localStorage.getItem('weight');
    const storedProductBatchCode = localStorage.getItem('batchCode');
    const storedRegularPrice = localStorage.getItem('regularPrice');
    const storedUploadedImageUrls = JSON.parse(localStorage.getItem('uploadedImageUrls') || '[]');
    const storedDiscountType = localStorage.getItem('discountType');
    const storedDiscountValue = localStorage.getItem('discountValue');
    const storedProductDetails = localStorage.getItem('productDetails');
    const storedMaterialCare = localStorage.getItem('materialCare');
    const storedSizeFit = localStorage.getItem('sizeFit');
    const storedCategory = localStorage.getItem('category');
    const storedSeason = JSON.parse(localStorage.getItem('season') || '[]');
    const storedSubCategories = JSON.parse(localStorage.getItem('subCategories') || '[]');
    const storedGroupOfSizes = JSON.parse(localStorage.getItem('groupOfSizes') || '[]');
    const storedAllSizes = JSON.parse(localStorage.getItem('allSizes') || '[]');
    const storedAvailableColors = JSON.parse(localStorage.getItem('availableColors') || '[]');
    const storedNewArrival = localStorage.getItem('newArrival');
    const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    const storedTags = JSON.parse(localStorage.getItem('tags') || '[]');
    const storedVariants = JSON.parse(localStorage.getItem('productVariants') || '[]');
    const storedProductId = localStorage.getItem('productId');

    const wholeProductData = {
      publishDate: storedFormattedDate,
      productTitle: storedProductTitle,
      weight: storedProductWeight,
      batchCode: storedProductBatchCode,
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
      season: storedSeason,
      productVariants: storedVariants,
      shippingDetails: selectedShipmentHandler,
      productId: storedProductId,
      status: "active"
    }

    try {
      // Post the entire selectedShipmentHandler array, which contains full shipping details
      const response = await axiosPublic.post('/addProduct', wholeProductData);

      if (response?.data?.insertedId) {
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
                    Product Published!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    This Product is successfully added!
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
        localStorage.removeItem('productTitle');
        localStorage.removeItem('batchCode');
        localStorage.removeItem('weight');
        localStorage.removeItem('regularPrice');
        JSON.parse(localStorage.removeItem('uploadedImageUrls') || '[]');
        localStorage.removeItem('discountType');
        localStorage.removeItem('discountValue');
        localStorage.removeItem('productDetails');
        localStorage.removeItem('materialCare');
        localStorage.removeItem('sizeFit');
        localStorage.removeItem('category');
        JSON.parse(localStorage.removeItem('season') || '[]');
        JSON.parse(localStorage.removeItem('subCategories') || '[]');
        JSON.parse(localStorage.removeItem('groupOfSizes') || '[]');
        JSON.parse(localStorage.removeItem('allSizes') || '[]');
        JSON.parse(localStorage.removeItem('availableColors') || '[]');
        localStorage.removeItem('newArrival');
        JSON.parse(localStorage.removeItem('vendors') || '[]');
        JSON.parse(localStorage.removeItem('tags') || '[]');
        JSON.parse(localStorage.removeItem('productVariants') || '[]');
        localStorage.removeItem('formattedDate');
        localStorage.removeItem('productId');
        router.push("/dash-board/products/existing-products");
      }
    } catch (error) {
      console.error("Error response:", error.response || error.message);
      setIsSubmitting(false);
      toast.error('Failed to add Product Details. Please try again!');
    }
  };

  if (isShippingPending || isShipmentHandlerPending) {
    return <Loading />
  }

  return (
    <div className='min-h-screen'>

      <div className='max-w-screen-xl mx-auto sticky top-0 z-10'>
        <h3 className='text-left bg-white font-semibold text-xl md:text-2xl px-6 py-6'>Add Select Shipping Details</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-xl mx-auto mt-6 min-h-[85vh] flex flex-col justify-between'>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300">
                  <Checkbox
                    isSelected={selectAll}
                    onChange={toggleSelectAll}
                    color="success"
                    size='lg'
                  />
                </th>
                <th className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-base border-b border-gray-300">Shipping Zone</th>
                <th className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-base border-b border-gray-300">Shipment Handlers</th>
                <th className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-base border-b border-gray-300">Shipping Charges</th>
                <th className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-base border-b border-gray-300">Shipping Hours</th>
              </tr>
            </thead>
            <tbody>
              {shippingList?.map((shipping, index) => {
                const isSelected = selectedShipmentHandler.some(
                  (handler) => handler.shippingZone === shipping?.shippingZone
                );

                return (
                  <tr
                    key={index}
                    className={`cursor-pointer transition-all duration-200 ${isSelected ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    {/* Checkbox for selecting a row */}
                    <td className="text-center">
                      <Checkbox
                        isSelected={isSelected}
                        onChange={() => toggleCardSelection(shipping)}
                        color="success"
                        size='lg'
                      />
                    </td>

                    {/* Shipping Zone Title */}
                    <td className="text-xs md:text-base text-center font-bold text-gray-900">
                      {shipping?.shippingZone}
                    </td>

                    {/* Shipment Handlers */}
                    <td className="px-2 py-1 md:px-4 md:py-2">
                      <div className="flex items-center justify-center md:gap-4">
                        {shipmentHandlerList?.map((handler, handlerIndex) => (
                          shipping?.selectedShipmentHandler?.shipmentHandlerName === handler?.shipmentHandlerName && (
                            <div key={handlerIndex} className="p-4 rounded-lg flex flex-col items-center justify-center h-40 w-40">
                              {handler?.imageUrl && (
                                <Image
                                  src={handler.imageUrl}
                                  alt="shipping"
                                  width={100}
                                  height={100}
                                  className="mb-2 object-contain h-32 w-32"
                                />
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    </td>
                    <td className='text-center font-bold text-gray-900 text-xs md:text-base'>{shipping?.selectedShipmentHandler?.deliveryType.map((type, idx) => (
                      <div key={idx}>
                        {type}: ৳ {shipping?.shippingCharges[type]}
                      </div>
                    ))}</td>
                    <td className='text-center font-bold text-gray-900 text-xs md:text-base'>{shipping?.selectedShipmentHandler?.deliveryType.map((type, idx) => (
                      <div key={idx}>
                        {type}: {shipping?.shippingHours[type]} Hours
                      </div>
                    ))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Error message */}
        {sizeError && (
          <p className='text-red-600 text-left mt-4 max-w-screen-xl px-6'>Please select at least one shipping handler.</p>
        )}

        <div className='flex justify-between mt-6 px-6 2xl:px-0'>
          <Link href='/dash-board/products/add-product-2' className='flex items-center gap-2 mt-4 mb-8 bg-[#9F5216] hover:bg-[#804010] text-white py-2 px-4 rounded-md cursor-pointer font-medium'>
            <FaArrowLeft /> Previous Step
          </Link>

          <div className='flex items-center gap-6'>

            <button disabled={isSubmitting} type='submit' className={`bg-[#9F5216] hover:bg-[#804010] text-white py-2 px-4 flex items-center justify-center gap-2 rounded-md cursor-pointer font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 rounded-md cursor-pointer font-medium`}>
              {isSubmitting ? 'Publishing...' : 'Publish'} <MdOutlineFileUpload size={20} />
            </button>
          </div>

        </div>
      </form>

    </div>
  );
};

export default ThirdStepOfAddProduct;