"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const axiosPublic = useAxiosPublic();
  const [image, setImage] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState([]);

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { category: '', sizes: [{ size: '' }], subCategories: [{ subCategory: '' }] }
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: 'sizes'
  });

  const { fields: subCategoryFields, append: appendSubCategory, remove: removeSubCategory } = useFieldArray({
    control,
    name: 'subCategories'
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosPublic.get(`/allCategories/${params.id}`);
        const category = res.data;
        setValue('category', category.label);
        setValue('sizes', category.sizes.map(size => ({ size })));
        setValue('subCategories', category.subCategories.map(subCat => ({ subCategory: subCat.label })));
        setImage(category?.imageUrl || null);
        setCategoryDetails(category);
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Error fetching category data.');
      }
    };
    fetchCategory();
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
      let imageUrl = categoryDetails?.imageUrl || '';

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

      const updatedCategory = {
        key: data?.category,
        label: data?.category,
        sizes: data.sizes.map(size => size.size),
        subCategories: data.subCategories.map(subCat => ({ key: subCat.subCategory, label: subCat.subCategory })),
        imageUrl
      };

      const res = await axiosPublic.put(`/editCategory/${params.id}`, updatedCategory);
      if (res.data.modifiedCount > 0) {
        toast.success('Category updated successfully');
        router.push('/dash-board/categories');
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing category:', error);
      toast.error('There was an error editing the category. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

        <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg w-full'>
          {/* Category Field */}
          <div className="w-full">
            <label className="flex justify-start font-medium text-[#9F5216] pb-2">Category</label>
            <input
              type="text"
              placeholder="Add Category"
              {...register('category', { required: 'Category is required' })}
              className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
            />
            {errors.category && (
              <p className="text-red-600 text-left mt-1 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Size Ranges Field */}
          <div className="w-full">
            <label className="flex justify-start font-medium text-[#9F5216] pb-2">Size Ranges</label>
            {sizeFields.map((item, index) => (
              <div key={item.id} className="flex flex-col mb-2">
                <div className='w-full flex items-center gap-2'>
                  <input
                    type="text"
                    placeholder="Add Size Range (e.g., XXS-6XL)"
                    {...register(`sizes.${index}.size`, { required: 'Size Range is required' })}
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
                  />
                  <Button type='button' color="danger" onClick={() => removeSize(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.sizes?.[index]?.size && (
                  <p className="text-red-600 text-left mt-1 text-sm">{errors.sizes[index].size.message}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSize({ size: '' })}
              className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2"
            >
              Add Size
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg w-full'>
          {/* Sub-Categories Field */}
          <div className="w-full">
            <label className="flex justify-start font-medium text-[#9F5216] pb-2">Sub-Category</label>
            {subCategoryFields.map((item, index) => (
              <div key={item.id} className="flex flex-col mb-2">
                <div className='w-full flex items-center gap-2'>
                  <input
                    type="text"
                    placeholder="Add Sub-Category"
                    {...register(`subCategories.${index}.subCategory`, { required: 'Sub-Category is required' })}
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-300 rounded-md shadow-sm"
                  />
                  <Button type='button' color="danger" onClick={() => removeSubCategory(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.subCategories?.[index]?.subCategory && (
                  <p className="text-red-600 text-left mt-1 text-sm">{errors.subCategories[index].subCategory.message}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSubCategory({ subCategory: '' })}
              className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium flex items-center gap-2"
            >
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
        <div className='flex justify-between pt-4 pb-8'>

          <Link href='/dash-board/categories' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            <FaArrowLeft /> Previous Step
          </Link>

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