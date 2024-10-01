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
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleDelete = (categoryId) => {
    toast((t) => (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg w-80">
        <span className="mb-3 text-lg text-center">Are you sure you want to delete this category?</span>
        <div className="flex justify-between w-full">
          <button
            onClick={async () => {
              try {
                const res = await axiosPublic.delete(`/deleteCategory/${categoryId}`);
                if (res?.data?.deletedCount) {
                  refetch();
                  toast.success((t) => (
                    <span>
                      Category has been deleted.
                      <button onClick={() => toast.dismiss(t.id)} className="ml-2 text-blue-500 underline">
                        Dismiss
                      </button>
                    </span>
                  ));
                } else {
                  toast.error("Failed to delete the category.");
                }
              } catch (error) {
                toast.error('Failed to delete the category. Please try again.');
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

  const toggleSubCategoriesVisibility = (categoryId) => {
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  if (isCategoryPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='sticky top-0 z-10 bg-gray-50 flex items-center justify-between max-w-screen-2xl mx-auto px-6'>
        <h1 className='font-semibold text-center md:text-xl lg:text-2xl'>Category Management</h1>
        <Button onClick={() => router.push('/dash-board/categories/add-category')} className='mt-6 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
          New Category
        </Button>
      </div>

      <div className='max-w-screen-2xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-6'>
        {categoryList?.map(category => (
          <div key={category?._id} className='category-item border p-4 rounded-md shadow-md'>
            <h4 className='font-bold text-lg'>{category?.label}</h4>
            <div className='mt-2'>
              <strong>Sizes:</strong> {category.sizes.join(', ')}
            </div>
            <div className='mt-2'>
              <strong>Sub-Categories: </strong>
              {category.subCategories.length > 4
                ? (expandedCategory === category._id
                  ? category.subCategories.map(sub => sub.label).join(', ')
                  : category.subCategories.slice(0, 4).map(sub => sub.label).join(', ') + '...')
                : category.subCategories.map(sub => sub.label).join(', ')}

              {category.subCategories.length > 4 && (
                <button
                  onClick={() => toggleSubCategoriesVisibility(category._id)}
                  className="pl-2 text-blue-600 underline"
                >
                  {expandedCategory === category._id ? 'See Less' : 'See More'}
                </button>
              )}
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