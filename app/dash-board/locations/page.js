"use client";
import CustomSwitch from '@/app/components/layout/CustomSwitch';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useLocations from '@/app/hooks/useLocations';
import { Button, Checkbox } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from "react-icons/fa6";
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';

const LocationsPage = () => {

  const [locationList, isLocationPending, refetch] = useLocations();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  const handleDeleteLocation = async (locationId) => {
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
          const res = await axiosPublic.delete(`/deleteLocation/${locationId}`);
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
                        Location Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Location has been deleted successfully!
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
          toast.error('Failed to delete Location. Please try again.');
        }
      }
    });
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      // Find the discount that needs to be updated
      const findLocation = locationList?.find(location => location?._id === id);
      if (!findLocation) {
        toast.error('Location not found.');
        return;
      }

      // Exclude the _id field from the discount data
      const { _id, ...rest } = findLocation;
      const locationData = { ...rest, status: !currentStatus };

      // Send the update request
      const res = await axiosPublic.put(`/updateLocation/${id}`, locationData);
      if (res.data.modifiedCount > 0) {
        await refetch(); // Refetch the promo list to get the updated data
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
                    Location Updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Location updated successfully!
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
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing status:', error);
      toast.error('Failed to update status. Please try again!');
    }
  };

  if (isLocationPending) {
    return <Loading />
  }

  return (
    <div>

      <div className='flex justify-between items-center px-6 lg:px-16 py-3'>
        <h1 className='py-2 md:py-3 font-semibold text-center md:text-xl lg:text-2xl sticky top-0 z-[10] bg-white'>Location Management</h1>
        <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg font-medium" variant="light" color="primary">
          <Link className='flex items-center gap-2' href={"/dash-board/locations/add-location"}> <FaPlus size={14} /> <span>Add Location</span></Link>
        </Button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-0 md:px-4 lg:px-6 custom-max-h overflow-x-auto modal-body-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-[1] shadow-md">
            <tr>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Location Name</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Location Address</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Actions</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

            {locationList?.sort((a, b) => b.isPrimaryLocation - a.isPrimaryLocation)?.map((location, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">

                {/* Conditional color for Location Name */}
                <td className={`text-xs p-3 ${location?.isPrimaryLocation ? 'font-bold text-green-500 flex items-center justify-start mt-2' : 'text-gray-700'}`}>
                  {/* Checkbox for isPrimaryLocation */}
                  {location?.isPrimaryLocation && (
                    <p>
                      <Checkbox
                        isSelected={true}
                        color="success"
                      />
                    </p>
                  )}
                  {location?.locationName}
                </td>

                <td className={`text-xs p-3 ${location?.isPrimaryLocation ? 'font-bold text-green-500' : 'text-gray-700'}`}>
                  {location?.locationAddress},{location?.cityName},{location?.postalCode}
                </td>

                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Button
                      onClick={() => router.push(`/dash-board/locations/${location?._id}`)}
                      size="sm"
                      className="text-xs"
                      color="primary"
                      variant="flat">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs"
                      color="danger"
                      variant="flat"
                      onClick={() => handleDeleteLocation(location?._id)}>
                      Delete
                    </Button>
                  </div>
                </td>

                <td key="status" className="text-xs p-3 text-gray-700">
                  <CustomSwitch
                    checked={location?.status}
                    onChange={() => handleStatusChange(location?._id, location?.status)}
                    size="md"
                    color="primary"
                  />
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

    </div>
  );
};

export default LocationsPage;