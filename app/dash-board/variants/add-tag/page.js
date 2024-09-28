"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
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
        router.push("/dash-board/variants")
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Failed to add tags. Please try again!');
    }
  };

  return (
    <div className='max-w-screen-lg mx-auto px-6'>

      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Create New Tags</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tag-field w-full">
          <label className="flex justify-start font-medium text-[#9F5216]">Tag</label>
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
        <div className='flex justify-between items-center mt-16 mb-8'>

          <Link className='flex items-center gap-2 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium' href={"/dash-board/variants"}> <FaArrowLeft /> Go Back</Link>

          <button type='submit' className=' bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2'>{isSubmitting ? 'Submitting...' : 'Submit Colors'}</button>
        </div>
      </form>

    </div>
  );
};

export default AddTag;