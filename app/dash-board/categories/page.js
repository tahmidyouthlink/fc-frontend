"use client";
import React, { useState } from 'react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useCategories from '@/app/hooks/useCategories';
import Loading from '@/app/components/shared/Loading/Loading';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const CategoriesOverview = () => {
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [categoryList, isCategoryPending, refetch] = useCategories();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categoryId, setCategoryId] = useState(null);

  const handleDelete = async (categoryId) => {
    try {
      const res = await axiosPublic.delete(`/deleteCategory/${categoryId}`);
      if (res?.data?.deletedCount) {
        refetch(); // Call your refetch function to refresh data
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
                    Category Removed!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Category has been deleted successfully!
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
      }
    } catch (error) {
      toast.error('Failed to delete category. Please try again.');
    }
  };

  const confirmDelete = () => {
    if (categoryId) {
      handleDelete(categoryId);
    }
    onOpenChange(false); // Close the modal
    setCategoryId(null); // Reset the categoryId
  };

  const openModal = (id) => {
    setCategoryId(id); // Set the categoryId for the deletion
    onOpen(); // Open the modal
  };

  const toggleSubCategoriesVisibility = (categoryId) => {
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  if (isCategoryPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='sticky top-0 z-10 bg-gray-50 flex items-center justify-between max-w-screen-2xl mx-auto px-6 pt-6'>
        <h1 className='font-semibold text-center md:text-xl lg:text-2xl'>Category Management</h1>
        <Button onClick={() => router.push('/dash-board/categories/add-category')} className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
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
              <button size="sm" color='danger' variant="ghost" onClick={() => router.push(`/dash-board/categories/${category._id}`)}>
                <span className='flex items-center py-1 px-3 rounded-lg border-1.5 border-blue-500 gap-2 text-blue-500 hover:text-white hover:bg-blue-600 hover:border-none text-sm font-semibold'>Edit <MdOutlineModeEdit size={16} /></span>
              </button>

              {/* Delete Button */}
              <button size="sm" color='danger' variant="ghost" onPress={() => openModal(category?._id)}>
                <span className='flex items-center py-1 px-3 border-1.5 rounded-lg border-red-500 gap-2 text-red-500 hover:text-white hover:bg-red-600 hover:border-none text-sm font-semibold'>Delete <RiDeleteBinLine size={16} /></span>
              </button>

            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody className='modal-body-scroll'>
                <p>Are you sure you want to delete this Category?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" size="sm" variant="flat" onPress={confirmDelete}>
                  Yes
                </Button>
                <Button variant="flat" size="sm" onPress={onClose}>
                  No
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
};

export default CategoriesOverview;