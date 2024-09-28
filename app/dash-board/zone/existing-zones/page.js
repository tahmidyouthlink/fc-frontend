"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useShippingZones from '@/app/hooks/useShippingZones';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const ExistingZones = () => {

  const axiosPublic = useAxiosPublic();
  const [shippingList, isShippingPending, refetch] = useShippingZones();
  const router = useRouter();

  const handleDelete = async (zoneId) => {
    try {
      const res = await axiosPublic.delete(`/deleteShippingZone/${zoneId}`);
      if (res?.data?.deletedCount) {
        refetch();
        toast.success('Shipping Zone deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete shipping zone. Please try again.');
    }
  };

  if (isShippingPending) {
    return <Loading />
  }

  return (
    <div>

      <div className='md:px-5 2xl:px-16 py-4 w-full flex justify-between'>
        <h3 className='text-center md:text-start font-medium md:font-semibold text-[13px] md:text-xl lg:text-2xl'>Existing Shipping Zones</h3>
        <Link className='flex items-center gap-2 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium' href={"/dash-board/zone"}> <FaArrowLeft /> Go Back</Link>
      </div>

      <div className="max-w-screen-2xl mx-auto px-0 md:px-4 lg:px-6 custom-max-h overflow-x-auto modal-body-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-[1] shadow-md">
            <tr>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Zone</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Cities</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Handlers</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Charge</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shippingList?.map((zone, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="text-xs p-3 text-gray-700">
                  {zone?.shippingZone}
                </td>
                <td className="text-xs p-3 text-gray-700">{zone?.selectedCity.join(', ')}</td>
                <td className="text-xs p-3 text-gray-700">
                  {zone?.selectedShipmentHandler.map(handler => handler.shipmentHandlerName).join(', ')}
                </td>
                <td className="text-xs p-3 text-gray-700">৳ {zone?.shippingCharge}</td>
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Button onClick={() => router.push(`/dash-board/zone/${zone?._id}`)} size="sm" className="text-xs" color="primary" variant="flat">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(zone?._id)} size="sm" className="text-xs" color="danger" variant="flat">
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

export default ExistingZones;