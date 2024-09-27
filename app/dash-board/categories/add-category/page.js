"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdOutlineFileUpload } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa6';

const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const AddCategory = () => {
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      category: '',
      sizes: [{ size: '' }],
      subCategories: [{ subCategory: '' }],
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({
        src: URL.createObjectURL(file),
        file
      });
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { category, sizes, subCategories } = data;

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageToImgbb(image);
      if (!imageUrl) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    }

    const categoryData = {
      key: category,
      label: category,
      sizes: sizes.map(s => s.size).filter(size => size),
      subCategories: subCategories.map(sc => ({
        key: sc.subCategory,
        label: sc.subCategory
      })),
      imageUrl
    };

    try {
      const response = await axiosPublic.post('/addCategory', categoryData);

      if (response.status === 201) {
        toast.success('Category, Sizes, and Sub-categories added successfully!');
        reset();
        router.push("/dash-board/categories")
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category or sizes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg w-full'>
            <div>
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Category</label>
              <input
                type="text"
                placeholder="Add Category"
                {...register('category', { required: 'Category is required' })}
                className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
              />
              {errors.category && (
                <p className="text-red-600 text-left">{errors.category.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className="flex justify-start font-medium text-[#9F5216]">Size Ranges</label>
              {sizeFields.map((item, index) => (
                <div key={item.id} className="flex flex-col">
                  <div className='w-full flex items-center gap-2'>
                    <input
                      type="text"
                      placeholder="Add Size Range (e.g., XXS-6XL)"
                      {...register(`sizes.${index}.size`, { required: 'Size Range is required' })}
                      className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    />
                    <Button type='button' color="danger" onClick={() => removeSize(index)} variant="light">
                      Remove
                    </Button>
                  </div>
                  {errors.sizes?.[index]?.size && (
                    <p className="text-red-600 text-left">{errors.sizes[index].size.message}</p>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendSize({ size: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
                Add Size
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

            <div className="subcategories-field w-full">
              <label className="flex justify-start font-medium text-[#9F5216]">Sub-Category</label>
              {subCategoryFields.map((item, index) => (
                <div key={item.id} className="flex flex-col">
                  <div className='w-full flex items-center gap-2'>
                    <input
                      type="text"
                      placeholder="Add Sub-Category"
                      {...register(`subCategories.${index}.subCategory`, { required: 'Sub-Category is required' })}
                      className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    />
                    <Button type='button' color="danger" onClick={() => removeSubCategory(index)} variant="light">
                      Remove
                    </Button>
                  </div>
                  {errors.subCategories?.[index]?.subCategory && (
                    <p className="text-red-600 text-left">{errors.subCategories[index].subCategory.message}</p>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendSubCategory({ subCategory: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
                Add Sub-Category
              </button>
            </div>

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
                    Photo Should be in PNG, JPEG or JPG format
                  </p>
                </div>
              </label>

              {image && (
                <div className='relative'>
                  <Image
                    src={image.src}
                    alt='Uploaded image'
                    height={100}
                    width={200}
                    className='w-1/2 mx-auto h-[350px] mt-8 rounded-md'
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

          <div className='flex justify-between pt-4 pb-8'>

            <Link href='/dash-board/categories' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
              <FaArrowLeft /> Previous Step
            </Link>

            <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;