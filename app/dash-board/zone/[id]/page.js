"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Select, SelectItem } from '@nextui-org/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { shippingServices } from '@/app/components/layout/shippingServices';
import { cities } from '@/app/components/layout/cities';
import Image from 'next/image';

export default function EditShippingZone() {
  const router = useRouter();
  const params = useParams();
  const axiosPublic = useAxiosPublic();
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState([]);
  const [sizeError, setSizeError] = useState(false);
  const [selectedCity, setSelectedCity] = useState([]);
  const [cityError, setCityError] = useState(false);

  const {
    register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm({
      defaultValues: {
        shippingZone: '',
        selectedCity: [],
        selectedShipmentHandler: [],
        shippingCharge: '',
      }
    });

  useEffect(() => {
    const fetchShippingZone = async () => {
      try {
        const { data } = await axiosPublic.get(`/getSingleShippingZone/${params.id}`);
        setValue('shippingZone', data?.shippingZone);
        setValue('shippingCharge', data?.shippingCharge);
        setSelectedCity(data?.selectedCity);
        setSelectedShipmentHandler(data?.selectedShipmentHandler);
      } catch (error) {
        toast.error("Failed to load shipping zone details.");
      }
    };

    fetchShippingZone();
  }, [params.id, setValue, axiosPublic]);

  console.log(selectedShipmentHandler);

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
    }
    // Remove the error message when an image is selected
    setSizeError(false);
  };

  const onSubmit = async (formData) => {

    // Validate shipment handler selection
    if (selectedShipmentHandler.length === 0) {
      setSizeError(true);
      return;
    }

    try {
      const updatedShippingZone = {
        shippingZone: formData.shippingZone,
        selectedCity: selectedCity,
        selectedShipmentHandler: selectedShipmentHandler,
        shippingCharge: formData.shippingCharge,
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

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-screen-lg mx-auto flex items-center pt-3 md:pt-6'>
        <h3 className='w-full text-center font-semibold text-xl lg:text-2xl'>Edit Shipping Zone</h3>
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
            {/* Shipping Charge Field */}
            <div className="shipping-charge-field w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Shipping Charge</label>
              <input
                type="number"
                placeholder="Enter Shipping Charge"
                {...register('shippingCharge', { required: 'Shipping Charge is required' })}
                className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
              />
              {/* Display error message for this field */}
              {errors.shippingCharge && (
                <p className="text-red-600 text-left mt-1 text-sm">{errors.shippingCharge.message}</p>
              )}
            </div>

            {/* Shipment Handlers */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                {shippingServices.map((shipmentHandler) => (
                  <div
                    key={shipmentHandler.name}
                    onClick={() => toggleLogoSelection(shipmentHandler.name)}
                    className={`cursor-pointer border-2 rounded-md p-2 ${selectedShipmentHandler.includes(shipmentHandler.name) ? 'border-blue-500' : 'border-gray-300'}`}
                  >
                    <Image src={shipmentHandler?.logoURL} alt={shipmentHandler.name} height={300} width={300} className="h-24 w-24 xl:h-32 xl:w-32 object-contain" />
                    <p className="text-center">{shipmentHandler.name}</p>
                  </div>
                ))}
                {/* Display error message if no shipment handler is selected */}
                {sizeError && <p className='text-red-600 text-left mt-1'>Please select at least one shipment handler.</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-between items-center'>
            <Link className='flex items-center gap-2 mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium' href={"/dash-board/zone/existing-zones"}> <FaArrowLeft /> Go Back</Link>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium`}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}