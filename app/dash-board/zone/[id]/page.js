"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Select, SelectItem } from '@nextui-org/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { cities } from '@/app/components/layout/cities';
import Image from 'next/image';
import useShipmentHandlers from '@/app/hooks/useShipmentHandlers';
import Loading from '@/app/components/shared/Loading/Loading';
import { RxCheck, RxCross2 } from 'react-icons/rx';

export default function EditShippingZone() {
  const router = useRouter();
  const params = useParams();
  const axiosPublic = useAxiosPublic();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState(null);
  const [shipmentHandlerList, isShipmentHandlerPending] = useShipmentHandlers();
  const [sizeError, setSizeError] = useState(false);
  const [selectedCity, setSelectedCity] = useState([]);
  const [cityError, setCityError] = useState(false);

  const {
    register, handleSubmit, setValue, control, formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    const fetchShippingZone = async () => {
      try {
        const { data } = await axiosPublic.get(`/getSingleShippingZone/${params.id}`);

        setValue('shippingZone', data?.shippingZone);
        setSelectedCity(data?.selectedCity);
        setSelectedShipmentHandler(data?.selectedShipmentHandler);

        // Set shipping charges based on delivery types
        if (data?.shippingCharges) {
          const deliveryTypes = data?.selectedShipmentHandler?.deliveryType;

          if (deliveryTypes) {
            if (deliveryTypes.length === 1) {
              // Only one delivery type, set the single shipping charge
              const deliveryType = deliveryTypes[0];
              setValue('shippingCharge', data.shippingCharges[deliveryType]);
            } else if (deliveryTypes.length > 1) {
              // Set values for both STANDARD and EXPRESS charges
              if (data.shippingCharges.STANDARD) {
                setValue('shippingChargeStandard', data.shippingCharges.STANDARD);
              }
              if (data.shippingCharges.EXPRESS) {
                setValue('shippingChargeExpress', data.shippingCharges.EXPRESS);
              }
            }
          }
        }

        // Set shipping durations based on delivery types
        if (data?.shippingDurations) {
          const deliveryTypes = data?.selectedShipmentHandler?.deliveryType;

          if (deliveryTypes) {
            if (deliveryTypes.length === 1) {
              // Only one delivery type, set the single shipping duration
              const deliveryType = deliveryTypes[0];
              setValue('shippingTime', data.shippingDurations[deliveryType]);
            } else if (deliveryTypes.length > 1) {
              // Set values for both STANDARD and EXPRESS durations
              if (data.shippingDurations.STANDARD) {
                setValue('shippingDaysStandard', data.shippingDurations.STANDARD);
              }
              if (data.shippingDurations.EXPRESS) {
                setValue('shippingHourExpress', data.shippingDurations.EXPRESS);
              }
            }
          }
        }

      } catch (error) {
        toast.error("Failed to load shipping zone details.");
      }
    };

    fetchShippingZone();
  }, [params.id, setValue, axiosPublic]);

  const handleSelectedCityArray = (keys) => {
    const selectedArray = [...keys];
    setSelectedCity(selectedArray);
    setCityError(selectedArray.length === 0);
  };

  // if needed then apply edit option for logo selection
  // const toggleLogoSelection = (shipmentHandler) => {
  //   if (selectedShipmentHandler?._id === shipmentHandler._id) {
  //     setSelectedShipmentHandler(null);
  //   } else {
  //     setSelectedShipmentHandler(shipmentHandler);
  //     setSizeError(false); // Clear error when a handler is selected
  //   }
  // };

  const onSubmit = async (formData) => {
    let hasError = false;

    // Validate shipment handler selection
    if (!selectedShipmentHandler) {
      setSizeError(true);
      hasError = true;
    }

    // Prepare shipping charges and times objects
    let shippingCharges = {};
    let shippingDurations = {};

    // Handle single delivery type
    if (selectedShipmentHandler?.deliveryType.length === 1) {
      const deliveryType = selectedShipmentHandler.deliveryType[0];
      shippingCharges[deliveryType] = formData.shippingCharge;
      shippingDurations[deliveryType] = formData.shippingTime;
    }

    // Handle multiple delivery types (STANDARD and EXPRESS)
    if (selectedShipmentHandler?.deliveryType.length === 2) {
      if (selectedShipmentHandler.deliveryType.includes('STANDARD')) {
        shippingCharges['STANDARD'] = formData.shippingChargeStandard;
        shippingDurations['STANDARD'] = formData.shippingDaysStandard;
      }
      if (selectedShipmentHandler.deliveryType.includes('EXPRESS')) {
        shippingCharges['EXPRESS'] = formData.shippingChargeExpress;
        shippingDurations['EXPRESS'] = formData.shippingHourExpress;
      }
    }

    if (hasError) return; // Early return if there are validation errors

    try {
      const updatedShippingZone = {
        shippingZone: formData.shippingZone,
        selectedShipmentHandler: selectedShipmentHandler,
        shippingCharges,
        shippingDurations,
        selectedCity: selectedCity
      };

      const res = await axiosPublic.put(`/editShippingZone/${params.id}`, updatedShippingZone);
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
                    Shipping Updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Shipping Zone updated successfully!
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
        router.push('/dash-board/zone/existing-zones');
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      toast.error('There was an error updating the shipping zone.');
    }
  };

  if (isShipmentHandlerPending) {
    return <Loading />;
  }

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='max-w-screen-lg mx-auto pt-3 md:pt-6 px-6'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Shipping Settings</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/zone/existing-zones"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

            {/* Shipping Zone Field */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Shipping Zone</label>
              <input
                type="text"
                disabled
                placeholder="Add Shipping Zone"
                {...register('shippingZone', { required: 'Shipping Zone is required' })}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.shippingZone && (
                <p className="text-red-600 text-left">{errors.shippingZone.message}</p>
              )}
            </div>

            {/* Selected City */}
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
                      value={selectedCity}
                      searchable
                      placeholder="Select cities"
                      selectedKeys={new Set(selectedCity)}
                      onSelectionChange={(keys) => {
                        handleSelectedCityArray(keys);
                        field.onChange([...keys]);
                      }}
                    >
                      {cities?.map((city) => (
                        <SelectItem key={city.key}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </Select>
                    {/* Display error message if no cities are selected */}
                    {cityError && (
                      <p className="text-red-600 text-left mt-1 text-sm">At least one city must be selected.</p>
                    )}
                  </div>
                )}
              />
            </div>

          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

            {/* Shipment Handlers */}
            <h1 className='text-[#9F5216]'>Select Shipment Handler</h1>
            <div className="flex flex-wrap items-center justify-start gap-4">
              {shipmentHandlerList?.map((shipmentHandler) => (
                <div
                  key={shipmentHandler?._id}  // Always use unique keys
                  // onClick={() => toggleLogoSelection(shipmentHandler)}
                  className={`cursor-pointer border-2 rounded-md p-2 ${selectedShipmentHandler?._id === shipmentHandler._id ? 'border-blue-500' : 'border-gray-300'}`}
                >
                  {shipmentHandler?.imageUrl && <Image src={shipmentHandler?.imageUrl} alt="shipment" height={300} width={300} className="h-24 w-24 xl:h-32 xl:w-32 object-contain" />}
                  <p className="text-center">{shipmentHandler?.shipmentHandlerName}</p>
                </div>
              ))}
              {/* Display error message if no shipment handler is selected */}
              {sizeError && <p className='text-red-600 text-left mt-1'>Please select at least one shipment handler.</p>}
            </div>

            {selectedShipmentHandler?.deliveryType.length === 1 && <div className="w-full mt-4">
              {/* Conditionally render shipping charge input fields based on deliveryType */}
              <div className='flex flex-col md:flex-row gap-6 items-center justify-between w-full'>
                <div className='w-full'>
                  <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                    {selectedShipmentHandler?.deliveryType[0]} Shipping Charge
                  </label>
                  <input
                    type="number"
                    disabled
                    placeholder={`Enter Shipping Charge for ${selectedShipmentHandler?.deliveryType[0]}`}
                    {...register('shippingCharge', { required: 'Shipping Charge is required' })}
                    className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                  />
                  {errors.shippingCharge && (
                    <p className="text-red-600 text-left">{errors?.shippingCharge?.message}</p>
                  )}
                </div>

                <div className='w-full'>
                  <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                    {selectedShipmentHandler?.deliveryType[0]} Shipping {selectedShipmentHandler?.deliveryType[0] === "express" ? "Hours" : "Days"}
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder={`Enter Shipping ${selectedShipmentHandler?.deliveryType[0] === "express" ? "hours" : "days"} for ${selectedShipmentHandler?.deliveryType[0]}`}
                    {...register('shippingTime', { required: `Shipping ${selectedShipmentHandler?.deliveryType[0] === "express" ? "Hour" : "Days"} is required` })}
                    className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                  />
                  {errors.shippingTime && (
                    <p className="text-red-600 text-left">{errors?.shippingTime?.message}</p>
                  )}
                </div>
              </div>
            </div>}

            {/* Shipping Charge Input */}
            {selectedShipmentHandler?.deliveryType?.length === 2 && <div className="w-full mt-4">
              {/* Conditionally render shipping charge input fields based on deliveryType */}

              <div className='flex flex-col items-center justify-center gap-4 w-full'>
                <div className='flex items-center w-full gap-4'>
                  <div className='w-full'>
                    {/* Input for STANDARD shipping charge */}
                    <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                      STANDARD Charge
                    </label>
                    <input
                      type="number"
                      disabled
                      placeholder="Enter Shipping Charge for STANDARD"
                      {...register('shippingChargeStandard', { required: 'STANDARD Shipping Charge is required' })}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    />
                    {errors.shippingChargeStandard && (
                      <p className="text-red-600 text-left">{errors?.shippingChargeStandard?.message}</p>
                    )}
                  </div>
                  <div className='w-full'>
                    {/* Input for STANDARD shipping charge */}
                    <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                      STANDARD Days
                    </label>
                    <input
                      type="text"
                      disabled
                      placeholder="Enter Shipping days for STANDARD"
                      {...register('shippingDaysStandard', { required: 'STANDARD Shipping days is required' })}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    />
                    {errors.shippingDaysStandard && (
                      <p className="text-red-600 text-left">{errors?.shippingDaysStandard?.message}</p>
                    )}
                  </div>
                </div>

                <div className='flex items-center w-full gap-4'>
                  <div className='w-full'>
                    {/* Input for EXPRESS shipping charge */}
                    <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                      EXPRESS Charge
                    </label>
                    <input
                      type="number"
                      disabled
                      placeholder="Add Shipping Charge for EXPRESS"
                      {...register('shippingChargeExpress', { required: 'EXPRESS Shipping Charge is required' })}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    />
                    {errors.shippingChargeExpress && (
                      <p className="text-red-600 text-left">{errors?.shippingChargeExpress?.message}</p>
                    )}
                  </div>
                  <div className='w-full'>
                    {/* Input for EXPRESS shipping charge */}
                    <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                      EXPRESS Hours
                    </label>
                    <input
                      type="text"
                      disabled
                      placeholder="Add Shipping hour for EXPRESS"
                      {...register('shippingHourExpress', { required: 'EXPRESS Shipping hour is required' })}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    />
                    {errors.shippingHourExpress && (
                      <p className="text-red-600 text-left">{errors?.shippingHourExpress?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>}

          </div>

          <div className='flex justify-end items-center'>

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
}