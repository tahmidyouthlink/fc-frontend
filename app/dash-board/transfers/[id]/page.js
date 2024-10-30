"use client";
import Progressbar from '@/app/components/layout/Progressbar';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { BsFiletypePdf } from "react-icons/bs";

const EditTransferOrder = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const { handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [estimatedArrival, setEstimatedArrival] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [transferOrderVariants, setTransferOrderVariants] = useState([]);
  const [transferOrderStatus, setTransferOrderStatus] = useState("");
  const [transferOrderNumber, setTransferOrderNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");  // Initial value for discount
  const [supplierNote, setSupplierNote] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Format date to yyyy-mm-dd for date input field
  const formatDateForInput = (dateStr) => {
    const date = new Date(dateStr);
    const day = (`0${date.getDate()}`).slice(-2);
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Memoized function to fetch transfer order data
  const fetchTransferOrderData = useCallback(async () => {
    try {
      const response = await axiosPublic.get(`/getSingleTransferOrder/${id}`);
      const order = response?.data;
      const fetchedEstimatedArrival = formatDateForInput(order?.estimatedArrival);
      setEstimatedArrival(fetchedEstimatedArrival);
      setSelectedOrigin(order?.origin);
      setSelectedDestination(order?.destination);
      setSelectedProducts(order?.selectedProducts);
      setTransferOrderVariants(order?.transferOrderVariants);
      setTransferOrderStatus(order?.status);
      setTransferOrderNumber(order?.transferOrderNumber);
      setReferenceNumber(order?.referenceNumber);
      setSupplierNote(order?.supplierNote);
      setShippingCarrier(order?.shippingCarrier);
      setTrackingNumber(order?.trackingNumber);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transfer order details!");
    }
  }, [id, axiosPublic]);

  // Initial load useEffect
  useEffect(() => {
    fetchTransferOrderData();
  }, [fetchTransferOrderData]);

  const totalAcceptRejectValues = useMemo(() =>
    transferOrderVariants?.reduce(
      ({ totalQuantity, totalAccept, totalReject }, { quantity = 0, accept = 0, reject = 0 }) => ({
        totalQuantity: totalQuantity + quantity,
        totalAccept: totalAccept + accept,
        totalReject: totalReject + reject,
      }),
      { totalQuantity: 0, totalAccept: 0, totalReject: 0 }
    ),
    [transferOrderVariants]
  );

  const onSubmit = async (data) => {

    if (data?.status === "received") {
      router.push(`/dash-board/transfers/receive-transfer/${id}`);
      return;
    }

    try {
      const updatedTransferOrderData = {
        origin: selectedOrigin,
        destination: selectedDestination,
        transferOrderVariants,
        transferOrderNumber,
        selectedProducts,
        estimatedArrival,
        referenceNumber,
        supplierNote,
        shippingCarrier,
        trackingNumber,
        status: data?.status,
      }

      const res = await axiosPublic.put(`/editTransferOrder/${id}`, updatedTransferOrderData);
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
                    Transfer order canceled!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Purchase order has been canceled successfully!
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
        fetchTransferOrderData();
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing offer:', error);
      toast.error('Failed to update offer. Please try again!');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='bg-gray-100 min-h-screen px-6'>

      <div className='max-w-screen-xl mx-auto pt-3 md:pt-6'>
        <div className='flex flex-wrap md:flex-nowrap items-center justify-between w-full'>
          <h3 className='w-full font-semibold text-base md:text-xl lg:text-2xl'>#{transferOrderNumber} <span>{transferOrderStatus}</span></h3>
          <div className='flex justify-between md:justify-end gap-4 items-center w-full'>
            <div>
              <button className='flex justify-end gap-2 items-center bg-[#D2016E] hover:bg-[#d2016daf] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold'><span>Export</span><BsFiletypePdf size={16} /></button>
            </div>
            <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end' href={"/dash-board/transfers"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className='max-w-screen-xl mx-auto py-6 flex flex-col gap-4'>

          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            <div className='flex-1 space-y-3'>
              <h1 className='font-medium'>Origin</h1>
              {selectedOrigin && (
                <div className='space-y-3'>
                  <p className='font-semibold'>{selectedOrigin?.locationName}</p>
                  <p className="text-neutral-500 font-medium">
                    {selectedOrigin?.locationAddress}, {selectedOrigin?.cityName}, {selectedOrigin?.postalCode}
                  </p>
                </div>
              )}
            </div>

            <div className='flex-1 space-y-3'>
              <h1 className='font-medium'>Destination</h1>
              {selectedDestination && (
                <div className='space-y-3'>
                  <p className='font-semibold'>{selectedDestination?.locationName}</p>
                  <p className="text-neutral-500 font-medium">
                    {selectedDestination?.locationAddress}, {selectedDestination?.cityName}, {selectedDestination?.postalCode}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className='bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            <div className='flex justify-between items-center gap-6'>
              <h1 className='flex-1 font-bold text-lg'>Ordered products</h1>
              <div className='flex flex-col flex-1'>
                <Progressbar
                  accepted={totalAcceptRejectValues.totalAccept}
                  rejected={totalAcceptRejectValues.totalReject}
                  total={totalAcceptRejectValues.totalQuantity}
                />
                <div className="mt-1">
                  {totalAcceptRejectValues.totalAccept} of {totalAcceptRejectValues.totalQuantity}
                </div>
              </div>
            </div>

            {selectedProducts?.length > 0 &&
              <div className="max-w-screen-2xl mx-auto overflow-x-auto custom-scrollbar relative pt-4">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-[1] bg-white">
                    <tr>
                      <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b">
                        Products
                      </th>
                      <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-right">
                        Received
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProducts?.map((product, index) => {

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="text-sm p-3 text-neutral-500 text-center cursor-pointer flex flex-col lg:flex-row items-center gap-3">
                            <div>
                              <Image className='h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5' src={product?.imageUrl} alt='productIMG' height={600} width={600} />
                            </div>
                            <div className='flex flex-col items-start justify-start gap-1'>
                              <p className='font-bold text-blue-700 text-start'>{product?.productTitle}</p>
                              <p className='font-medium'>{product?.size}</p>
                              <span className='flex items-center gap-2'>
                                {product.name}
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: product.color || '#fff',
                                    marginRight: '8px',
                                    borderRadius: '4px'
                                  }}
                                />
                              </span>
                            </div>
                          </td>
                          <td className="text-sm p-3 text-neutral-500 font-semibold">
                            <div className='flex flex-col justify-center items-end'>
                              <div className='w-full'>
                                <Progressbar
                                  accepted={transferOrderVariants[index]?.accept || 0}
                                  rejected={transferOrderVariants[index]?.reject || 0}
                                  total={transferOrderVariants[index]?.quantity}
                                />
                                <div className="mt-1">
                                  {transferOrderVariants[index]?.accept || 0} of {transferOrderVariants[index]?.quantity}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            }
            {selectedProducts?.length > 0 && <p className='px-4 pt-4 text-neutral-500 font-medium'>{selectedProducts?.length} variants on transfer order</p>}

          </div>

          <div className='flex flex-col lg:flex-row w-full justify-between items-start gap-6'>

            <div className='w-full flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg min-h-[270px]'>
              <h1 className='font-semibold'>Shipment Details</h1>

              <div className='flex-1'>
                <label htmlFor='estimatedArrival' className='flex justify-start font-medium text-neutral-800 pb-2'>Estimated Arrival</label>
                <p className='font-semibold'>{estimatedArrival}</p>
              </div>
              <div>
                <label htmlFor='shippingCarrier' className='flex justify-start font-medium text-neutral-500 pb-2'>Shipping carrier</label>
                <p className='text-neutral-500'>{shippingCarrier === "" ? "--" : shippingCarrier}</p>
              </div>
              <div>
                <label htmlFor='trackingNumber' className='flex justify-start font-medium text-neutral-500 pb-2'>Tracking Number</label>
                <p className='text-neutral-500'>{trackingNumber === "" ? "--" : trackingNumber}</p>
              </div>

            </div>

            <div className='w-full flex flex-col justify-between gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg min-h-[295px]'>
              <h1 className='font-semibold'>Additional Details</h1>
              <div>
                <label htmlFor='referenceNumber' className='flex justify-start font-medium text-neutral-500 pb-2'>Reference Number</label>
                <p className='text-neutral-500'>{referenceNumber === "" ? "--" : referenceNumber}</p>
              </div>
              <div>
                <label htmlFor='supplierNote' className='flex justify-start font-medium text-neutral-500 pb-2'>Note to supplier</label>
                <p className='text-neutral-500'>{supplierNote === "" ? "--" : supplierNote}</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {transferOrderStatus === "pending" && <div className='flex justify-between items-center'>
            <button
              onClick={handleSubmit(async (formData) => {
                // Call onSubmit and wait for the result
                await onSubmit({ ...formData, status: "canceled" }); // Pass status as "canceled"
              })}
              type='submit'
              className={`bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold`}
            >
              Cancel transfer
            </button>
            <button
              type='submit'
              onClick={handleSubmit(async (formData) => {
                // Call onSubmit and wait for the result
                await onSubmit({ ...formData, status: "received" }); // Pass status as "canceled"
              })}
              className={`mt-4 mb-8 bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold`}
            >
              Receive transfer
            </button>
          </div>}
        </div>

      </form>

    </div>
  );
};

export default EditTransferOrder;