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
import useCategories from "@/app/hooks/useCategories";
import { useEffect, useState } from "react";

const EditProduct = () => {

  const [categoryList, isCategoryPending] = useCategories();
  const [productList, isProductPending] = useProductsInformation();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Scroll event listener to track when to add background color
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGoToCategoryPage = (categoryName) => {
    router.push(`/dash-board/products/existing-products/${categoryName}`);
  };

  if (isProductPending || isCategoryPending) {
    return <Loading />
  }

  return (
    <div className='relative w-full min-h-screen bg-gray-50'>
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
        className='absolute inset-0 z-0 top-2 md:top-0 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />

      <div
        className={`max-w-screen-2xl mx-auto px-6 sticky top-0 z-10 transition-colors duration-300 ${isScrolled ? "bg-gray-50 py-3" : "bg-transparent py-3 md:py-6"
          }`}
      >
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Look at Our Categories</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href="/dash-board/products"> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-screen-2xl mx-auto px-6">
        {categoryList?.map((category, index) => {
          // Filter products that match the current category
          const productCount = productList?.filter(product => product?.category === category?.label).length;

          return (
            <div key={index} className="w-full h-48 2xl:h-60 relative group cursor-pointer hover:scale-105 transition-all duration-300 rounded-lg" onClick={() => handleGoToCategoryPage(category?.label)}>
              {/* Image */}
              <Image
                className="object-cover rounded-lg"
                src={category?.imageUrl}
                alt="category-image"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority={index < 6}
              />

              {/* Category Label - Always visible */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-[10px] md:text-base font-semibold bg-black bg-opacity-50 md:px-4 md:py-2 px-2 py-1 rounded">
                  {category?.label}
                </h3>
              </div>

              {/* Product Count - Hidden initially, appears on hover with animation */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white text-sm md:text-lg font-semibold">
                  {productCount} Products
                </h4>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default EditProduct;