"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const EditReceiveInventory = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");

  useEffect(() => {
    const fetchPurchaseOrderData = async () => {
      try {
        const response = await axiosPublic.get(`/getSinglePurchaseOrder/${id}`);
        const order = response?.data;

        // // Ensure the expiry date is set to midnight to avoid timezone issues
        // const fetchedEstimatedArrival = formatDateForInput(order.estimatedArrival);
        // setEstimatedArrival(fetchedEstimatedArrival); // Ensure no time zone shift
        // setSelectedVendor(order?.supplier);
        // setSelectedLocation(order?.destination);
        // setPaymentTerms(order?.paymentTerms);
        // setValue('shipping', order?.shippingCharge);
        // setValue('discount', order?.discountCharge);
        // setValue('referenceNumber', order?.referenceNumber);
        // setValue('supplierNote', order?.supplierNote);
        // setShipping(order?.shippingCharge);
        // setDiscount(order?.discountCharge);
        // setSelectedTags(order?.tags);
        // setSelectedProducts(order?.selectedProducts);
        // setPurchaseOrderVariants(order?.purchaseOrderVariants);
        // setPurchaseOrderStatus(order?.status);
        setPurchaseOrderNumber(order?.purchaseOrderNumber)

        setIsLoading(false);
      } catch (err) {
        console.error(err); // Log error to the console for debugging
        toast.error("Failed to fetch purchase order details!");
      }
    };

    fetchPurchaseOrderData();
  }, [id, axiosPublic, setValue]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='bg-gray-100 min-h-screen px-6'>

      <div className='max-w-screen-xl mx-auto pt-3 md:pt-6'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex flex-col w-full'>
            <h3 className='w-full font-semibold text-base md:text-xl lg:text-2xl'>Receive items</h3>
            <span className='text-neutral-500 text-sm'>#{purchaseOrderNumber}</span>
          </div>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={`/dash-board/purchase-orders/${id}`}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>



    </div>
  );
};

export default EditReceiveInventory;