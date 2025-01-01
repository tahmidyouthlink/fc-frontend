"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../shared/Loading/Loading';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Image from 'next/image';
import { MdOutlineFileUpload } from 'react-icons/md';
import toast from 'react-hot-toast';
import useHeroBannerImages from '@/app/hooks/useHeroBannerImages';

const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const HomepageContent = () => {

  const { handleSubmit } = useForm();
  const axiosPublic = useAxiosPublic();
  const [heroBannerImageList = [], isLoginRegisterHeroBannerImagePending, refetch] = useHeroBannerImages();
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [sizeError2, setSizeError2] = useState(false);
  const [sizeError3, setSizeError3] = useState(false);

  useEffect(() => {
    if (heroBannerImageList && heroBannerImageList.length > 0) {
      setImage({ src: heroBannerImageList[0]?.leftImgUrl, file: null });
      setImage2({ src: heroBannerImageList[0]?.centerImgUrl, file: null });
      setImage3({ src: heroBannerImageList[0]?.rightImgUrl, file: null });
    }
  }, [heroBannerImageList]);

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

  const handleImageChange2 = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage2({
        src: URL.createObjectURL(file),
        file
      });
      setSizeError2(false);  // Clear any existing error when a file is selected
    } else {
      setSizeError2(true);   // Set error when no file is selected
    }
  };

  const handleImageChange3 = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage3({
        src: URL.createObjectURL(file),
        file
      });
      setSizeError3(false);  // Clear any existing error when a file is selected
    } else {
      setSizeError3(true);   // Set error when no file is selected
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const handleImageRemove2 = () => {
    setImage2(null);
  };

  const handleImageRemove3 = () => {
    setImage3(null);
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

  const handleGoToPreviewPageBeforeUpload = async () => {

    if (!image) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    let imageUrl = '';
    // If the image is new, upload it
    if (image?.file) {
      imageUrl = await uploadImageToImgbb(image);
      if (!imageUrl) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    } else if (heroBannerImageList?.length > 0) {
      // Use the existing URL if no new image was uploaded
      imageUrl = heroBannerImageList[0]?.leftImgUrl;
    }

    if (imageUrl) {
      const previewURL = `/previewHomeContent?leftImage=${encodeURIComponent(imageUrl)}`;
      window.open(previewURL, '_blank');
    } else {
      toast.error("Please upload an image");
    }
  };

  const handleGoToPreviewPageBeforeUpload2 = async () => {

    if (!image2) {
      setSizeError2(true);
      return;
    }
    setSizeError2(false);

    let imageUrl2 = '';
    // If the image is new, upload it
    if (image2?.file) {
      imageUrl2 = await uploadImageToImgbb(image2);
      if (!imageUrl2) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    } else if (heroBannerImageList?.length > 0) {
      // Use the existing URL if no new image was uploaded
      imageUrl2 = heroBannerImageList[0]?.centerImgUrl;
    }

    if (imageUrl2) {
      const previewURL = `/previewHomeContent?centerImage=${encodeURIComponent(imageUrl2)}`;
      window.open(previewURL, '_blank');
    } else {
      toast.error("Please upload an image");
    }
  };

  const handleGoToPreviewPageBeforeUpload3 = async () => {

    if (!image3) {
      setSizeError3(true);
      return;
    }
    setSizeError3(false);

    let imageUrl3 = '';
    // If the image is new, upload it
    if (image3?.file) {
      imageUrl3 = await uploadImageToImgbb(image3);
      if (!imageUrl3) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    } else if (heroBannerImageList?.length > 0) {
      // Use the existing URL if no new image was uploaded
      imageUrl3 = heroBannerImageList[0]?.rightImgUrl;
    }

    if (imageUrl3) {
      const previewURL = `/previewHomeContent?rightImage=${encodeURIComponent(imageUrl3)}`;
      window.open(previewURL, '_blank');
    } else {
      toast.error("Please upload an image");
    }
  };

  const handleGoToPreviewPageAfterUpload = (imageUrl, imageUrl2, imageUrl3) => {
    const previewURL = `/previewHomeContent?leftImage=${encodeURIComponent(imageUrl)}&centerImage=${encodeURIComponent(imageUrl2)}&rightImage=${encodeURIComponent(imageUrl3)}`;
    window.open(previewURL, '_blank');
  }

  const onSubmit = async () => {

    if (!image) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    if (!image2) {
      setSizeError2(true);
      return;
    }
    setSizeError2(false);

    if (!image3) {
      setSizeError3(true);
      return;
    }
    setSizeError3(false);

    let imageUrl = '';
    // If the image is new, upload it
    if (image?.file) {
      imageUrl = await uploadImageToImgbb(image);
      if (!imageUrl) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    } else if (heroBannerImageList?.length > 0) {
      // Use the existing URL if no new image was uploaded
      imageUrl = heroBannerImageList[0]?.leftImgUrl;
    }

    let imageUrl2 = '';
    // If the image is new, upload it
    if (image2?.file) {
      imageUrl2 = await uploadImageToImgbb(image2);
      if (!imageUrl2) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    } else if (heroBannerImageList?.length > 0) {
      // Use the existing URL if no new image was uploaded
      imageUrl2 = heroBannerImageList[0]?.centerImgUrl;
    }

    let imageUrl3 = '';
    // If the image is new, upload it
    if (image3?.file) {
      imageUrl3 = await uploadImageToImgbb(image3);
      if (!imageUrl3) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    } else if (heroBannerImageList?.length > 0) {
      // Use the existing URL if no new image was uploaded
      imageUrl3 = heroBannerImageList[0]?.rightImgUrl;
    }

    if (heroBannerImageList?.length > 0) {
      const bannerId = heroBannerImageList[0]?._id;

      const bannerData = {
        leftImgUrl: imageUrl,
        centerImgUrl: imageUrl2,
        rightImgUrl: imageUrl3,
      };

      try {
        const response = await axiosPublic.put(`/editHeroBannerImageUrls/${bannerId}`, bannerData);
        if (response.data.modifiedCount > 0) {
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
                      Hero banner updated!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Hero banner has been successfully updated!
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
        else {
          toast.error('No changes detected.');
        }
      } catch (err) {
        toast.error("Failed to publish marketing details!");
      }
    }
  };

  if (isLoginRegisterHeroBannerImagePending) {
    return <Loading />
  };

  return (
    <div className='max-w-screen-2xl'>

      <form onSubmit={handleSubmit(onSubmit)} className='my-6'>

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-between items-start bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg h-fit'>

          <div className='flex flex-col gap-4 p-5 md:p-7'>
            <input
              id='imageUpload'
              type='file'
              className='hidden'
              onChange={handleImageChange}
            />
            <label
              htmlFor='imageUpload'
              className='flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white cursor-pointer'
            >
              <MdOutlineFileUpload size={60} />
              <div className='space-y-1.5 text-center'>
                <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                  Upload Left Thumbnail
                </h5>
                <p className='text-sm text-gray-500'>
                  Photo Should be in PNG, JPEG or JPG format
                </p>
              </div>
            </label>
            {sizeError && (
              <p className="text-red-600 text-center">Banner left image is required!</p>
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

            {image && <div className="flex justify-start">
              <button type='button' className='inline-block text-blue-600 border-blue-500 font-bold border-b mt-6' onClick={handleGoToPreviewPageBeforeUpload}>
                Preview
              </button>
            </div>}

          </div>

          <div className='flex flex-col gap-4 p-5 md:p-7'>
            <input
              id='imageUpload2'
              type='file'
              className='hidden'
              onChange={handleImageChange2}
            />
            <label
              htmlFor='imageUpload2'
              className='flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white cursor-pointer'
            >
              <MdOutlineFileUpload size={60} />
              <div className='space-y-1.5 text-center'>
                <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                  Upload Center Thumbnail
                </h5>
                <p className='text-sm text-gray-500'>
                  Photo Should be in PNG, JPEG or JPG format
                </p>
              </div>
            </label>
            {sizeError2 && (
              <p className="text-red-600 text-center">Banner center image is required!</p>
            )}

            {image2 && (
              <div className='relative'>
                <Image
                  src={image2.src}
                  alt='Uploaded image'
                  height={3000}
                  width={3000}
                  className='w-full min-h-[200px] max-h-[200px] rounded-md object-contain'
                />
                <button
                  onClick={handleImageRemove2}
                  className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
                >
                  <RxCross2 size={24} />
                </button>
              </div>
            )}

            {image2 && <div className="flex justify-start">
              <button type='button' className='inline-block text-blue-600 border-blue-500 font-bold border-b mt-6' onClick={handleGoToPreviewPageBeforeUpload2}>
                Preview
              </button>
            </div>}

          </div>

          <div className='flex flex-col gap-4 p-5 md:p-7'>

            <input
              id='imageUpload3'
              type='file'
              className='hidden'
              onChange={handleImageChange3}
            />
            <label
              htmlFor='imageUpload3'
              className='flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white cursor-pointer'
            >
              <MdOutlineFileUpload size={60} />
              <div className='space-y-1.5 text-center'>
                <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                  Upload Right Thumbnail
                </h5>
                <p className='text-sm text-gray-500'>
                  Photo Should be in PNG, JPEG or JPG format
                </p>
              </div>
            </label>
            {sizeError3 && (
              <p className="text-red-600 text-center">Banner right image is required!</p>
            )}

            {image3 && (
              <div className='relative'>
                <Image
                  src={image3.src}
                  alt='Uploaded image'
                  height={3000}
                  width={3000}
                  className='w-full min-h-[200px] max-h-[200px] rounded-md object-contain'
                />
                <button
                  onClick={handleImageRemove3}
                  className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
                >
                  <RxCross2 size={24} />
                </button>
              </div>
            )}

            {image3 && <div className="flex justify-start">
              <button type='button' className='inline-block text-blue-600 border-blue-500 font-bold border-b mt-6' onClick={handleGoToPreviewPageBeforeUpload3}>
                Preview
              </button>
            </div>}

          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-between gap-6 items-center px-5 md:px-7 mt-6 lg:mt-12">

          {heroBannerImageList?.map((hero) => (
            <button key={hero?._id} type='button' className='text-blue-600 border-blue-500 font-bold border-b' onClick={() => handleGoToPreviewPageAfterUpload(hero?.leftImgUrl, hero?.centerImgUrl, hero?.rightImgUrl)}>
              Preview
            </button>
          ))}

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

export default HomepageContent;