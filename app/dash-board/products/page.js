import Link from 'next/link';
import { FaListAlt, FaPlusCircle } from "react-icons/fa";

const Products = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-10 py-8">
        <div className="w-full max-w-screen-lg space-y-8 lg:space-y-10">
          <Link
            href="/dash-board/products/add-product"
            className="relative w-full h-52 md:h-60 lg:h-72 xl:h-80 border-2 border-dashed border-gray-600 bg-white text-gray-600 text-2xl sm:text-3xl md:text-4xl font-extrabold rounded-lg shadow-lg flex items-center justify-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 group hover:bg-[#ffddc2] hover:text-gray-800 hover:border-gray-800 hover:shadow-xl"
          >
            <FaPlusCircle className="text-4xl sm:text-5xl md:text-6xl transition-transform transform group-hover:scale-110 group-hover:text-gray-800 animate-pulse" />
            <span className="relative transition-transform duration-300 group-hover:text-gray-800 group-hover:translate-x-2">
              New Product
            </span>
          </Link>
          <Link
            href="/dash-board/products/existing-products"
            className="relative w-full h-52 md:h-60 lg:h-72 xl:h-80 border-2 border-dashed border-gray-600 bg-white text-gray-600 text-2xl sm:text-3xl md:text-4xl font-extrabold rounded-lg shadow-lg flex items-center justify-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 group hover:bg-[#d4ffce] hover:text-gray-800 hover:border-gray-800 hover:shadow-xl"
          >
            <FaListAlt className="text-4xl sm:text-5xl md:text-6xl transition-transform transform group-hover:scale-110 group-hover:text-gray-800 animate-pulse" />
            <span className="relative transition-transform duration-300 group-hover:text-gray-800 group-hover:translate-x-2">
              Existing Products
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Products;