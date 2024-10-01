"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';

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
        toast.success('Tags added successfully!');
        reset();
        router.push("/dash-board/tags")
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Failed to add tags. Please try again!');
    }
  };

  return (
    <div className='min-h-screen px-6 bg-gray-50'>

      <div className='max-w-screen-lg mx-auto pt-3 md:pt-6'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Create New Tags</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/tags"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='max-w-screen-lg mx-auto'>
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
          <button type="button" onClick={() => appendTag({ tag: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
            Add Tag
          </button>
        </div>
        <div className='flex justify-end items-center my-8'>
          <button type='submit' className=' bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2'>{isSubmitting ? 'Submitting...' : 'Submit Tags'}</button>
        </div>
      </form>

    </div>
  );
};

export default AddTag;