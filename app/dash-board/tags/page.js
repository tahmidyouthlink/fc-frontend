"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useTags from '@/app/hooks/useTags';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MdDeleteOutline } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const TagsPage = () => {

  const [tagList, isTagPending, refetchTags] = useTags();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tagId, setTagId] = useState(null);

  const handleDeleteTag = async (tagId) => {
    try {
      const res = await axiosPublic.delete(`/deleteTag/${tagId}`);
      if (res?.data?.deletedCount) {
        refetchTags(); // Call your refetch function to refresh data
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
                    Tag Removed!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Tag has been removed successfully!
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
      toast.error('Failed to delete Tag. Please try again.');
    }
  };

  const confirmDelete = () => {
    if (tagId) {
      handleDeleteTag(tagId);
    }
    onOpenChange(false); // Close the modal
    setTagId(null); // Reset the tagId
  };

  const openModal = (id) => {
    setTagId(id); // Set the tagId for the deletion
    onOpen(); // Open the modal
  };

  if (isTagPending) {
    return <Loading />
  }

  return (
    <div>
      <div className='sticky top-0 z-10 bg-white flex items-center justify-between p-6'>
        <h1 className='font-semibold text-center md:text-xl lg:text-2xl'>Tag Management</h1>
        <Button onClick={() => router.push('/dash-board/tags/add-tag')} className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
          New Tag
        </Button>
      </div>

      <div className='w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center w-full divide-y divide-gray-200'>
          {tagList?.map((tag, index) => (
            <div key={index} className='flex items-center justify-center w-full hover:bg-gray-100 cursor-pointer px-2 lg:px-6'>
              <p className='flex text-[15px] items-center gap-0.5 md:gap-1 p-2 w-full'>
                {tag?.value}
              </p>
              <Button size="sm" className="text-xs" color="danger" variant="light" onPress={() => openModal(tag?._id)}><MdDeleteOutline className='text-red-800 hover:text-red-950 text-xl cursor-pointer' /></Button>
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

export default TagsPage;