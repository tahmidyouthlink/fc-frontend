"use client";
import { cities } from '@/app/components/layout/cities';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useShipmentHandlers from '@/app/hooks/useShipmentHandlers';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaPlusCircle } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdOutlineFileUpload } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';

const AddShippingZone = () => {
  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [shipmentHandlerList, isShipmentHandlerPending, refetch] = useShipmentHandlers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityError, setCityError] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const suggestionsRefCity = useRef(null);

  const { register, handleSubmit, resetField, formState: { errors } } = useForm();

  // Filter cities based on the search term and exclude selected cities
  const filteredCities = cities.filter(
    (city) =>
      city.toLowerCase().includes(searchTerm.toLowerCase()) &&
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

  // Function to handle selection (only one allowed)
  const toggleLogoSelection = (shipmentHandler) => {
    // If the same handler is clicked again, deselect it
    if (selectedShipmentHandler?._id === shipmentHandler._id) {
      setSelectedShipmentHandler(null);
    } else {
      // Replace the selection with the newly clicked handler
      setSelectedShipmentHandler(shipmentHandler);
      setSizeError(false); // Clear error when a handler is selected
    }
  };

  const handleEditShipmentHandler = (e, id) => {
    e.preventDefault();
    router.push(`/dash-board/zone/add-shipment-handler/${id}`)
  }

  const handleDeleteShipmentHandler = async (e, id) => {
    e.preventDefault(); // Prevent form submission
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.delete(`/deleteShipmentHandler/${id}`);
          if (res?.data?.deletedCount) {
            refetch();
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
                        Shipment Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Shipment Handler deleted successfully!
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
          }
        } catch (error) {
          toast.error('Failed to delete this shipment handler. Please try again!');
        }
      }
    });
  };

  // Reset shipping charge fields when the selected shipment handler changes
  useEffect(() => {
    if (selectedShipmentHandler) {
      if (selectedShipmentHandler.deliveryType.includes('STANDARD')) {
        resetField('shippingChargeSTANDARD');
      }
      if (selectedShipmentHandler.deliveryType.includes('EXPRESS')) {
        resetField('shippingChargeEXPRESS');
      }
    }
  }, [selectedShipmentHandler, resetField]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { shippingZone } = data;

    // Check if cities and shipping handlers are selected
    let hasError = false;

    if (!selectedShipmentHandler) {
      setSizeError(true);
      hasError = true;
    }

    if (selectedCities.length === 0) {
      setCityError(true);
      hasError = true;
    }

    // If there are errors, prevent submission
    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    // Prepare shipping charges and times objects
    let shippingCharges = {};
    let shippingDurations = {};

    // Handle single delivery type
    if (selectedShipmentHandler?.deliveryType.length === 1) {
      const deliveryType = selectedShipmentHandler.deliveryType[0];
      shippingCharges[deliveryType] = data.shippingCharge;
      shippingDurations[deliveryType] = data.shippingTime;
    }

    // Handle multiple delivery types (STANDARD and EXPRESS)
    if (selectedShipmentHandler?.deliveryType.length === 2) {
      if (selectedShipmentHandler.deliveryType.includes('STANDARD')) {
        shippingCharges['STANDARD'] = data.shippingChargeStandard;
        shippingDurations['STANDARD'] = data.shippingDaysStandard;
      }
      if (selectedShipmentHandler.deliveryType.includes('EXPRESS')) {
        shippingCharges['EXPRESS'] = data.shippingChargeExpress;
        shippingDurations['EXPRESS'] = data.shippingHourExpress;
      }
    }

    const shippingData = {
      shippingZone,
      selectedShipmentHandler,
      shippingCharges,
      shippingDurations,
      selectedCity: selectedCities
    };

    try {
      const response = await axiosPublic.post('/addShippingZone', shippingData);
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
                    Shipment Added!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Shipment added successfully!
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
  };

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='max-w-screen-xl mx-auto pt-3 md:pt-6 px-6'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-lg md:text-xl lg:text-3xl text-neutral-700'>Shipping Configuration</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/zone"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className='max-w-screen-xl mx-auto p-6 flex flex-col gap-4'>

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
            <div className='flex items-center justify-center gap-4'>

              <input
                type="text"
                placeholder="Search or select a city"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)} // Delay to allow selection
                className="p-2 border border-gray-300 w-full flex-1 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
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
                <MdCheckBoxOutlineBlank size={20} />  Unselect All
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

            {/* Shipping Handler Selection */}
            <h1 className='text-[#9F5216]'>Manage Shipment Handler</h1>
            <div className="flex overflow-x-auto custom-scrollbar pb-4 items-start justify-start gap-4">
              {shipmentHandlerList?.map((shipmentHandler) => (
                <div
                  key={shipmentHandler._id}
                  onClick={() => toggleLogoSelection(shipmentHandler)} // Click to select handler
                  className={`relative cursor-pointer border-2 rounded-md w-40 h-44 min-w-[120px] min-h-[170px]
        ${shipmentHandler?.imageUrl ? "p-2" : "p-8"} 
        ${selectedShipmentHandler?._id === shipmentHandler._id ? 'border-blue-500' : 'border-gray-300'}`}
                >
                  {/* Icons Section */}
                  <div className="absolute top-2 right-2 flex items-center justify-between space-x-2">
                    <div className="group relative">
                      <button>
                        <RiDeleteBinLine
                          onClick={(e) => handleDeleteShipmentHandler(e, shipmentHandler._id)}
                          size={22}
                          className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-105 hover:duration-200"
                        />
                      </button>
                      <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                        Delete
                      </span>
                    </div>

                    <div className="group relative">
                      <button>
                        <AiOutlineEdit
                          onClick={(e) => handleEditShipmentHandler(e, shipmentHandler._id)}
                          size={22}
                          className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-105 hover:duration-200"
                        />
                      </button>
                      <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                        Edit
                      </span>
                    </div>
                  </div>

                  {/* Shipment Handler Image */}
                  {shipmentHandler?.imageUrl && <Image src={shipmentHandler?.imageUrl} alt="shipment" height={600} width={600} className="h-32 w-32 object-contain" />}

                  {/* Shipment Handler Name */}
                  <p className="text-center">{shipmentHandler.shipmentHandlerName}</p>
                </div>
              ))}

              {/* Add New Shipment Handler Button */}
              <div>
                <Link
                  href="/dash-board/zone/add-shipment-handler"
                  className="relative w-36 h-44 min-w-[110px] min-h-[170px] px-14 xl:px-8 border-2 border-dashed border-gray-600 bg-white text-gray-600 font-extrabold rounded-lg shadow-lg flex flex-col items-center justify-center transition-all duration-300 group hover:bg-[#ffddc2] hover:text-gray-800 hover:border-transparent hover:shadow-xl gap-2"
                >
                  <FaPlusCircle className="transition-transform transform group-hover:scale-110 group-hover:text-gray-800 animate-pulse text-2xl" />
                  <span className='text-[13px] text-center'>New Shipment Handler</span>
                </Link>
              </div>
            </div>

            {sizeError && <p className='text-red-600 text-left'>Please select at least one shipment handler.</p>}

            {selectedShipmentHandler?.deliveryType.length === 1 && <div className="w-full mt-4">
              {/* Conditionally render shipping charge input fields based on deliveryType */}
              <div className='flex flex-col md:flex-row gap-6 items-center justify-between w-full'>
                <div className='w-full'>
                  <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                    {selectedShipmentHandler?.deliveryType[0]} Shipping Charge
                  </label>
                  <input
                    type="number"
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
                    placeholder={`Enter Shipping ${selectedShipmentHandler?.deliveryType[0] === "express" ? "hours" : "days"} for ${selectedShipmentHandler?.deliveryType[0]}`}
                    {...register('shippingTime', { required: `Shipping ${selectedShipmentHandler?.deliveryType[0] === "express" ? "Hour" : "Days"} is required` })}
                    className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    onKeyDown={(e) => {
                      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '-'];
                      if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
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
                      placeholder="Enter Shipping days for STANDARD"
                      {...register('shippingDaysStandard', { required: 'STANDARD Shipping days is required' })}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                      onKeyDown={(e) => {
                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '-'];
                        if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
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
                      placeholder="Add Shipping hour for EXPRESS"
                      {...register('shippingHourExpress', { required: 'EXPRESS Shipping hour is required' })}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                      onKeyDown={(e) => {
                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '-'];
                        if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
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
            <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#ffddc2] hover:bg-[#fbcfb0]'} relative z-[1] flex items-center gap-x-3 rounded-lg  px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out font-bold text-[14px] text-neutral-700 mt-4 mb-8`}>
              {isSubmitting ? 'Submitting...' : 'Submit'} <MdOutlineFileUpload size={20} />
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

export default AddShippingZone;