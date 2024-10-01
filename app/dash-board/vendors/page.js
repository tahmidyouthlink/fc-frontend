"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useVendors from '@/app/hooks/useVendors';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const VendorsPage = () => {

  const [vendorList, isVendorPending, refetchVendors] = useVendors();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  const handleDeleteVendor = (id) => {
    toast((t) => (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg w-80 z-50">
        <span className="mb-3 text-lg text-center">Are you sure you want to delete this vendor?</span>
        <div className="flex justify-between w-full">
          <button
            onClick={async () => {
              const res = await axiosPublic.delete(`/deleteVendor/${id}`);
              if (res?.data?.deletedCount) {
                refetchVendors();
                toast.success((t) => (
                  <span>
                    Vendor has been deleted.
                    <button onClick={() => toast.dismiss(t.id)} className="ml-2 text-blue-500 underline">
                      Dismiss
                    </button>
                  </span>
                ));
              } else {
                toast.error("Failed to delete the vendor.");
              }
              toast.dismiss(t.id); // Dismiss the confirmation toast
            }}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Dismiss the confirmation toast
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  if (isVendorPending) {
    return <Loading />
  }

  return (
    <div>
      <div className='flex justify-between items-center px-6 lg:px-16 pb-2'>
        <h1 className='py-2 md:py-3 font-semibold text-center md:text-xl lg:text-2xl sticky top-0 z-[10] bg-white'>Vendor Management</h1>
        <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg font-medium" variant="light" color="primary">
          <Link href={"/dash-board/vendors/add-vendor"}>New Vendors</Link>
        </Button>
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
                  {vendor?.vendorAddress}
                </td>

                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Button onClick={() => router.push(`/dash-board/vendors/${vendor?._id}`)} size="sm" className="text-xs" color="primary" variant="flat">
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteVendor(vendor?._id)} size="sm" className="text-xs" color="danger" variant="flat">
                      Delete
                    </Button>
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