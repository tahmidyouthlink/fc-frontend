"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlus } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { MdOutlineFileUpload } from 'react-icons/md';
import ProtectedRoute from '@/app/components/ProtectedRoutes/ProtectedRoute';

const AddTag = () => {
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      tag: [{ tag: '' }]
    }
  });

  // Separate useFieldArray for tags
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tag'
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const tagData = data.tag.map(tag => ({
      value: tag.tag,
      label: tag.tag
    }));

    try {
      const response = await axiosPublic.post('/addTag', tagData);
      if (response.status === 201) {
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
                    New Tag Added!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Tag has been added successfully!
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
        reset();
        router.push("/dash-board/tags")
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Failed to add tags. Please try again!');
    }
  };

  return (
    <ProtectedRoute pageName="Tags" requiredPermission="Create New Tag">
      <div className='min-h-screen px-6 bg-gray-50'>

        <div className='max-w-screen-xl mx-auto pt-3 md:pt-6'>
          <div className='flex items-center justify-between'>
            <h3 className='w-full font-semibold text-xl lg:text-2xl'>Create New Tags</h3>
            <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/tags"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-xl mx-auto'>
          <div className="mt-8 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg">
            <label className="flex justify-start font-medium text-[#9F5216]">Enter Tag</label>
            {tagFields?.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                <div className='w-full flex items-center gap-2'>
                  <input
                    type="text"
                    placeholder="Add Tag"
                    {...register(`tag.${index}.tag`, { required: 'Tag is required' })}
                    className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                  />
                  <Button type='button' color="danger" onClick={() => removeTag(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.tag?.[index]?.tag && (
                  <p className="text-red-600 text-left">{errors.tag[index].tag.message}</p>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendTag({ tag: '' })} className="mt-4 mb-8 bg-[#ffddc2] hover:bg-[#fbcfb0] text-neutral-700 py-2 px-4 text-sm rounded-md cursor-pointer font-semibold flex items-center gap-2">
              Add Tag <FaPlus size={16} />
            </button>
          </div>
          <div className='flex justify-end items-center my-8'>
            <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#ffddc2] hover:bg-[#fbcfb0]'} relative z-[1] flex items-center gap-x-3 rounded-lg  px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out font-bold text-[14px] text-neutral-700`}>
              {isSubmitting ? 'Submitting...' : 'Submit'} <MdOutlineFileUpload size={20} />
            </button>
          </div>
        </form>

      </div>
    </ProtectedRoute>
  );
};

export default AddTag;