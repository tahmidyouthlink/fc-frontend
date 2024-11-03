"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

export default function EditSeason() {
  const router = useRouter();
  const params = useParams();
  const axiosPublic = useAxiosPublic();
  const [image, setImage] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState([]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const res = await axiosPublic.get(`/allSeasons/${params.id}`);
        const season = res.data;
        setValue('seasonName', season?.seasonName);
        setImage(season?.imageUrl || null);
        setSeasonDetails(season);
      } catch (error) {
        console.error('Error fetching season:', error);
        toast.error('Error fetching season data.');
      }
    };
    fetchSeason();
  }, [params.id, axiosPublic, setValue]);

  const uploadToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.data && data.data.url) {
        return data.data.url; // Imgbb URL of the uploaded image
      } else {
        console.error('Error uploading image:', data);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Immediately upload the selected image to Imgbb
      const uploadedImageUrl = await uploadToImgbb(file);

      if (uploadedImageUrl) {
        // Update the state with the Imgbb URL instead of the local blob URL
        setImage({
          src: uploadedImageUrl,
          file: file,
        });
      }
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    document.getElementById('imageUpload').value = ''; // Clear the file input
  };

  const onSubmit = async (data) => {
    try {

      // Initialize imageUrl with the existing one
      let imageUrl = seasonDetails?.imageUrl || '';

      // If a new image is uploaded, upload it to Imgbb
      if (image && image.file) {
        imageUrl = await uploadToImgbb(image.file);
        if (!imageUrl) {
          toast.error('Image upload failed, cannot proceed.');
          hasError = true;
        }
      } else if (image === null) {
        // If the image is removed, explicitly set imageUrl to an empty string
        imageUrl = '';
      }

      const updatedSeason = {
        seasonName: data?.seasonName,
        imageUrl
      };

      const res = await axiosPublic.put(`/editSeason/${params.id}`, updatedSeason);
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
                    Season Updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Season has been updated successfully!
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
        router.push('/dash-board/seasons');
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing season:', error);
      toast.error('There was an error editing the season. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className='max-w-screen-lg mx-auto pt-3 md:pt-6 px-6'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Edit Category Details</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/seasons"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

        <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg w-full'>
          {/* Season Name Field */}
          <div>
            <label className="flex justify-start font-medium text-[#9F5216] pb-2">Season *</label>
            <input
              type="text"
              placeholder="Add Season Name"
              {...register('seasonName', { required: 'Season is required' })}
              className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
            />
            {errors.seasonName && (
              <p className="text-red-600 text-left">{errors.seasonName.message}</p>
            )}
          </div>

        </div>

        <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg w-full'>


          <div>
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
                  Photo Should be in PNG, JPEG, JPG, WEBP or Avif format
                </p>
              </div>
            </label>

            {image && (
              <div className='relative'>
                <Image
                  src={typeof image === 'string' ? image : image.src}
                  alt='Uploaded image'
                  height={2000}
                  width={2000}
                  className='w-1/2 mx-auto h-[350px] mt-8 rounded-lg object-contain'
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
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-4 pb-8'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2`}
          >
            {isSubmitting ? 'Save Changes...' : 'Saved'}
          </button>
        </div>

      </div>
    </form>
  );
}