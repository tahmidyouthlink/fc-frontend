"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdOutlineFileUpload } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa6';
import useCategories from '@/app/hooks/useCategories';
import Loading from '@/app/components/shared/Loading/Loading';

const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;
const defaultImages = ["https://i.ibb.co.com/ZJ2Qy29/2892174.png",
  "https://i.ibb.co.com/dcRM6Fz/88768.png",
  "https://i.ibb.co.com/sm3xZHL/pngtree-shoes-icon-design-template-illustration-png-image-3177407-removebg-preview.png",
  "https://i.ibb.co.com/yFVrMHF/664466.png",
  "https://i.ibb.co.com/khrPqNc/3345358.png",
  "https://i.ibb.co.com/F7qy9Gh/5258035.png",];

const AddCategory = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryList, isCategoryPending] = useCategories();
  const [selectedDefaultImage, setSelectedDefaultImage] = useState(null);
  const [sizeInput, setSizeInput] = useState('');
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [fetchedSizes, setFetchedSizes] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [fetchedSubCategories, setFetchedSubCategories] = useState([]);
  const [showSubCategorySuggestions, setShowSubCategorySuggestions] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const inputRefCategory = useRef(null);
  const suggestionsRefCategory = useRef(null);

  // Fetch all unique sizes from categoryList
  useEffect(() => {
    const allSizes = Array.from(new Set(categoryList?.flatMap(category => category.sizes)));
    setFetchedSizes(allSizes);
    const allSubCategories = Array.from(new Set(categoryList?.flatMap(category => category.subCategories.map(sub => sub.label))));
    setFetchedSubCategories(allSubCategories);
  }, [categoryList]);

  // Close suggestions if clicking outside the input or suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close suggestions if clicking outside the input or suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRefCategory.current &&
        !inputRefCategory.current.contains(event.target) &&
        suggestionsRefCategory.current &&
        !suggestionsRefCategory.current.contains(event.target)
      ) {
        setShowSubCategorySuggestions(false); // Close sub-category suggestions
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({
        src: URL.createObjectURL(file),
        file
      });
      setSelectedDefaultImage(null); // Clear the default image selection when a file is uploaded
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setSelectedDefaultImage(null); // Clear image selection
  };

  const handleDefaultImageSelect = (defaultImage) => {
    setSelectedDefaultImage(defaultImage);
    setImage(null); // Clear uploaded image if a default image is selected
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

  // Handle input change for sub-categories
  const handleSubCategoryInputChange = (value) => {
    setSubCategoryInput(value);
    const filtered = fetchedSubCategories
      .filter(subCategory => subCategory.toLowerCase().includes(value.toLowerCase()))
      .filter(subCategory => !selectedSubCategories.includes(subCategory)); // Exclude already selected

    setFilteredSubCategories(filtered);
  };

  // Focus handler for sub-category input
  const handleSubCategoryInputFocus = () => {
    const filtered = fetchedSubCategories
      .filter(subCategory => !selectedSubCategories.includes(subCategory)); // Exclude already selected
    setFilteredSubCategories(filtered);
    setShowSubCategorySuggestions(true); // Show suggestions when input is focused
  };

  // Add sub-category
  const addSubCategory = (subCategory) => {
    if (!subCategory || !subCategory.trim()) return;
    if (selectedSubCategories.includes(subCategory)) return;

    setSelectedSubCategories(prev => [...prev, subCategory]);
    setSubCategoryInput('');
    setFilteredSubCategories([]);
  };

  // Add sub-category manually
  const handleAddSubCategory = () => {
    addSubCategory(subCategoryInput);
  };

  // Select from suggestions
  const handleSubCategorySelect = (subCategory) => {
    addSubCategory(subCategory);
    setShowSubCategorySuggestions(false);
  };

  // Remove sub-category
  const handleSubCategoryRemove = (indexToRemove) => {
    setSelectedSubCategories(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // Function to handle input change and filter suggestions
  const handleSizeInputChange = (value) => {
    setSizeInput(value);
    const filtered = fetchedSizes
      .filter(size => size.toLowerCase().includes(value.toLowerCase()))
      .filter(size => !selectedSizes.includes(size)); // Exclude already selected sizes

    setFilteredSizes(filtered);
  };

  // Function to show suggestions when the input is focused
  const handleInputFocus = () => {
    const filtered = fetchedSizes
      .filter(size => !selectedSizes.includes(size)); // Exclude already selected sizes
    setFilteredSizes(filtered);
    setShowSuggestions(true); // Show suggestions when input is focused
  };

  // Function to validate and add a size (both typed or selected)
  const addSize = (size) => {
    if (!size || !size.trim()) return; // Prevent empty inputs
    if (selectedSizes.includes(size)) return; // Prevent duplicate sizes

    setSelectedSizes(prev => [...prev, size]);
    setSizeInput(''); // Clear input after adding
    setFilteredSizes([]); // Clear suggestions
  };

  // Add manually typed size
  const handleAddSize = () => {
    addSize(sizeInput); // Use the common function for validation and addition
  };

  // Select from suggestion list
  const handleSizeSelect = (size) => {
    addSize(size); // Use the common function for validation and addition
    setShowSuggestions(false); // Hide suggestions after selecting
  };

  // Remove size from the list
  const handleSizeRemove = (indexToRemove) => {
    setSelectedSizes(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { category } = data;

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageToImgbb(image);
      if (!imageUrl) {
        toast.error('Image upload failed, cannot proceed.');
        return;
      }
    } else if (selectedDefaultImage) {
      imageUrl = selectedDefaultImage; // Use selected default image if no image is uploaded
    } else {
      toast.error('You must select or upload an image.');
      setIsSubmitting(false);
      return;
    }

    // Validate sizes
    if (selectedSizes.length === 0) {
      toast.error('You must select at least one size.');
      setIsSubmitting(false);
      return;
    }

    // Validate subCategories (if required)
    if (selectedSubCategories.length === 0) {
      toast.error('You must select at least one sub-category.');
      setIsSubmitting(false);
      return;
    }

    const formattedSubCategories = selectedSubCategories.map((subCategory) => ({
      key: subCategory, // Assuming subCategory is a string
      label: subCategory,
    }));

    const categoryData = {
      key: category,
      label: category,
      sizes: selectedSizes,
      subCategories: formattedSubCategories,
      imageUrl
    };

    try {
      const response = await axiosPublic.post('/addCategory', categoryData);

      if (response.status === 201) {
        toast.success('Category, Sizes, and Sub-categories added successfully!');
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

  if (isCategoryPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='max-w-screen-lg mx-auto pt-3 md:pt-6 px-6'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Category Configuration</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/categories"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

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

            {/* Size input field with improved styling */}
            <div className="w-full" ref={inputRef}>
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Size Range</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Add or Search Size Range (e.g., XXS-6XL)"
                  value={sizeInput}
                  onFocus={handleInputFocus}
                  onChange={(e) => handleSizeInputChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9F5216] focus:border-transparent transition duration-300 ease-in-out"
                />
                <Button
                  type="button"
                  onClick={handleAddSize}
                  disabled={!sizeInput}
                  className={`px-4 py-2 rounded-md ${sizeInput ? 'bg-[#9F5216] text-white hover:bg-[#804010]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Add Size
                </Button>
              </div>

              {/* Display filtered size suggestions with a dropdown-like design */}
              {showSuggestions && filteredSizes?.length > 0 && (
                <ul ref={suggestionsRef} className="w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-[9999]">
                  {filteredSizes.map((size, i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors duration-150"
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Display selected sizes with a more polished look */}
            <div className="selected-sizes flex flex-wrap gap-3">
              {selectedSizes?.map((size, index) => (
                <div key={index} className="flex items-center bg-gray-100 border border-gray-300 rounded-full py-1 px-3 text-sm text-gray-700">
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => handleSizeRemove(index)}
                    className="ml-2 text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-150"
                  >
                    <RxCross2 size={19} />
                  </button>
                </div>
              ))}
            </div>

          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

            <div className="w-full" ref={inputRefCategory}>
              <label className="flex justify-start font-medium text-[#9F5216] pb-2">Sub-Category</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Add or Search Sub-Category"
                  value={subCategoryInput}
                  onFocus={handleSubCategoryInputFocus}
                  onChange={(e) => handleSubCategoryInputChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9F5216] focus:border-transparent transition duration-300 ease-in-out"
                />
                <Button
                  type="button"
                  onClick={handleAddSubCategory}
                  disabled={!subCategoryInput}
                  className={`px-4 py-2 rounded-md ${subCategoryInput ? 'bg-[#9F5216] text-white hover:bg-[#804010]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Add Sub-Category
                </Button>
              </div>

              {/* Sub-category suggestions */}
              {showSubCategorySuggestions && filteredSubCategories?.length > 0 && (
                <ul ref={suggestionsRefCategory} className="w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-[9999]">
                  {filteredSubCategories.map((subCategory, i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors duration-150"
                      onClick={() => handleSubCategorySelect(subCategory)}
                    >
                      {subCategory}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected sub-categories */}
            <div className="selected-subCategories flex flex-wrap gap-3 mb-8">
              {selectedSubCategories?.map((subCategory, index) => (
                <div key={index} className="flex items-center bg-gray-100 border border-gray-300 rounded-full py-1 px-3 text-sm text-gray-700">
                  <span>{subCategory}</span>
                  <button
                    type="button"
                    onClick={() => handleSubCategoryRemove(index)}
                    className="ml-2 text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-150"
                  >
                    <RxCross2 size={19} />
                  </button>
                </div>
              ))}
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

              {/* Display uploaded image or selected default image */}
              {(image || selectedDefaultImage) && (
                <div className='relative'>
                  <Image
                    src={image?.src || selectedDefaultImage}
                    alt='Selected or uploaded image'
                    height={2000}
                    width={2000}
                    className='w-1/2 mx-auto md:h-[350px] mt-8 rounded-md'
                  />
                  <button
                    onClick={handleImageRemove}
                    className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
                  >
                    <RxCross2 size={24} />
                  </button>
                </div>
              )}

              {/* Show default images for selection if no image is uploaded */}
              {!image && !selectedDefaultImage && (
                <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-8 xl:gap-4 mt-8'>
                  {defaultImages.map((defaultImage, index) => (
                    <div key={index} onClick={() => handleDefaultImageSelect(defaultImage)} className='cursor-pointer'>
                      <Image
                        src={defaultImage}
                        alt={`Default image ${index + 1}`}
                        height={2000}
                        width={2000}
                        className='w-full h-52 xl:h-96 rounded-md object-contain'
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className='flex justify-end pt-4 pb-8'>

            <button type='submit' disabled={isSubmitting} className={`${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2`}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form >
    </div >
  );
};

export default AddCategory;