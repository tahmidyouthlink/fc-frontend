"use client";

import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RxCross2 } from 'react-icons/rx';

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      category: '',
      sizes: [{ size: '' }],
      subCategories: [{ subCategory: '' }]
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

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosPublic.get(`/allCategories/${params.id}`);
        const category = res.data;
        setValue('category', category.label);
        setValue('sizes', category.sizes.map(size => ({ size })));
        setValue('subCategories', category.subCategories.map(subCat => ({ subCategory: subCat.label })));
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Error fetching category data.');
      }
    };
    fetchCategory();
  }, [params.id, axiosPublic, setValue]);

  const onSubmit = async (data) => {
    try {
      const updatedCategory = {
        ...data,
        sizes: data.sizes.map(size => size.size),
        subCategories: data.subCategories.map(subCat => ({ key: subCat.subCategory, label: subCat.subCategory }))
      };

      const res = await axiosPublic.put(`/editCategory/${params.id}`, updatedCategory);
      if (res.data.modifiedCount > 0) {
        toast.success('Category updated successfully');
        router.push('/dash-board/categories');
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('There was an error saving the category. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='w-full flex justify-end pt-3 md:pt-6 max-w-screen-lg mx-auto px-6'>
        <button className='hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white px-1 py-0.5'>
          <Link href={"/dash-board/categories"}><RxCross2 size={28} /></Link>
        </button>
      </div>

      <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

        {/* Category Field */}
        <div className="category-field w-full">
          <label className="flex justify-start font-medium text-[#9F5216] pb-2">Category</label>
          <input
            type="text"
            placeholder="Add Category"
            {...register('category', { required: 'Category is required' })}
            className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
          />
          {errors.category && (
            <p className="text-red-600 text-left mt-1 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* Size Ranges Field */}
        <div className="sizes-field w-full">
          <label className="flex justify-start font-medium text-[#9F5216] pb-2">Size Ranges</label>
          {sizeFields.map((item, index) => (
            <div key={item.id} className="flex flex-col mb-2">
              <div className='w-full flex items-center gap-2'>
                <input
                  type="text"
                  placeholder="Add Size Range (e.g., XXS-6XL)"
                  {...register(`sizes.${index}.size`, { required: 'Size Range is required' })}
                  className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
                />
                <Button type='button' color="danger" onClick={() => removeSize(index)} variant="light">
                  Remove
                </Button>
              </div>
              {errors.sizes?.[index]?.size && (
                <p className="text-red-600 text-left mt-1 text-sm">{errors.sizes[index].size.message}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendSize({ size: '' })}
            className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2"
          >
            Add Size
          </button>
        </div>

        {/* Sub-Categories Field */}
        <div className="subcategories-field w-full">
          <label className="flex justify-start font-medium text-[#9F5216] pb-2">Sub-Category</label>
          {subCategoryFields.map((item, index) => (
            <div key={item.id} className="flex flex-col mb-2">
              <div className='w-full flex items-center gap-2'>
                <input
                  type="text"
                  placeholder="Add Sub-Category"
                  {...register(`subCategories.${index}.subCategory`, { required: 'Sub-Category is required' })}
                  className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
                />
                <Button type='button' color="danger" onClick={() => removeSubCategory(index)} variant="light">
                  Remove
                </Button>
              </div>
              {errors.subCategories?.[index]?.subCategory && (
                <p className="text-red-600 text-left mt-1 text-sm">{errors.subCategories[index].subCategory.message}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendSubCategory({ subCategory: '' })}
            className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2"
          >
            Add Sub-Category
          </button>
        </div>

        {/* Submit Button */}
        <div className='px-6 flex justify-end items-center'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`mt-4 mb-8 ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2`}
          >
            {isSubmitting ? 'Save Changes...' : 'Saved'}
          </button>
        </div>
      </div>
    </form>
  );
}