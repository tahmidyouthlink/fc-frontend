"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import arrowSvgImage from "../../../../../public/card-images/arrow.svg";
import arrivals1 from "../../../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../../../public/card-images/arrivals2.svg";
import SmallHeightLoading from '@/app/components/shared/Loading/SmallHeightLoading';

const ProductPage = () => {

  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const router = useRouter();

  // Decode the URL-encoded category name
  const decodedCategoryName = decodeURIComponent(id);
  const [productDetails, setProductDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/productFromCategory/${decodedCategoryName}`);
        setProductDetails(data);
      } catch (error) {
        toast.error("Failed to load shipping zone details.");
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    fetchProductDetails();
  }, [decodedCategoryName, axiosPublic]);

  const handleGoToEditPage = (id) => {
    router.push(`/dash-board/products/${id}`);
  }

  return (
    <div className='relative w-full min-h-screen'>
      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat left-[45%] lg:left-[60%] -top-[138px]'
      />
      <div
        style={{
          backgroundImage: `url(${arrivals2.src})`,
        }}
        className='absolute inset-0 z-0 bg-contain bg-center xl:-top-28 w-full bg-no-repeat'
      />
      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-2 md:top-5 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />

      <div className='max-w-screen-2xl mx-auto px-6 py-8 md:py-10 lg:py-12 relative z-10'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-3xl'>Look at Our Products</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/dash-board/products/existing-products"> <span className='border border-black rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>

      </div>
      {isLoading ? (
        <div className="min-h-[700px] flex justify-center items-center relative z-10">
          <SmallHeightLoading />
        </div>
      ) : (
        productDetails?.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-screen-2xl mx-auto px-6">
            {productDetails?.map((product, index) => (
              <div className='relative' onClick={() => handleGoToEditPage(product?._id)} key={index}>
                {product.imageUrls?.[0] && (
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.productTitle}
                    className='rounded-2xl object-contain hover:cursor-pointer hover:scale-105 duration-300'
                    height={400}
                    width={400}
                  />
                )}
                <div className='pt-4 space-y-1'>
                  <h1 className='font-semibold text-sm md:text-base'>৳ {product?.regularPrice}</h1>
                  <p className='font-medium text-xs md:text-sm'>{product?.category}</p>
                  <p className='text-[#696969] text-[10px] md:text-xs'>{product.productTitle}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[calc(100vh-300px)] flex justify-center items-center relative z-10 px-6">
            <h1 className="text-center text-xl lg:text-2xl xl:text-3xl font-bold bg-white py-8">There are no products listed in this category yet.</h1>
          </div>
        )
      )}
    </div>
  );
};

export default ProductPage;