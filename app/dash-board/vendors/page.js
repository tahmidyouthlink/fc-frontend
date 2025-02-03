"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useVendors from '@/app/hooks/useVendors';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';

const VendorsPage = () => {

  const [vendorList, isVendorPending, refetchVendors] = useVendors();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  const handleDeleteVendor = async (vendorId) => {
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
          const res = await axiosPublic.delete(`/deleteVendor/${vendorId}`);
          if (res?.data?.deletedCount) {
            refetchVendors(); // Call your refetch function to refresh data
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
                        Vendor Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Vendor has been deleted successfully!
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
          toast.error('Failed to delete vendor. Please try again.');
        }
      }
    });
  };

  if (isVendorPending) {
    return <Loading />
  }

  return (
    <div>
      <div className='flex justify-between items-center px-6 lg:px-16 py-3'>
        <h1 className='py-2 md:py-3 font-semibold text-center md:text-xl lg:text-2xl sticky top-0 z-[10] bg-white'>VENDOR MANAGEMENT</h1>
        <button className="relative z-[1] rounded-lg bg-[#ffddc2] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[14px] text-neutral-700">
          <Link className='flex items-center gap-x-3' href={"/dash-board/vendors/add-vendor"}><FaPlus size={15} className='text-neutral-700' /> ADD</Link>
        </button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-0 md:px-4 lg:px-6 custom-max-h overflow-x-auto modal-body-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-[1] shadow-md">
            <tr>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Vendor Name</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Contact Person Name</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Contact Person Number</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Vendor Address</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendorList?.map((vendor, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="text-xs p-3 text-gray-700">
                  {vendor?.value}
                </td>
                <td className="text-xs p-3 text-gray-700">{vendor?.contactPersonName}</td>
                <td className="text-xs p-3 text-gray-700">
                  {vendor?.contactPersonNumber}
                </td>
                <td className="text-xs p-3 text-gray-700">
                  {vendor?.vendorAddress ? vendor?.vendorAddress : "N/A"}
                </td>

                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    {/* Edit Button */}
                    <button onClick={() => router.push(`/dash-board/vendors/${vendor?._id}`)}>
                      <span className='flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-md:[&_p]:hidden max-md:[&_svg]:size-4'><AiOutlineEdit size={16} /> Edit </span>
                    </button>

                    {/* Delete Button */}
                    <button onClick={() => handleDeleteVendor(vendor?._id)}>
                      <span className='flex items-center gap-1.5 rounded-md bg-red-50 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-red-100 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-md:[&_p]:hidden max-md:[&_svg]:size-4 text-xs'> <RiDeleteBinLine size={16} />Delete </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorsPage;