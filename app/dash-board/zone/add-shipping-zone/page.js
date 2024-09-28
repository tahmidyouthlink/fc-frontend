"use client";
import { cities } from '@/app/components/layout/cities';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useShipmentHandlers from '@/app/hooks/useShipmentHandlers';
import { Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlusCircle } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';

const AddShippingZone = () => {
  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState([]);
  const [sizeError, setSizeError] = useState(false);
  const [selectedCity, setSelectedCity] = useState([]);
  const [cityError, setCityError] = useState(false);
  const [shipmentHandlerList, isShipmentHandlerPending, refetch] = useShipmentHandlers();

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const handleSelectedCityArray = (keys) => {
    const selectedArray = [...keys];
    setSelectedCity(selectedArray);
    setCityError(selectedArray.length === 0);
  };

  const toggleLogoSelection = (shipmentHandler) => {
    // Check if the handler is already selected
    if (selectedShipmentHandler.some(handler => handler._id === shipmentHandler._id)) {
      // Remove the handler if it's already selected
      setSelectedShipmentHandler(selectedShipmentHandler.filter((selectedHandler) => selectedHandler._id !== shipmentHandler._id));
    } else {
      // Add the new handler if it's not selected
      setSelectedShipmentHandler([...selectedShipmentHandler, shipmentHandler]);

      // Clear the error if a handler is selected
      if (sizeError) {
        setSizeError(false);
      }
    }
  };

  const handleEditShipmentHandler = (e, id) => {
    e.preventDefault();
    router.push(`/dash-board/zone/add-shipping-zone/${id}`)
  }

  const handleDeleteShipmentHandler = async (e, id) => {
    e.preventDefault(); // Prevent form submission
    try {
      const res = await axiosPublic.delete(`/deleteShipmentHandler/${id}`);
      if (res?.data?.deletedCount) {
        refetch();
        toast.success('Shipment Handler Deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete this shipment handler. Please try again!');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { shippingZone, shippingCharge } = data;

    // Check if cities and shipping handlers are selected
    let hasError = false;

    if (selectedShipmentHandler.length === 0) {
      setSizeError(true);
      hasError = true;
    }

    if (selectedCity.length === 0) {
      setCityError(true);
      hasError = true;
    }

    // If there are errors, prevent submission
    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    const shippingData = {
      shippingZone,
      shippingCharge,
      selectedShipmentHandler,
      selectedCity
    };

    try {
      const response = await axiosPublic.post('/addShippingZone', shippingData);
      if (response?.data?.insertedId) {
        toast.success('Shipping Zone added successfully!');
        router.push("/dash-board/zone/existing-zones");
      } else {
        throw new Error('Failed to add shipping zone');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add shipping zone. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isShipmentHandlerPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='max-w-screen-lg mx-auto flex items-center pt-3 md:pt-6'>
        <h3 className='w-full text-center font-semibold text-xl lg:text-2xl'>Add Shipping Zone</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            {/* Shipping Zone Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Shipping Zone</label>
              <input
                type="text"
                placeholder="Add Shipping Zone"
                {...register('shippingZone', { required: 'Shipping Zone is required' })}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.shippingZone && (
                <p className="text-red-600 text-left">{errors.shippingZone.message}</p>
              )}
            </div>

            {/* City Selection */}
            <div>
              <Controller
                name="cities"
                control={control}
                defaultValue={selectedCity}
                render={({ field }) => (
                  <div>
                    <Select
                      label="Select Cities"
                      selectionMode="multiple"
                      searchable
                      placeholder="Select cities"
                      selectedKeys={new Set(selectedCity)}
                      onSelectionChange={(keys) => {
                        handleSelectedCityArray(keys);
                        field.onChange([...keys]);
                      }}
                    >
                      {cities.map((city) => (
                        <SelectItem key={city.key}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </Select>
                    {cityError && <p className="text-red-600 text-left">Cities are required.</p>}
                  </div>
                )}
              />
            </div>

          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

            {/* Shipping Charge Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Shipping Charge</label>
              <input
                type="number"
                placeholder="Add Shipping Charge"
                {...register('shippingCharge', { required: 'Shipping Charge is required' })}
                className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.shippingCharge && (
                <p className="text-red-600 text-left">{errors.shippingCharge.message}</p>
              )}
            </div>

            {/* Shipping Handler Selection */}
            <h1 className='text-[#9F5216] mt-4'>Add, Edit or Select Shipment Handler</h1>
            <div className="flex flex-wrap items-center justify-start gap-4">
              {shipmentHandlerList?.map((shipmentHandler) => (
                <div
                  key={shipmentHandler._id}
                  onClick={() => toggleLogoSelection(shipmentHandler)}  // Click on card to select/deselect
                  className={`relative cursor-pointer border-2 rounded-md ${shipmentHandler?.imageUrl ? "p-2" : "p-8"} ${selectedShipmentHandler.some((handler) => handler._id === shipmentHandler._id) ? 'border-blue-500' : 'border-gray-300'
                    }`}
                >
                  {/* Icons Section */}
                  <div className="absolute top-2 right-2 flex items-center justify-between space-x-2">

                    <div className="group relative">
                      <button>
                        <RiDeleteBinLine
                          onClick={(e) => handleDeleteShipmentHandler(e, shipmentHandler._id)}
                          size={22}
                          className={`text-red-500 hover:text-red-700 transition-transform transform hover:scale-105 hover:duration-200`}
                        />
                      </button>
                      {<span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                        Delete
                      </span>}
                    </div>

                    <div className="group relative">
                      <button>
                        <MdOutlineModeEdit
                          onClick={(e) => handleEditShipmentHandler(e, shipmentHandler._id)}
                          size={22}
                          className={`text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-105 hover:duration-200`}
                        />
                      </button>
                      {<span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                        Edit
                      </span>}
                    </div>

                  </div>

                  {/* Shipment Handler Image */}
                  {shipmentHandler?.imageUrl && <Image src={shipmentHandler?.imageUrl} alt="shipment" height={300} width={300} className="h-32 w-32 object-contain" />}

                  {/* Shipment Handler Name */}
                  <p className="text-center">{shipmentHandler.shipmentHandlerName}</p>
                </div>
              ))}

              <div>
                <Link
                  href="/dash-board/zone/add-shipment-handler"
                  className="relative w-full h-40 px-14 xl:px-8 border-2 border-dashed border-gray-600 bg-white text-gray-600 font-extrabold rounded-lg shadow-lg flex items-center justify-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 group hover:bg-[#ffddc2] hover:text-gray-800 hover:border-transparent hover:shadow-xl"
                >
                  <FaPlusCircle className="transition-transform transform group-hover:scale-110 group-hover:text-gray-800 animate-pulse text-3xl" />
                </Link>
              </div>
            </div>
            {sizeError && <p className='text-red-600 text-left'>Please select at least one shipment handler.</p>}

          </div>

          {/* Submit Button */}
          <div className='flex justify-between items-center'>

            <Link className='flex items-center gap-2 mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium' href={"/dash-board/zone"}> <FaArrowLeft /> Go Back</Link>

            <button
              type='submit'
              disabled={isSubmitting}
              className={`mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddShippingZone;