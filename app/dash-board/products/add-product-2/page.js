"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { FiSave } from 'react-icons/fi';

const SecondStepOfAddProduct = () => {

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [productVariants, setProductVariants] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();
  const axiosPublic = useAxiosPublic();

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
            variants.push({ color, size, sku: "", imageUrl: "" });
          }
        }
      }

      setProductVariants(variants);
      setUploadedImageUrls(storedImageUrls);

      // Set form values for stored variants
      variants.forEach((variant, index) => {
        setValue(`sku-${index}`, variant.sku);
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
      const formattedData = productVariants?.map((variant, index) => ({
        color: variant.color,
        size: variant.size,
        sku: parseFloat(data[`sku-${index}`]),
        imageUrl: data[`imageUrl-${index}`] || ""
      }));

      // Check if any variant is missing an image URL
      const missingImage = formattedData?.some(variant => variant.imageUrl === "");
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

  // New function for "Save for Now" button
  const onSaveForNow = async (formData) => {

    const storedFormattedDate = localStorage.getItem("formattedDate");
    const storedProductTitle = localStorage.getItem('productTitle');
    const storedProductWeight = localStorage.getItem('weight');
    const storedProductBatchCode = localStorage.getItem('batchCode');
    const storedRegularPrice = localStorage.getItem('regularPrice');
    const storedUploadedImageUrls = JSON.parse(localStorage.getItem('uploadedImageUrls') || '[]');
    const storedDiscountType = localStorage.getItem('discountType');
    const storedDiscountValue = localStorage.getItem('discountValue');
    const storedProductDetails = localStorage.getItem('productDetails');
    const storedMaterialCare = localStorage.getItem('materialCare');
    const storedSizeFit = localStorage.getItem('sizeFit');
    const storedCategory = localStorage.getItem('category');
    const storedSubCategories = JSON.parse(localStorage.getItem('subCategories') || '[]');
    const storedGroupOfSizes = JSON.parse(localStorage.getItem('groupOfSizes') || '[]');
    const storedAllSizes = JSON.parse(localStorage.getItem('allSizes') || '[]');
    const storedAvailableColors = JSON.parse(localStorage.getItem('availableColors') || '[]');
    const storedNewArrival = localStorage.getItem('newArrival');
    const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    const storedTags = JSON.parse(localStorage.getItem('tags') || '[]');
    const storedProductId = localStorage.getItem('productId');

    const formattedData = productVariants?.map((variant, index) => ({
      color: variant.color,
      size: variant.size,
      sku: parseFloat(formData[`sku-${index}`]),
      imageUrl: formData[`imageUrl-${index}`] || ""
    }));

    // Check if any variant is missing an image URL
    const missingImage = formattedData?.some(variant => variant.imageUrl === "");
    if (missingImage) {
      toast.error("Please select an image for each variant.");
      return;
    }

    const productData = {
      publishDate: storedFormattedDate,
      productTitle: storedProductTitle,
      weight: storedProductWeight,
      batchCode: storedProductBatchCode,
      regularPrice: storedRegularPrice,
      imageUrls: storedUploadedImageUrls,
      discountType: storedDiscountType,
      discountValue: storedDiscountValue,
      productDetails: storedProductDetails,
      materialCare: storedMaterialCare,
      sizeFit: storedSizeFit,
      category: storedCategory,
      subCategories: storedSubCategories,
      groupOfSizes: storedGroupOfSizes,
      allSizes: storedAllSizes,
      availableColors: storedAvailableColors,
      newArrival: storedNewArrival,
      vendors: storedVendors,
      tags: storedTags,
      productId: storedProductId,
      productVariants: formattedData,
      status: "draft",
    };

    try {
      const response = await axiosPublic.post('/addProduct', productData);
      if (response?.data?.insertedId) {
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
                    Product Drafted!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    This Product is successfully drafted!
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
        localStorage.removeItem('formattedDate');
        localStorage.removeItem('productTitle');
        localStorage.removeItem('batchCode');
        localStorage.removeItem('weight');
        localStorage.removeItem('regularPrice');
        JSON.parse(localStorage.removeItem('uploadedImageUrls') || '[]');
        localStorage.removeItem('discountType');
        localStorage.removeItem('discountValue');
        localStorage.removeItem('productDetails');
        localStorage.removeItem('materialCare');
        localStorage.removeItem('sizeFit');
        localStorage.removeItem('category');
        localStorage.removeItem('productId');
        JSON.parse(localStorage.removeItem('subCategories') || '[]');
        JSON.parse(localStorage.removeItem('groupOfSizes') || '[]');
        JSON.parse(localStorage.removeItem('allSizes') || '[]');
        JSON.parse(localStorage.removeItem('availableColors') || '[]');
        localStorage.removeItem('newArrival');
        JSON.parse(localStorage.removeItem('vendors') || '[]');
        JSON.parse(localStorage.removeItem('tags') || '[]');
        JSON.parse(localStorage.removeItem('productVariants') || '[]');
        router.push("/dash-board/products/existing-products");
      }
    } catch (err) {
      toast.error("Failed to save product information");
    }
  };

  useEffect(() => {
    if (navigate) {
      router.push("/dash-board/products/add-product-3");
      setNavigate(false); // Reset the state
    }
  }, [navigate, router]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-screen-2xl mx-auto sticky top-0 z-10'>
        <h3 className='text-left bg-gray-50 font-semibold text-xl md:text-2xl px-6 py-6'>Add Inventory Variants</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='min-h-[90vh] flex flex-col justify-between'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 px-6 lg:px-8 xl:px-10 2xl:px-12 py-3'>
          {productVariants?.map((variant, index) => (
            <div key={index} className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
              <div className='flex items-center gap-2 md:gap-4'>
                <div className='w-1/3'>
                  <label className='font-medium text-[#9F5216]'>Color</label>
                  <input
                    type="text"
                    value={variant.color.label}
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    disabled
                  />
                </div>
                <div className='w-1/3'>
                  <label className='font-medium text-[#9F5216]'>Size</label>
                  <input
                    type="text"
                    value={variant.size}
                    className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                    disabled
                  />
                </div>
                <div className='md:w-1/3'>
                  <label htmlFor={`sku-${index}`} className='font-medium text-[#9F5216]'>SKU *</label>
                  <input
                    id={`sku-${index}`}
                    autocomplete="off"
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
              </div>
              <div className='flex flex-col gap-4'>
                <label className='font-medium text-[#9F5216]'>Select Media *</label>
                <div className='grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-2'>
                  {uploadedImageUrls.map((url, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`image-container ${variant.imageUrl === url ? 'selected' : ''}`}
                      onClick={() => onImageClick(index, url)}
                    >
                      <Image src={url} alt={`image-${imgIndex}`} width={3000} height={3000} className="w-full min-h-[200px] max-h-[200px] rounded-md object-contain" />
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
        <div className='flex justify-between px-6 lg:px-8 xl:px-10 2xl:px-12 py-3'>
          <Link href='/dash-board/products/add-product' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
            <FaArrowLeft /> Previous Step
          </Link>
          <div className='flex items-center gap-6'>
            <button type="button" onClick={handleSubmit(onSaveForNow)} className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
              Save For Now <FiSave size={19} />
            </button>
            <button type='submit' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-2 rounded-md flex items-center gap-2'>
              Next Step <FaArrowRight />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SecondStepOfAddProduct;