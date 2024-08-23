"use client";
import React from 'react';
import useColors from '@/app/hooks/useColors';
import useTags from '@/app/hooks/useTags';
import useVendors from '@/app/hooks/useVendors';
import Loading from '@/app/components/shared/Loading/Loading';
import { MdDeleteOutline } from "react-icons/md";
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import toast from 'react-hot-toast';

const Variants = () => {

  const [colorList, isColorPending, refetchColors] = useColors();
  const [tagList, isTagPending, refetchTags] = useTags();
  const [vendorList, isVendorPending, refetchVendors] = useVendors();
  const axiosPublic = useAxiosPublic();

  const handleDeleteColor = async (id) => {
    const res = await axiosPublic.delete(`/deleteColor/${id}`);
    if (res?.data?.deletedCount) {
      refetchColors();
      toast.success("Color has been deleted.")
    }
  }

  const handleDeleteVendor = async (id) => {
    const res = await axiosPublic.delete(`/deleteVendor/${id}`);
    if (res?.data?.deletedCount) {
      refetchVendors();
      toast.success("Vendor has been deleted.")
    }
  }

  const handleDeleteTag = async (id) => {
    const res = await axiosPublic.delete(`/deleteTag/${id}`);
    if (res?.data?.deletedCount) {
      refetchTags();
      toast.success("Tag has been deleted.")
    }
  }

  if (isColorPending || isTagPending || isVendorPending) {
    return <Loading />
  }

  return (
    <div className='min-h-screen w-full'>
      <div className='grid grid-cols-3 max-w-screen-2xl mx-auto'>

        <div className='w-full divide-y divide-gray-200 custom-max-h-variant modal-body-scroll'>
          <h1 className='py-2 md:py-3 font-semibold px-6 md:px-9 md:text-lg lg:text-xl sticky top-0 z-[1] shadow-md bg-gray-50 rounded-lg'>Colors</h1>
          <div className='flex flex-col items-center justify-center w-full divide-y divide-gray-200'>
            {colorList?.map((color, index) => (
              <div key={index} className='flex items-center justify-center w-full md:px-2 lg:px-6 hover:bg-gray-100 transition-colors  cursor-pointer'>
                <p className='flex text-[11px] md:text-[15px] items-center gap-0.5 md:gap-1 p-2 w-full'>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: color?.color || '#fff',
                      marginRight: '8px',
                      borderRadius: '4px'
                    }}
                  />
                  {color?.value}
                </p>
                <MdDeleteOutline onClick={() => handleDeleteColor(color?._id)} className='text-red-800 hover:text-red-950 text-2xl cursor-pointer' />
              </div>
            ))}
          </div>
        </div>

        <div className='w-full divide-y divide-gray-200 custom-max-h-variant modal-body-scroll'>
          <h1 className='py-2 md:py-3 font-semibold px-5 md:px-9 md:text-lg lg:text-xl sticky top-0 z-[1] shadow-md bg-gray-50 rounded-lg'>Vendors</h1>
          <div className='flex flex-col items-center justify-center w-full divide-y divide-gray-200'>
            {vendorList?.map((vendor, index) => (
              <div key={index} className='flex items-center justify-center w-full md:px-2 lg:px-6 hover:bg-gray-100 transition-colors cursor-pointer'>
                <p className='flex text-[11px] md:text-[15px] items-center gap-0.5 md:gap-1 p-2 w-full'>
                  {vendor?.value}
                </p>
                <MdDeleteOutline onClick={() => handleDeleteVendor(vendor?._id)} className='text-red-800 hover:text-red-950 text-2xl cursor-pointer' />
              </div>
            ))}
          </div>
        </div>

        <div className='w-full divide-y divide-gray-200 custom-max-h-variant modal-body-scroll'>
          <h1 className='py-2 md:py-3 font-semibold px-6 md:px-9 md:text-lg lg:text-xl sticky top-0 z-[1] shadow-md bg-gray-50 rounded-lg'>Tags</h1>
          <div className='flex flex-col items-center justify-center w-full divide-y divide-gray-200'>
            {tagList?.map((tag, index) => (
              <div key={index} className='flex items-center justify-center w-full md:px-2 lg:px-6 hover:bg-gray-100 transition-colors  cursor-pointer'>
                <p className='flex text-[11px] md:text-[15px] items-center gap-0.5 md:gap-1 p-2 w-full'>
                  {tag?.value}
                </p>
                <MdDeleteOutline onClick={() => handleDeleteTag(tag?._id)} className='text-red-800 hover:text-red-950 text-2xl cursor-pointer' />
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className='grid grid-cols-3 max-w-screen-2xl mx-auto'>
        <Button variant="light" color="primary">
          <Link href={"/dash-board/variants/add-color"}>Add Colors</Link>
        </Button>
        <Button variant="light" color="primary">
          <Link href={"/dash-board/variants/add-vendor"}>Add Vendors</Link>
        </Button>
        <Button variant="light" color="primary">
          <Link href={"/dash-board/variants/add-tag"}>Add Tags</Link>
        </Button>
      </div>
    </div>
  );
};

export default Variants;