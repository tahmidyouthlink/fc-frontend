"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Select, SelectItem } from '@nextui-org/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { cities } from '@/app/components/layout/cities';
import Image from 'next/image';
import useShipmentHandlers from '@/app/hooks/useShipmentHandlers';
import Loading from '@/app/components/shared/Loading/Loading';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { FiSave } from 'react-icons/fi';

export default function EditShippingZone() {
  const router = useRouter();
  const params = useParams();
  const axiosPublic = useAxiosPublic();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState(null);
  const [shipmentHandlerList, isShipmentHandlerPending] = useShipmentHandlers();
  const [sizeError, setSizeError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityError, setCityError] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const suggestionsRefCity = useRef(null);

  const {
    register, handleSubmit, setValue, control, formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    const fetchShippingZone = async () => {
      try {
        const { data } = await axiosPublic.get(`/getSingleShippingZone/${params.id}`);

        setValue('shippingZone', data?.shippingZone);
        setSelectedCities(data?.selectedCity);
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

  // Filter cities based on the search term and exclude selected cities
  const filteredCities = cities.filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedCities.includes(city)
  );

  // Handle city selection
  const handleCitySelect = (city) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities([...selectedCities, city]);
    }
    setSearchTerm(""); // Clear input
    setShowCitySuggestions(false); // Close suggestions
    setCityError(false);
  };

  // Remove selected city
  const handleCityRemove = (index) => {
    const updatedCities = [...selectedCities];
    updatedCities.splice(index, 1);
    setSelectedCities(updatedCities);
  };

  // Select all cities
  const handleSelectAll = () => {
    setSelectedCities(cities);
    setCityError(false);
  };

  // Unselect all cities
  const handleUnselectAll = () => {
    setSelectedCities([]);
    setCityError(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setShowCitySuggestions(true);
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
    };

    if (selectedCities.length === 0) {
      setCityError(true);
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
        selectedCity: selectedCities
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

            {/* City Selection */}
            <div className='flex items-center justify-center gap-4'>

              <input
                type="text"
                placeholder="Search or select a city"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)} // Delay to allow selection
                className="p-2 border border-gray-300 rounded w-full flex-1"
              />

              {/* Select All Button */}
              {selectedCities?.length > 71 ? "" : <button
                type="button"
                onClick={handleSelectAll}
                className="relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[14px] text-neutral-700"
              >
                <MdCheckBox size={18} /> Select All
              </button>}

              {/* Unselect All Button */}
              {selectedCities?.length > 2 && <button
                type="button"
                onClick={handleUnselectAll}
                className="relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#d4ffce] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] font-bold text-[14px] text-neutral-700"
              >
                <MdCheckBoxOutlineBlank size={20} /> Unselect All
              </button>}

            </div>

            {/* Suggestions Dropdown */}
            {showCitySuggestions && (
              <div>
                {filteredCities?.length > 0 ?
                  <ul
                    ref={suggestionsRefCity}
                    className="w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto z-[9999]"
                  >
                    {filteredCities.map((city, i) => (
                      <li
                        key={i}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors duration-150"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul> : <p>No city matches your search.</p>
                }
              </div>
            )}

            {cityError && <p className='text-red-600 text-left'>City selection is required.</p>}

            {/* Selected Cities */}
            <div>
              {selectedCities?.length > 0 && <h3 className="mt-2 mb-2 font-semibold">Selected Cities</h3>}
              <div className='flex flex-wrap gap-3 mb-4'>
                {selectedCities.map((city, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 border border-gray-300 rounded-full py-1 px-3 text-sm text-gray-700"
                  >
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => handleCityRemove(index)}
                      className="ml-2 text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-150"
                    >
                      <RxCross2 size={19} />
                    </button>
                  </div>
                ))}
              </div>
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

          {/* Submit Button */}
          <div className='flex justify-end items-center'>

            <button
              type='submit'
              disabled={isSubmitting}
              className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#ffddc2] hover:bg-[#fbcfb0]'} relative z-[1] flex items-center gap-x-3 rounded-lg  px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out font-bold text-[14px] text-neutral-700 mt-4 mb-8`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'} <FiSave size={20} />
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}