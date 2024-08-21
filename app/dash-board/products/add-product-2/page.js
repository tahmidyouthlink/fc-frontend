"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SecondStepOfAddProduct = () => {

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [productVariants, setProductVariants] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedColors = JSON.parse(localStorage.getItem('availableColors') || '[]');
      const storedSizes = JSON.parse(localStorage.getItem('allSizes') || '[]');
      const storedImageUrls = JSON.parse(localStorage.getItem('uploadedImageUrls') || '[]');
      const storedVariants = JSON.parse(localStorage.getItem('productVariants') || '[]');

      if (storedColors.length === 0 || storedSizes.length === 0) {
        toast.error("Colors or sizes are missing. Please go back and select them.");
        router.push("/add-product");
        return;
      }

      // Initialize variants based on current stored sizes and colors
      const variants = storedVariants.filter(variant =>
        storedSizes.includes(variant.size) && storedColors.some(color => color.value === variant.color.value)
      );

      // If there are new sizes or colors, initialize those variants
      for (const color of storedColors) {
        for (const size of storedSizes) {
          if (!variants.some(variant => variant.color.value === color.value && variant.size === size)) {
            variants.push({ color, size, sku: "", batchCode: "", weight: "", imageUrl: "" });
          }
        }
      }

      setProductVariants(variants);
      setUploadedImageUrls(storedImageUrls);

      // Set form values for stored variants
      variants.forEach((variant, index) => {
        setValue(`sku-${index}`, variant.sku);
        setValue(`batchCode-${index}`, variant.batchCode);
        setValue(`weight-${index}`, variant.weight);
        setValue(`imageUrl-${index}`, variant.imageUrl); // Set the image URL
      });
    } catch (e) {
      return null;
    }
  }, [router, setValue]);

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...productVariants];
    updatedVariants[index][field] = value;
    setProductVariants(updatedVariants);
  };

  const handleBatchCodeChange = (index, e) => {
    const uppercaseValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    handleVariantChange(index, 'batchCode', uppercaseValue);
  };

  const onImageClick = (variantIndex, imgUrl) => {
    setProductVariants(prevVariants =>
      prevVariants.map((variant, index) =>
        index === variantIndex ? { ...variant, imageUrl: imgUrl } : variant
      )
    );

    // Update form value for imageUrl
    setValue(`imageUrl-${variantIndex}`, imgUrl);

    // Save updated variants to local storage
    localStorage.setItem(
      'productVariants',
      JSON.stringify(
        productVariants.map((variant, index) =>
          index === variantIndex ? { ...variant, imageUrl: imgUrl } : variant
        )
      )
    );
  };

  const onSubmit = (data) => {
    try {
      const formattedData = productVariants.map((variant, index) => ({
        color: variant.color,
        size: variant.size,
        sku: parseFloat(data[`sku-${index}`]),
        batchCode: data[`batchCode-${index}`],
        weight: parseFloat(data[`weight-${index}`]),
        imageUrl: data[`imageUrl-${index}`] || ""
      }));

      // Check if any variant is missing an image URL
      const missingImage = formattedData.some(variant => variant.imageUrl === "");
      if (missingImage) {
        toast.error("Please select an image for each variant.");
        return;
      }

      localStorage.setItem('productVariants', JSON.stringify(formattedData));
      setNavigate(true);
    } catch (error) {
      toast.error("Failed to save product variants.");
    }
  };

  useEffect(() => {
    if (navigate) {
      router.push("/dash-board/products/add-product-3");
      setNavigate(false); // Reset the state
    }
  }, [navigate, router]);

  return (
    <div className='bg-gray-50'>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Inventory Variants</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6 px-6 lg:px-8 xl:px-10 2xl:px-12 py-3'>
          {productVariants?.map((variant, index) => (
            <div key={index} className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
              <div className='flex items-center gap-2 md:gap-4'>
                <div className='w-1/3'>
                  <label className='font-medium text-[#9F5216]'>Color</label>
                  <input
                    type="text"
                    value={variant.color.label}
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    readOnly
                  />
                </div>
                <div className='w-1/3'>
                  <label className='font-medium text-[#9F5216]'>Size</label>
                  <input
                    type="text"
                    value={variant.size}
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    readOnly
                  />
                </div>
                <div className='w-1/3'>
                  <label htmlFor={`weight-${index}`} className='font-medium text-[#9F5216]'>Weight</label>
                  <input
                    id={`weight-${index}`}
                    {...register(`weight-${index}`, { required: true })}
                    value={variant.weight}
                    onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                    className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    type="number"
                  />
                  {errors[`weight-${index}`] && (
                    <p className="text-red-600 text-left">Weight is required</p>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2 md:gap-4'>
                <div className='md:w-1/3'>
                  <label htmlFor={`sku-${index}`} className='font-medium text-[#9F5216]'>SKU</label>
                  <input
                    id={`sku-${index}`}
                    {...register(`sku-${index}`, { required: true })}
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    type="number"
                  />
                  {errors[`sku-${index}`] && (
                    <p className="text-red-600 text-left">SKU is required</p>
                  )}
                </div>
                <div className='md:w-1/3'>
                  <label htmlFor={`batchCode-${index}`} className='font-medium text-[#9F5216]'>Batch Code</label>
                  <input
                    id={`batchCode-${index}`}
                    {...register(`batchCode-${index}`, {
                      required: 'Batch Code is required',
                      pattern: {
                        value: /^[A-Z0-9]*$/,
                        message: 'Batch Code must be alphanumeric and uppercase',
                      },
                    })}
                    value={variant.batchCode}
                    onChange={(e) => handleBatchCodeChange(index, e)}
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    type="text"
                  />
                  {errors[`batchCode-${index}`] && (
                    <p className="text-red-600 text-left">{errors[`batchCode-${index}`].message}</p>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                <label className='font-medium text-[#9F5216]'>Select Media</label>
                <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-2'>
                  {uploadedImageUrls.map((url, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`image-container ${variant.imageUrl === url ? 'selected' : ''}`}
                      onClick={() => onImageClick(index, url)}
                    >
                      <Image src={url} alt={`image-${imgIndex}`} width={800} height={800} className="rounded-md" />
                    </div>
                  ))}
                </div>
                {errors[`imageUrl-${index}`] && (
                  <p className="text-red-600 text-left">Image selection is required</p>
                )}
              </div>

            </div>
          ))}
        </div>
        <div className='flex justify-between px-6 py-3'>
          <Link href='/dash-board/products/add-product' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            <FaArrowLeft /> Previous Step
          </Link>
          <button type='submit' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            Next Step <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecondStepOfAddProduct;