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
    register, handleSubmit, setValue, control, resetField, formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      shippingZone: '',
      selectedCity: [],
      shippingCharge: '',
      shippingChargeStandard: '',
      shippingChargeExpress: '',
    }
  });

  useEffect(() => {
    const fetchShippingZone = async () => {
      try {
        const { data } = await axiosPublic.get(`/getSingleShippingZone/${params.id}`);
        console.log(data);

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

  const toggleLogoSelection = (shipmentHandler) => {
    if (selectedShipmentHandler?._id === shipmentHandler._id) {
      setSelectedShipmentHandler(null);
    } else {
      setSelectedShipmentHandler(shipmentHandler);
      setSizeError(false); // Clear error when a handler is selected
    }
  };

  const onSubmit = async (formData) => {
    let hasError = false;

    // Validate shipment handler selection
    if (!selectedShipmentHandler) {
      setSizeError(true);
      hasError = true;
    }

    let shippingCharges = {};

    if (selectedShipmentHandler?.deliveryType.length === 1) {
      shippingCharges[selectedShipmentHandler.deliveryType[0]] = formData.shippingCharge;
    } else {
      if (selectedShipmentHandler?.deliveryType.includes('STANDARD')) {
        shippingCharges['STANDARD'] = formData.shippingChargeStandard;
      }
      if (selectedShipmentHandler?.deliveryType.includes('EXPRESS')) {
        shippingCharges['EXPRESS'] = formData.shippingChargeExpress;
      }
    }

    if (hasError) return; // Early return if there are validation errors

    try {
      const updatedShippingZone = {
        shippingZone: formData.shippingZone,
        selectedCity: selectedCity,
        selectedShipmentHandler: selectedShipmentHandler,
        shippingCharges,
      };

      const res = await axiosPublic.put(`/editShippingZone/${params.id}`, updatedShippingZone);
      if (res.data.modifiedCount > 0) {
        toast.success('Shipping Zone updated successfully');
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
                  key={shipmentHandler._id}  // Always use unique keys
                  onClick={() => toggleLogoSelection(shipmentHandler)}
                  className={`cursor-pointer border-2 rounded-md p-2 ${selectedShipmentHandler?._id === shipmentHandler._id ? 'border-blue-500' : 'border-gray-300'}`}
                >
                  {shipmentHandler?.imageUrl && <Image src={shipmentHandler?.imageUrl} alt="shipment" height={300} width={300} className="h-24 w-24 xl:h-32 xl:w-32 object-contain" />}
                  <p className="text-center">{shipmentHandler.shipmentHandlerName}</p>
                </div>
              ))}
              {/* Display error message if no shipment handler is selected */}
              {sizeError && <p className='text-red-600 text-left mt-1'>Please select at least one shipment handler.</p>}
            </div>

            {/* Shipping Charge Fields */}
            {selectedShipmentHandler && (
              <>
                {selectedShipmentHandler.deliveryType?.length === 1 && (
                  <div className="shipping-charge-field w-full">
                    <label className="flex justify-start font-medium text-[#9F5216] pb-2">
                      {selectedShipmentHandler.deliveryType[0]} Shipping Charge
                    </label>
                    <input
                      type="number"
                      placeholder={`Enter ${selectedShipmentHandler.deliveryType[0]} Shipping Charge`}
                      {...register('shippingCharge', { required: 'Shipping charge is required' })}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    />
                    {errors.shippingCharge && (
                      <p className="text-red-600 text-left">{errors.shippingCharge.message}</p>
                    )}
                  </div>
                )}

                {selectedShipmentHandler.deliveryType.length > 1 && (
                  <>
                    <div className="shipping-charge-field w-full">
                      <label className="flex justify-start font-medium text-[#9F5216] pb-2">STANDARD Shipping Charge</label>
                      <input
                        type="number"
                        placeholder="Enter STANDARD Shipping Charge"
                        {...register('shippingChargeStandard', { required: 'Shipping Charge Standard is required' })}
                        className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
                      />
                      {errors.shippingChargeStandard && (
                        <p className="text-red-600 text-left mt-1 text-sm">{errors.shippingChargeStandard.message}</p>
                      )}
                    </div>

                    <div className="shipping-charge-field w-full">
                      <label className="flex justify-start font-medium text-[#9F5216] pb-2">EXPRESS Shipping Charge</label>
                      <input
                        type="number"
                        placeholder="Enter EXPRESS Shipping Charge"
                        {...register('shippingChargeExpress', { required: 'Shipping Charge Express is required' })}
                        className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
                      />
                      {errors.shippingChargeExpress && (
                        <p className="text-red-600 text-left mt-1 text-sm">{errors.shippingChargeExpress.message}</p>
                      )}
                    </div>
                  </>
                )}

              </>
            )}
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