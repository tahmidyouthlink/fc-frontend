"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useColors from '@/app/hooks/useColors';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { MdDeleteOutline } from 'react-icons/md';

const ColorsPage = () => {

  const [colorList, isColorPending, refetchColors] = useColors();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  const handleDeleteColor = (id) => {
    toast((t) => (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg w-80">
        <span className="mb-3 text-lg text-center">Are you sure you want to delete this color?</span>
        <div className="flex justify-between w-full">
          <button
            onClick={async () => {
              const res = await axiosPublic.delete(`/deleteColor/${id}`);
              if (res?.data?.deletedCount) {
                refetchColors();
                toast.success((t) => (
                  <span>
                    Color has been deleted.
                    <button onClick={() => toast.dismiss(t.id)} className="ml-2 text-blue-500 underline">
                      Dismiss
                    </button>
                  </span>
                ));
              } else {
                toast.error("Failed to delete the color.");
              }
              toast.dismiss(t.id); // Dismiss the confirmation toast
            }}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Dismiss the confirmation toast
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  if (isColorPending) {
    return <Loading />
  }


  return (
    <div className='relative'>
      <div className='sticky top-0 z-10 bg-white flex items-center justify-between px-6'>
        <h1 className='font-semibold text-center md:text-xl lg:text-2xl'>Color Management</h1>
        <Button onClick={() => router.push('/dash-board/colors/add-color')} className='mt-6 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
          New Color
        </Button>
      </div>

      <div className='w-full divide-y divide-gray-200 pt-2'>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center w-full divide-y divide-gray-200'>
          {colorList?.map((color, index) => (
            <div key={index} className='flex items-center justify-center w-full md:px-2 lg:px-6 hover:bg-gray-100 transition-colors  cursor-pointer'>
              <p className='flex text-[15px] items-center gap-0.5 md:gap-1 p-2 w-full'>
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
    </div>
  );
};

export default ColorsPage;