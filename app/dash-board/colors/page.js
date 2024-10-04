"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useColors from '@/app/hooks/useColors';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MdDeleteOutline } from 'react-icons/md';

const ColorsPage = () => {

  const [colorList, isColorPending, refetchColors] = useColors();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [colorId, setColorId] = useState(null);

  const handleDeleteColor = async (colorId) => {
    try {
      const res = await axiosPublic.delete(`/deleteColor/${colorId}`);
      if (res?.data?.deletedCount) {
        refetchColors(); // Call your refetch function to refresh data
        toast.success('Color deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete color. Please try again.');
    }
  };

  const confirmDelete = () => {
    if (colorId) {
      handleDeleteColor(colorId);
    }
    onOpenChange(false); // Close the modal
    setColorId(null); // Reset the colorId
  };

  const openModal = (id) => {
    setColorId(id); // Set the colorId for the deletion
    onOpen(); // Open the modal
  };

  if (isColorPending) {
    return <Loading />
  }

  return (
    <div className='relative'>
      <div className='sticky top-0 z-10 bg-white flex items-center justify-between p-6'>
        <h1 className='font-semibold text-center md:text-xl lg:text-2xl'>Color Management</h1>
        <Button onClick={() => router.push('/dash-board/colors/add-color')} className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
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
              <Button size="sm" className="text-xs" color="danger" variant="light" onPress={() => openModal(color?._id)}><MdDeleteOutline className='text-red-800 hover:text-red-950 text-xl cursor-pointer' /></Button>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody className='modal-body-scroll'>
                <p>Are you sure you want to delete this Color?</p>
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

export default ColorsPage;