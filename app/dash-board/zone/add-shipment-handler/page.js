"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import standardImage from "../../../../public/logos/standard.png";
import expressImage from "../../../../public/logos/express.png";
import defaultImage from "../../../../public/logos/default-image.png";

const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const AddShipmentHandler = () => {

  const axiosPublic = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [deliveryType, setDeliveryType] = useState([]);
  const router = useRouter();
  const DEFAULT_IMAGE_URL = defaultImage;

  const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({
        src: URL.createObjectURL(file),
        file
      });
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const uploadImageToImgbb = async (image) => {
    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('key', apiKey);

    try {
      const response = await axiosPublic.post(apiURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.data && response.data.data.url) {
        return response.data.data.url; // Return the single image URL
      } else {
        toast.error('Failed to get image URL from response.');
      }
    } catch (error) {
      toast.error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
    }
    return null;
  };

  const handleDeliveryType = (option) => {
    let deliveryTypes;
    if (deliveryType.includes(option)) {
      deliveryTypes = deliveryType.filter(item => item !== option);
    } else {
      deliveryTypes = [...deliveryType, option];
    }
    setDeliveryType(deliveryTypes);
    setValue('deliveryType', deliveryTypes); // Update the form value
    trigger('deliveryType'); // Manually trigger validation
  };

  const onSubmit = async (data) => {

    setIsSubmitting(true);

    const { shipmentHandlerName, contactPersonName, contactPersonNumber, officeAddress } = data;

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageToImgbb(image);
      // If image upload fails, use default image URL
      if (!imageUrl) {
        toast.error('Image upload failed, using default image.');
        imageUrl = DEFAULT_IMAGE_URL; // Set to default image URL
      }
    } else {
      // If no image is uploaded, set to default image URL
      imageUrl = DEFAULT_IMAGE_URL; // Set to default image URL
    }

    const shipmentData = {
      shipmentHandlerName,
      contactPersonName,
      contactPersonNumber,
      officeAddress,
      imageUrl,
      deliveryType
    };

    try {
      const response = await axiosPublic.post('/addShipmentHandler', shipmentData);
      if (response?.data?.insertedId) {
        toast.success('Shipment Handler added successfully!');
        router.push("/dash-board/zone/add-shipping-zone");
      } else {
        throw new Error('Failed to add shipment handler');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add shipment handler. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='max-w-screen-lg mx-auto pt-3 md:pt-6 px-6'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Add Shipment Handler</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/zone/add-shipping-zone"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            {/* Shipment handler name Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Shipment Handler Name *</label>
              <input
                type="text"
                placeholder="Add Shipment Handler Name"
                {...register('shipmentHandlerName', { required: 'Shipment handler Name is required' })}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.shipmentHandlerName && (
                <p className="text-red-600 text-left">{errors.shipmentHandlerName.message}</p>
              )}
            </div>

            {/* Contact person name of the Shipment handler Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Contact Person Name *</label>
              <input
                type="text"
                placeholder="Add Contact Person Name"
                {...register('contactPersonName', { required: 'Contact Person Name is required' })}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.contactPersonName && (
                <p className="text-red-600 text-left">{errors.contactPersonName.message}</p>
              )}
            </div>

            {/* Contact person number of the Shipment handler Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Contact Person Number *</label>
              <input
                type="number"
                placeholder="Add Contact Person Number"
                {...register('contactPersonNumber', { required: 'Contact Person Number is required' })}
                className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.contactPersonNumber && (
                <p className="text-red-600 text-left">{errors.contactPersonNumber.message}</p>
              )}
            </div>

            {/* Office Address of the Shipment handler Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Office Address</label>
              <input
                type="text"
                placeholder="Add Office Address"
                {...register('officeAddress')}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
            </div>

            {/* Delivery type of the Shipment handler Input */}
            <div className="flex flex-col w-full gap-4">
              <label className="font-medium text-[#9F5216]">Select Delivery Type *</label>
              {/* Standard Option */}
              <div className='flex items-center gap-4'>
                <div
                  onClick={() => handleDeliveryType('STANDARD')}
                  className={`flex items-center gap-2 border rounded-lg px-6 cursor-pointer ${deliveryType.includes('STANDARD') ? 'border-2 bg-gray-50' : 'bg-white'
                    }`}
                >
                  <Image
                    className="object-contain h-12 w-12 rounded-lg"
                    src={standardImage}
                    alt="standard image"
                    height={400}
                    width={400}
                  />
                  <h1 className="font-bold">STANDARD</h1>
                </div>

                {/* Express Option */}
                <div
                  onClick={() => handleDeliveryType('EXPRESS')}
                  className={`flex items-center gap-2 border rounded-lg px-6 cursor-pointer ${deliveryType.includes('EXPRESS') ? 'border-2 bg-gray-50' : 'bg-white'
                    }`}
                >
                  <Image
                    className="object-contain h-12 w-12 rounded-lg"
                    src={expressImage}
                    alt="express image"
                    height={400}
                    width={400}
                  />
                  <h1 className="font-bold">EXPRESS</h1>
                </div>
              </div>
            </div>

            {/* Error Message of delivery type */}
            {errors.deliveryType && (
              <p className="text-red-500">Please Select at least One Delivery Type.</p>
            )}

            {/* Hidden Input for Validation */}
            <input
              type="hidden"
              {...register('deliveryType', { validate: (value) => value.length > 0 })}
            />

          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            <input
              id='imageUpload'
              type='file'
              className='hidden'
              onChange={handleImageChange}
            />
            <label
              htmlFor='imageUpload'
              className='mx-auto flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white cursor-pointer'
            >
              <MdOutlineFileUpload size={60} />
              <div className='space-y-1.5 text-center'>
                <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                  Upload Thumbnail
                </h5>
                <p className='text-sm text-gray-500'>
                  Photo Should be in PNG, JPEG or JPG format
                </p>
              </div>
            </label>

            {image && (
              <div className='relative'>
                <Image
                  src={image.src}
                  alt='Uploaded image'
                  height={100}
                  width={200}
                  className='w-1/2 mx-auto h-[350px] mt-8 rounded-md'
                />
                <button
                  onClick={handleImageRemove}
                  className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
                >
                  <RxCross2 size={24} />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
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
};

export default AddShipmentHandler;