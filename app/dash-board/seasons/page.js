"use client";
import React from 'react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/shared/Loading/Loading';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';
import useSeasons from '@/app/hooks/useSeasons';
import Image from 'next/image';

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
        <h1 className='font-semibold text-center md:text-xl lg:text-2xl'>Season Management</h1>
        <Button onClick={() => router.push('/dash-board/seasons/add-season')} className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
          New Season
        </Button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-screen-2xl mx-auto px-6">
        {seasonList?.map((season, index) => {

          return (
            <div key={index} className="w-full h-48 2xl:h-60 relative group cursor-pointer hover:scale-105 transition-all duration-300 rounded-lg">
              {/* Image */}
              <Image
                className="object-cover rounded-lg"
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
              <div className="absolute inset-0 flex items-center gap-3 justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button color='primary' size='sm' onClick={() => handleGoToSeasonPage(season?._id)}>Edit <MdOutlineModeEdit size={16} /></Button>
                <Button color='danger' size='sm' onClick={() => handleDelete(season?._id)}>Delete <RiDeleteBinLine size={16} /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Seasons;