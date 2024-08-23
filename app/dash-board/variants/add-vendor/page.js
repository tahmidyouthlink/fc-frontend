"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
import { useRouter } from 'next/navigation';

const AddVendor = () => {
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      vendor: [{ vendor: '' }]
    }
  });

  // Separate useFieldArray for vendors
  const { fields: vendorFields, append: appendVendor, remove: removeVendor } = useFieldArray({
    control,
    name: 'vendor'
  });

  const onSubmit = async (data) => {
    const vendorData = data.vendor.map(vendor => ({
      value: vendor.vendor,
      label: vendor.vendor
    }));

    try {
      const response = await axiosPublic.post('/addVendor', vendorData);
      if (response.status === 201) {
        toast.success('Vendors added successfully!');
        reset();
        router.push("/dash-board/variants")
      }
    } catch (error) {
      toast.error('Failed to add vendors. Please try again!');
    }
  };

  return (
    <div className='max-w-screen-lg mx-auto'>

      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Vendors</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="vendor-field w-full">
          <label className="flex justify-start font-medium text-[#9F5216]">Vendor</label>
          {vendorFields?.map((item, index) => (
            <div key={item.id} className="flex flex-col">
              <div className='w-full flex items-center gap-2'>
                <input
                  type="text"
                  placeholder="Add Vendor"
                  {...register(`vendor.${index}.vendor`, { required: 'Vendor is required' })}
                  className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                />
                <Button type='button' color="danger" onClick={() => removeVendor(index)} variant="light">
                  Remove
                </Button>
              </div>
              {errors.vendor?.[index]?.vendor && (
                <p className="text-red-600 text-left">{errors.vendor[index].vendor.message}</p>
              )}
            </div>
          ))}
          <button type="button" onClick={() => appendVendor({ vendor: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
            Add Vendor
          </button>
        </div>

        <div className='px-6 flex justify-end items-center'>
          <button type='submit' className='mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2'>Submit Vendors</button>
        </div>
      </form>

      <button className='hidden md:flex fixed top-2 right-2 hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1'>
        <Link href={"/dash-board/variants"}><RxCross2 size={28} /></Link>
      </button>

      <button className='md:hidden fixed bottom-2 right-2 hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1'>
        <Link href={"/dash-board/variants"}><RxCross2 size={28} /></Link>
      </button>

    </div>
  );
};

export default AddVendor;
