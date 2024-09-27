"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const ProductPage = () => {

  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const router = useRouter();

  // Decode the URL-encoded category name
  const decodedCategoryName = decodeURIComponent(id);
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/productFromCategory/${decodedCategoryName}`);
        setProductDetails(data);
      } catch (error) {
        toast.error("Failed to load shipping zone details.");
      }
    };

    fetchProductDetails();
  }, [decodedCategoryName, axiosPublic]);

  const handleGoToEditPage = (id) => {
    router.push(`/dash-board/products/${id}`);
  }

  return (
    <div>
      <div className='max-w-screen-2xl mx-auto px-6 pt-6 relative z-10'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-3xl'>Look at Our Products</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/dash-board/products/existing-products"> <span className='border border-black rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>

      </div>
      <div className="pt-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-screen-2xl mx-auto px-6">
        {productDetails?.map((product, index) => (
          <div onClick={() => handleGoToEditPage(product?._id)} key={index}>
            {/* Display first image URL */}
            {product.imageUrls?.[0] && (
              <Image src={product.imageUrls[0]}
                alt={product.productTitle} className='rounded-2xl object-contain hover:cursor-pointer hover:scale-105 duration-300' height={400} width={400} />
            )}
            <div className='pt-4 space-y-1'>
              <h1 className='font-semibold text-sm md:text-base'>৳ {product?.regularPrice}</h1>
              <p className='font-medium text-xs md:text-sm'>{product?.category}</p>
              <p className='text-[#696969] text-[10px] md:text-xs'>{product.productTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;