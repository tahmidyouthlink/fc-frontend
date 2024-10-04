"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import standardImage from "../../../../../public/logos/standard.png";
import expressImage from "../../../../../public/logos/express.png";
import defaultImage from "../../../../../public/logos/default-image.png";

const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const EditShipmentHandler = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const [image, setImage] = useState(null);
  const [shipmentDetails, setShipmentDetails] = useState([]);
  const [deliveryType, setDeliveryType] = useState([]);
  const router = useRouter();
  const DEFAULT_IMAGE_URL = defaultImage;

  const {
    register, handleSubmit, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
      defaultValues: {
        shipmentHandlerName: '',
        contactPersonName: '',
        contactPersonNumber: '',
        officeAddress: '',
        imageUrl: '',
        deliveryType: []
      }
    });

  useEffect(() => {
    const fetchShipmentHandler = async () => {
      try {
        const { data } = await axiosPublic.get(`/getSingleShipmentHandler/${id}`);
        setValue('shipmentHandlerName', data?.shipmentHandlerName);
        setValue('contactPersonName', data?.contactPersonName);
        setValue('contactPersonNumber', data?.contactPersonNumber);
        setValue('officeAddress', data?.officeAddress);
        setDeliveryType(data?.deliveryType || []);
        setValue('deliveryType', data?.deliveryType || []);
        setImage(data?.imageUrl);
        setShipmentDetails(data);
      } catch (error) {
        toast.error("Failed to load shipping zone details.");
      }
    };

    fetchShipmentHandler();
  }, [id, setValue, axiosPublic]);

  const handleDeliveryType = (option) => {
    let deliveryTypes;
    if (deliveryType?.includes(option)) {
      deliveryTypes = deliveryType?.filter(item => item !== option);
    } else {
      deliveryTypes = [...deliveryType, option];
    }
    setDeliveryType(deliveryTypes);
    setValue('deliveryType', deliveryTypes); // Update the form value
    trigger('deliveryType'); // Manually trigger validation
    console.log('Updated selected options:', deliveryTypes);
  };

  const uploadToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.data && data.data.url) {
        return data.data.url; // Imgbb URL of the uploaded image
      } else {
        console.error('Error uploading image:', data);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Immediately upload the selected image to Imgbb
      const uploadedImageUrl = await uploadToImgbb(file);

      if (uploadedImageUrl) {
        // Update the state with the Imgbb URL instead of the local blob URL
        setImage({
          src: uploadedImageUrl,
          file: file,
        });
      }
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    document.getElementById('imageUpload').value = ''; // Clear the file input
  };

  const onSubmit = async (data) => {
    try {

      // Initialize imageUrl with the existing one
      let imageUrl = shipmentDetails?.imageUrl || '';

      // If a new image is uploaded, upload it to Imgbb
      if (image && image.file) {
        imageUrl = await uploadToImgbb(image.file);
        if (!imageUrl) {
          toast.error('Image upload failed, cannot proceed.');
          imageUrl = DEFAULT_IMAGE_URL;
          hasError = true;
        }
      } else if (image === null) {
        // If the image is removed, explicitly set imageUrl to an empty string
        imageUrl = DEFAULT_IMAGE_URL;
      }

      const updatedShipmentHandler = {
        shipmentHandlerName: data?.shipmentHandlerName,
        contactPersonName: data?.contactPersonName,
        contactPersonNumber: data?.contactPersonNumber,
        officeAddress: data?.officeAddress,
        imageUrl,
        deliveryType
      };

      const res = await axiosPublic.put(`/editShipmentHandler/${id}`, updatedShipmentHandler);
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
                    Shipment Updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Shipment Handler updated successfully!
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
        router.push('/dash-board/zone/add-shipping-zone');
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing shipment handler:', error);
      toast.error('There was an error editing the shipment handler. Please try again.');
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='max-w-screen-lg mx-auto pt-3 md:pt-6 px-6'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Edit Shipment Handler</h3>
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
                  className={`flex items-center gap-2 border rounded-lg px-6 cursor-pointer ${deliveryType?.includes('STANDARD') ? 'border-[#ffddc2] bg-[#ffddc2]' : 'bg-white'
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
                  className={`flex items-center gap-2 border rounded-lg px-6 cursor-pointer ${deliveryType?.includes('EXPRESS') ? 'border-[#ffddc2] bg-[#ffddc2]' : 'bg-white'
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
                  Photo Should be in PNG, JPEG, JPG, WEBP or Avif format
                </p>
              </div>
            </label>

            {image && (
              <div className='relative'>
                <Image
                  src={typeof image === 'string' ? image : image.src}
                  alt='Uploaded image'
                  height={2000}
                  width={2000}
                  className='w-1/2 mx-auto h-[350px] mt-8 rounded-lg object-contain'
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

          <div className='flex justify-end items-center'>
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
};

export default EditShipmentHandler;