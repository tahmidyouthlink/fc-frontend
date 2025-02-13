import Link from 'next/link';
import { FaListAlt, FaPlusCircle } from "react-icons/fa";
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import arrivals2 from "/public/card-images/arrivals2.svg";

const Zone = () => {
  return (
    <div className='relative'>

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

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-10 py-8">
        <div className="w-full max-w-screen-lg space-y-8 lg:space-y-10">
          <Link
            href="/dash-board/zone/add-shipping-zone"
            className="relative w-full h-52 md:h-60 lg:h-72 xl:h-80 border-2 border-dashed border-gray-600 bg-white text-gray-600 text-2xl sm:text-3xl md:text-4xl font-extrabold rounded-lg shadow-lg flex items-center justify-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 group hover:bg-[#ffddc2] hover:text-gray-800 hover:border-gray-800 hover:shadow-xl"
          >
            <FaPlusCircle className="text-4xl sm:text-5xl md:text-6xl transition-transform transform group-hover:scale-110 group-hover:text-gray-800 animate-pulse" />
            <span className="relative transition-transform duration-300 group-hover:text-gray-800 group-hover:translate-x-2">
              Add Shipment
            </span>
          </Link>
          <Link
            href="/dash-board/zone/existing-zones"
            className="relative w-full h-52 md:h-60 lg:h-72 xl:h-80 border-2 border-dashed border-gray-600 bg-white text-gray-600 text-2xl sm:text-3xl md:text-4xl font-extrabold rounded-lg shadow-lg flex items-center justify-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 group hover:bg-[#d4ffce] hover:text-gray-800 hover:border-gray-800 hover:shadow-xl"
          >
            <FaListAlt className="text-4xl sm:text-5xl md:text-6xl transition-transform transform group-hover:scale-110 group-hover:text-gray-800 animate-pulse" />
            <span className="relative transition-transform duration-300 group-hover:text-gray-800 group-hover:translate-x-2">
              Existing Shipments
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Zone;