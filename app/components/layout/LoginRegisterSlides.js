"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Loading from '../shared/Loading/Loading';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import useLoginRegisterSlides from '@/app/hooks/useLoginRegisterSlides';

const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const LoginRegisterSlides = () => {

  const { handleSubmit } = useForm();
  const axiosPublic = useAxiosPublic();
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [sizeError, setSizeError] = useState(false);
  const [loginRegisterImageList, isLoginRegisterImagePending, refetch] = useLoginRegisterSlides();

  // Load existing images from loginRegisterImageList on mount
  useEffect(() => {
    if (loginRegisterImageList?.[0]?.urls) {
      setUploadedImageUrls(loginRegisterImageList[0].urls);
    }
  }, [loginRegisterImageList]);

  const handleImagesChange = async (event) => {
    const files = Array.from(event.target.files);

    // Prevent adding new images if there's already an array
    if (loginRegisterImageList?.[0]?.urls?.length > 10) {
      toast.error("Images already exist. Update or delete existing images instead.");
      return;
    }

    if (files.length === 0) {
      setSizeError(true);
      return;
    } else {
      setSizeError(false);
    }

    await processFiles(files);
  };

  const processFiles = async (files) => {
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) {
      toast.error("Please select valid image files (PNG, JPEG, JPG, WEBP).");
      return;
    }

    const totalImages = validFiles.length + uploadedImageUrls.length;
    if (totalImages > 10) {
      toast.error("You can only upload a maximum of 10 images.");
      return;
    }

    const newImages = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    const imageUrls = await uploadImagesToImgbb(newImages);
    const updatedUrls = [...uploadedImageUrls, ...imageUrls];
    const limitedUrls = updatedUrls.slice(-10);

    setUploadedImageUrls(limitedUrls);
    if (limitedUrls.length > 0) {
      setSizeError(false);
    }
  };

  const validateFiles = (files) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    return files.filter(file => validTypes.includes(file.type));
  };

  const uploadImagesToImgbb = async (images) => {
    const imageUrls = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('key', apiKey);
      try {
        const response = await axiosPublic.post(apiURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data && response.data.data && response.data.data.url) {
          imageUrls.push(response.data.data.url);
        } else {
          toast.error("Failed to get image URL from response.");
        }
      } catch (error) {
        toast.error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
      }
    }
    return imageUrls;
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    await processFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageRemove = (index) => {
    const updatedUrls = uploadedImageUrls.filter((_, i) => i !== index);
    setUploadedImageUrls(updatedUrls);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(uploadedImageUrls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUploadedImageUrls(items);
  };

  const onSubmit = async () => {

    if (uploadedImageUrls.length === 0) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    try {
      const loginRegisterImageUrls = { urls: uploadedImageUrls };
      if (loginRegisterImageList?.[0]?._id) {
        const res = await axiosPublic.put(`/editLoginRegisterImageUrls/${loginRegisterImageList[0]._id}`, loginRegisterImageUrls);
        if (res.data.modifiedCount > 0) {
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
                      Slide images updated!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Slide images has been successfully updated!
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
          refetch();
        } else {
          toast.error('No changes detected!');
        }
      } else {
        const response = await axiosPublic.post('/addLoginRegisterImageUrls', loginRegisterImageUrls);
        if (response.data.insertedId) {
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
                      Slide images published!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Slide images has been successfully published!
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
          refetch();
        }
      }
    } catch {
      toast.error("Failed to publish login register slides!");
    }
  };

  if (isLoginRegisterImagePending) {
    return <Loading />
  }

  return (
    <div className='max-w-screen-lg my-3'>

      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-8 py-3 h-fit'>

        <div className='flex gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>
          <input
            id='imageUpload'
            type='file'
            className='hidden'
            multiple
            onChange={handleImagesChange}
          />
          <label
            htmlFor='imageUpload'
            className='mx-auto flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <MdOutlineFileUpload size={60} />
            <div className='space-y-1.5 text-center'>
              <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                Upload or Drag Media
              </h5>
              <p className='text-sm text-gray-500'>
                Photos Should be in PNG, JPEG, JPG or WEBP format
              </p>
            </div>
          </label>
          {sizeError && (
            <p className="text-red-600 text-center">Please select at least one image</p>
          )}

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <ul
                  className="list-none p-0"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className='overflow-y-auto max-h-[870px] custom-scrollbar'>
                    <div className={`grid grid-cols-2 gap-4 mt-4`}>
                      {uploadedImageUrls.map((url, index) => (
                        <Draggable key={url} draggableId={url} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center mb-2 p-2 bg-white border border-gray-300 rounded-md relative"
                            >
                              <Image
                                src={url}
                                alt={`Uploaded image ${index + 1}`}
                                height={3000}
                                width={3000}
                                className='w-full h-auto max-h-[250px] rounded-md object-contain'
                              />
                              <button
                                onClick={() => handleImageRemove(index)}
                                className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
                              >
                                <RxCross2 size={24} />
                              </button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  </div>
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end items-center'>
          <button
            type='submit'
            className={`bg-[#D2016E] hover:bg-[#d2016dbd] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold`}
          >
            Upload
          </button>
        </div>
      </form>

    </div>
  );
};

export default LoginRegisterSlides;