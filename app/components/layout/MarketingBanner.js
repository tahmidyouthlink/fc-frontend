"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useMarketingBanners from '@/app/hooks/useMarketingBanners';
import { Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Loading from '../shared/Loading/Loading';
import Swal from 'sweetalert2';
import { ImCross } from 'react-icons/im';

const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const MarketingBanner = () => {

  const { handleSubmit } = useForm();
  const axiosPublic = useAxiosPublic();
  const [image, setImage] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [marketingBannerList, isMarketingBannerPending, refetch] = useMarketingBanners();

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage({
        src: URL.createObjectURL(file),
        file
      });
      setSizeError(false);  // Clear any existing error when a file is selected
    } else {
      setSizeError(true);   // Set error when no file is selected
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const uploadImageToImgbb = async (image) => {
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
        return response.data.data.url; // Return the single image URL
      } else {
        toast.error('Failed to get image URL from response.');
      }
    } catch (error) {
      toast.error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
    }
    return null;
  };

  const handleSelectChange = (e) => {
    setSelectedPosition(e.target.value);
  };

  const handleDeleteBanner = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.delete(`/deleteMarketingBanner/${id}`);
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
                        Marketing banner Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Marketing banner has been deleted successfully!
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
          toast.error('Failed to delete marketing banner. Please try again.');
        }
      }
    });
  };

  const selectOptions = [
    { key: "left", label: "Left" },
    { key: "center", label: "Center" },
  ]

  const onSubmit = async () => {

    if (image === null) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageToImgbb(image);
      if (!imageUrl) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    }

    if (marketingBannerList?.length > 0) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="pl-6">
            <ImCross className="h-7 w-7 p-1 bg-red-600 text-white rounded-full" />
          </div>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900">
                  A photo with a position already exists.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please delete it first before uploading a new one.
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
      return;
    }

    try {
      const bannerData = {
        url: imageUrl,
        position: selectedPosition
      };

      const response = await axiosPublic.post('/addMarketingBanner', bannerData);
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
                    Marketing details published!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Marketing details has been successfully launched!
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
        setImage(null);
      }
    } catch (err) {
      toast.error("Failed to publish marketing details!");
    }
  };

  if (isMarketingBannerPending) {
    return <Loading />
  }

  return (
    <div className='max-w-screen-2xl flex flex-col xl:flex-row justify-between gap-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex-1 flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg my-6 h-fit'>
        <Select
          isRequired
          label="Content layout position"
          placeholder="Select a position"
          onChange={handleSelectChange}
        >
          {selectOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
        <div className='flex flex-col gap-4 p-5 md:p-7'>
          <input
            id='imageUpload'
            type='file'
            className='hidden'
            onChange={handleImageChange}
          />
          <label
            htmlFor='imageUpload'
            className='mx-auto flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white cursor-pointer'
          >
            <MdOutlineFileUpload size={60} />
            <div className='space-y-1.5 text-center'>
              <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                Upload Thumbnail
              </h5>
              <p className='text-sm text-gray-500'>
                Photo Should be in PNG, JPEG or JPG format
              </p>
            </div>
          </label>
          {sizeError && (
            <p className="text-red-600 text-center">Please select image</p>
          )}

          {image && (
            <div className='relative'>
              <Image
                src={image.src}
                alt='Uploaded image'
                height={3000}
                width={3000}
                className='w-full min-h-[200px] max-h-[200px] rounded-md object-contain'
              />
              <button
                onClick={handleImageRemove}
                className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
              >
                <RxCross2 size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className='flex justify-end items-center px-5 md:px-7'>
          <button
            type='submit'
            className={`bg-[#D2016E] hover:bg-[#d2016dbd] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold`}
          >
            Upload
          </button>
        </div>
      </form>
      <div className='flex-1 flex flex-col gap-6 items-center justify-center my-6 h-fit'>

        {marketingBannerList?.map((marketing, index) => (
          <div key={index} className="rounded-lg bg-white p-5 md:p-7 drop-shadow dark:bg-[#18181B]">
            <Image width={1200} height={1200} alt='marketing-banner' className="h-fit lg:h-[285px] w-[650px] rounded-lg object-cover" src={marketing?.url} />
            <div className="flex justify-between pt-8">
              <p className='text-neutral-500'> <span>Position: </span>
                {["left", "right", "center"].includes(marketing?.position)
                  ? marketing.position.charAt(0).toUpperCase() + marketing.position.slice(1)
                  : marketing.position}
              </p>
              <button onClick={() => handleDeleteBanner(marketing?._id)}
                class="group relative inline-flex items-center justify-center w-[40px] h-[40px] bg-[#D2016E] text-white rounded-full shadow-lg transform scale-100 transition-transform duration-300"
              >
                <svg
                  width="25px"
                  height="25px"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="rotate-0 transition ease-out duration-300 scale-100 group-hover:-rotate-45 group-hover:scale-75"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default MarketingBanner;