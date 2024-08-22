"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';

const AddTags = () => {
  const axiosPublic = useAxiosPublic();
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
    const tagData = data.tag.map(tag => ({
      value: tag.tag,
      label: tag.tag
    }));

    try {
      const response = await axiosPublic.post('/addTag', tagData);
      if (response.status === 201) {
        toast.success('Tags added successfully!');
        reset();
      }
    } catch (error) {
      toast.error('Failed to add tags. Please try again!');
    }
  };

  return (
    <div>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Tags</h3>
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
        <div className='px-6 flex justify-end items-center'>
          <button type='submit' className='mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2'>Submit Tags</button>
        </div>
      </form>
    </div>
  );
};

export default AddTags;