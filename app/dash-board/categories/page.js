"use client";
import React, { useState } from 'react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useCategories from '@/app/hooks/useCategories';
import Loading from '@/app/components/shared/Loading/Loading';

const CategoriesOverview = () => {
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [categoryList, isCategoryPending, refetch] = useCategories();

  const handleDelete = async (categoryId) => {
    try {
      const res = await axiosPublic.delete(`/deleteCategory/${categoryId}`);
      if (res?.data?.deletedCount) {
        refetch();
        toast.success('Category deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete category. Please try again.');
    }
  };

  if (isCategoryPending) {
    return <Loading />
  }

  return (
    <div className='min-h-screen'>

      <div className='sticky top-0 z-10 bg-white flex justify-center'>
        <Button onClick={() => router.push('/dash-board/categories/add-category')} className='mt-6 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
          Add New Category
        </Button>
      </div>

      <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>
        {categoryList?.map(category => (
          <div key={category?._id} className='category-item border p-4 rounded-md shadow-md'>
            <h4 className='font-bold text-lg'>{category?.label}</h4>
            <div className='sizes mt-2'>
              <strong>Sizes:</strong> {category.sizes.join(', ')}
            </div>
            <div className='sub-categories mt-2'>
              <strong>Sub-Categories:</strong> {category.subCategories.map(sub => sub.label).join(', ')}
            </div>
            <div className='flex gap-2 mt-4'>
              {/* Edit Button */}
              <Button
                onClick={() => router.push(`/dash-board/categories/${category._id}`)}
                className='bg-[#9F5216] text-white'>
                Edit Category
              </Button>
              {/* Delete Button */}
              <Button
                onClick={() => handleDelete(category._id)}
                color="danger"
                variant="light">
                Delete Category
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CategoriesOverview;