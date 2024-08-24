"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
import { useRouter } from 'next/navigation';

const AddCategory = () => {
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      category: '',
      sizes: [{ size: '' }],
      subCategories: [{ subCategory: '' }],
    }
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: 'sizes'
  });

  const { fields: subCategoryFields, append: appendSubCategory, remove: removeSubCategory } = useFieldArray({
    control,
    name: 'subCategories'
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { category, sizes, subCategories } = data;

    const categoryData = {
      key: category,
      label: category,
      sizes: sizes.map(s => s.size).filter(size => size),
      subCategories: subCategories.map(sc => ({
        key: sc.subCategory,
        label: sc.subCategory
      })),
    };

    try {
      const response = await axiosPublic.post('/addCategory', categoryData);

      if (response.status === 201) {
        toast.success('Category, Sizes, and Sub-categories added successfully!');
        reset();
        router.push("/dash-board/categories")
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category or sizes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <button className='hidden md:flex fixed top-2 right-2 hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1'>
        <Link href={"/dash-board/categories"}><RxCross2 size={28} /></Link>
      </button>

      <button className='md:hidden fixed bottom-2 right-2 hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1'>
        <Link href={"/dash-board/categories"}><RxCross2 size={28} /></Link>
      </button>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Category, Sizes, and Sub-Categories</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

          <div className="category-field w-full">
            <label className="flex justify-start font-medium text-[#9F5216] pb-2">Category</label>
            <input
              type="text"
              placeholder="Add Category"
              {...register('category', { required: 'Category is required' })}
              className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
            />
            {errors.category && (
              <p className="text-red-600 text-left">{errors.category.message}</p>
            )}
          </div>

          <div className="sizes-field w-full">
            <label className="flex justify-start font-medium text-[#9F5216]">Size Ranges</label>
            {sizeFields.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                <div className='w-full flex items-center gap-2'>
                  <input
                    type="text"
                    placeholder="Add Size Range (e.g., XXS-6XL)"
                    {...register(`sizes.${index}.size`, { required: 'Size Range is required' })}
                    className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                  />
                  <Button type='button' color="danger" onClick={() => removeSize(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.sizes?.[index]?.size && (
                  <p className="text-red-600 text-left">{errors.sizes[index].size.message}</p>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendSize({ size: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
              Add Size
            </button>
          </div>

          <div className="subcategories-field w-full">
            <label className="flex justify-start font-medium text-[#9F5216]">Sub-Category</label>
            {subCategoryFields.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                <div className='w-full flex items-center gap-2'>
                  <input
                    type="text"
                    placeholder="Add Sub-Category"
                    {...register(`subCategories.${index}.subCategory`, { required: 'Sub-Category is required' })}
                    className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                  />
                  <Button type='button' color="danger" onClick={() => removeSubCategory(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.subCategories?.[index]?.subCategory && (
                  <p className="text-red-600 text-left">{errors.subCategories[index].subCategory.message}</p>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendSubCategory({ subCategory: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
              Add Sub-Category
            </button>
          </div>

          <div className='px-6 flex justify-end items-center'>
            <button type='submit' disabled={isSubmitting} className={`mt-4 mb-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;