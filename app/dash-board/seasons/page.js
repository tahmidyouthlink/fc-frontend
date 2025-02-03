"use client";
import React from 'react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/shared/Loading/Loading';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';
import useSeasons from '@/app/hooks/useSeasons';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';
import { AiOutlineEdit } from 'react-icons/ai';

const Seasons = () => {
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [seasonList, isSeasonPending, refetch] = useSeasons();

  const handleDelete = async (seasonId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.delete(`/deleteSeason/${seasonId}`);
          if (res?.data?.deletedCount) {
            refetch(); // Call your refetch function to refresh data
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
                        Season Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Season has been deleted successfully!
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
          }
        } catch (error) {
          toast.error('Failed to delete season. Please try again.');
        }
      }
    });
  };

  const handleGoToSeasonPage = (id) => {
    router.push(`/dash-board/seasons/${id}`);
  };

  if (isSeasonPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='sticky top-0 z-10 bg-gray-50 flex items-center justify-between max-w-screen-2xl mx-auto px-6 py-6'>
        <h1 className='font-semibold text-center md:text-xl lg:text-2xl'>SEASON MANAGEMENT</h1>

        <button onClick={() => router.push('/dash-board/seasons/add-season')} className="relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[14px] text-neutral-700">
          <FaPlus size={15} className='text-neutral-700' /> Add
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-screen-2xl mx-auto px-6">
        {seasonList?.map((season, index) => {

          return (
            <div key={index} className="w-full h-48 2xl:h-60 relative group cursor-pointer hover:scale-105 transition-all duration-300 rounded-lg border">
              {/* Image */}
              <Image
                className="object-cover rounded-lg px-4"
                src={season?.imageUrl}
                alt="season-image"
                layout="fill"
                objectFit="contain"
                quality={100}
                priority={index < 6}
              />

              {/* Category Label - Always visible */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-[10px] md:text-base font-semibold bg-black bg-opacity-50 md:px-4 md:py-2 px-2 py-1 rounded">
                  {season?.seasonName}
                </h3>
              </div>

              {/* Product Count - Hidden initially, appears on hover with animation */}
              <div className="absolute inset-0 flex items-center gap-3 justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">

                {/* Edit Button */}
                <button onClick={() => handleGoToSeasonPage(season?._id)}>
                  <span className='flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-md:[&_p]:hidden max-md:[&_svg]:size-4'><AiOutlineEdit size={16} /> Edit </span>
                </button>

                {/* Delete Button */}
                <button onClick={() => handleDelete(season?._id)}>
                  <span className='flex items-center gap-1.5 rounded-md bg-red-50 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-red-100 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-md:[&_p]:hidden max-md:[&_svg]:size-4 text-xs'> <RiDeleteBinLine size={16} />Delete </span>
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Seasons;