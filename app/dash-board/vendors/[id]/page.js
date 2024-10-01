"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const EditVendor = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  const {
    register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
      defaultValues: {
        value: '',
        label: '',
        contactPersonNumber: '',
        vendorAddress: '',
        contactPersonName: ''
      }
    });

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/getSingleVendorDetails/${id}`);
        console.log(data);

        setValue('vendorName', data?.value);
        setValue('contactPersonName', data?.contactPersonName);
        setValue('contactPersonNumber', data?.contactPersonNumber);
        setValue('vendorAddress', data?.vendorAddress);
      } catch (error) {
        toast.error("Failed to load this vendor details.");
      }
    };

    fetchVendorDetails();
  }, [id, setValue, axiosPublic]);

  const onSubmit = async (data) => {
    try {

      const updatedVendorList = {
        value: data?.vendorName,
        label: data?.vendorName,
        contactPersonName: data?.contactPersonName,
        contactPersonNumber: data?.contactPersonNumber,
        officeAddress: data?.vendorAddress,
      };

      const res = await axiosPublic.put(`/editVendor/${id}`, updatedVendorList);
      if (res.data.modifiedCount > 0) {
        toast.success('Vendor updated successfully');
        router.push('/dash-board/vendors');
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing Vendor:', error);
      toast.error('There was an error editing the Vendor. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className='max-w-screen-lg mx-auto pt-3 md:pt-6 px-6'>
          <div className='flex items-center justify-between'>
            <h3 className='w-full font-semibold text-xl lg:text-2xl'>Edit Vendor Details</h3>
            <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/vendors"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
          </div>
        </div>

        <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            {/* Vendor name Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Vendor Name *</label>
              <input
                type="text"
                placeholder="Add Vendor Name"
                {...register('vendorName', { required: 'Vendor Name is required' })}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.vendorName && (
                <p className="text-red-600 text-left">{errors.vendorName.message}</p>
              )}
            </div>

            {/* Contact person name of the Vendor Input */}
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

            {/* Contact person number of the Vendor Input */}
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

            {/* Vendor Address of the Vendor Input */}
            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Vendor Address *</label>
              <input
                type="text"
                placeholder="Add Vendor Address"
                {...register('vendorAddress', { required: 'Vendor Address is required' })}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.vendorAddress && (
                <p className="text-red-600 text-left">{errors.vendorAddress.message}</p>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div className='flex justify-end items-center'>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditVendor;