"use client";
import { cities } from '@/app/components/layout/cities';
import { shippingServices } from '@/app/components/layout/shippingServices';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const AddShippingZone = () => {
  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState([]);
  const [sizeError, setSizeError] = useState(false);
  const [selectedCity, setSelectedCity] = useState([]);
  const [cityError, setCityError] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const handleSelectedCityArray = (keys) => {
    const selectedArray = [...keys];
    setSelectedCity(selectedArray);
    setCityError(selectedArray.length === 0);
  };

  const toggleLogoSelection = (key) => {
    if (selectedShipmentHandler.includes(key)) {
      setSelectedShipmentHandler(selectedShipmentHandler.filter((selectedKey) => selectedKey !== key));
    } else {
      setSelectedShipmentHandler([...selectedShipmentHandler, key]);
      if (sizeError) {
        setSizeError(false);  // Clear the error when a logo is selected
      }
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
            <div className="flex flex-wrap items-center justify-center mt-4 gap-4">
              {shippingServices.map((shipmentHandler) => (
                <div
                  key={shipmentHandler.name}
                  onClick={() => toggleLogoSelection(shipmentHandler.name)}
                  className={`cursor-pointer border-2 rounded-md p-2 ${selectedShipmentHandler.includes(shipmentHandler.name) ? 'border-blue-500' : 'border-gray-300'
                    }`}
                >
                  <Image src={shipmentHandler?.logoURL} alt={shipmentHandler.name} height={300} width={300} className="h-32 w-32 object-contain" />
                  <p className="text-center">{shipmentHandler.name}</p>
                </div>
              ))}
              {sizeError && <p className='text-red-600 text-left'>Please select at least one image.</p>}
            </div>

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