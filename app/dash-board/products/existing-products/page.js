"use client";
import Loading from "@/app/components/shared/Loading/Loading";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import arrowSvgImage from "../../../../public/card-images/arrow.svg";
import arrivals1 from "../../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../../public/card-images/arrivals2.svg";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

const EditProduct = () => {

  const [productList, isProductPending] = useProductsInformation();
  const router = useRouter();

  const handleGoToEditPage = (id) => {
    router.push(`/dash-board/products/${id}`)
  }

  if (isProductPending) {
    return <Loading />
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
      <div className='max-w-[1300px] mx-auto px-5 2xl:px-0 py-8 md:py-10 lg:py-12 relative z-10'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-3xl'>Look at Our Categories</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/dash-board/products"> <span className='border border-black rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
        <div className="pt-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {productList?.map((product, index) => (
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
    </div>
  );
};

export default EditProduct;