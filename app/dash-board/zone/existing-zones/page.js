"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useShippingZones from '@/app/hooks/useShippingZones';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const ExistingZones = () => {

  const axiosPublic = useAxiosPublic();
  const [shippingList, isShippingPending, refetch] = useShippingZones();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [zoneId, setZoneId] = useState(null);

  const handleDelete = async (zoneId) => {
    try {
      const res = await axiosPublic.delete(`/deleteShippingZone/${zoneId}`);
      if (res?.data?.deletedCount) {
        refetch(); // Call your refetch function to refresh data
        toast.success('Shipment deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete shipping zone. Please try again.');
    }
  };

  const confirmDelete = () => {
    if (zoneId) {
      handleDelete(zoneId);
    }
    onOpenChange(false); // Close the modal
    setZoneId(null); // Reset the zoneId
  };

  const openModal = (id) => {
    setZoneId(id); // Set the zoneId for the deletion
    onOpen(); // Open the modal
  };

  if (isShippingPending) {
    return <Loading />
  }

  return (
    <div>

      <div className='px-5 2xl:px-16 py-4 w-full flex justify-between'>
        <h3 className='text-start font-medium md:font-semibold text-[14px] md:text-xl lg:text-2xl w-full'>Shipping Management</h3>
        <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/zone"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
      </div>

      <div className="max-w-screen-2xl mx-auto px-0 md:px-4 lg:px-6 custom-max-h overflow-x-auto modal-body-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-[1] shadow-md">
            <tr>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Zone</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Cities</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Handlers</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Charge</th>
              <th className="text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Hour</th>
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
                  {zone?.selectedShipmentHandler?.shipmentHandlerName}
                </td>
                <td className="text-xs p-3 text-gray-700">
                  {zone?.selectedShipmentHandler?.deliveryType.map((type, idx) => (
                    <div key={idx}>
                      {type}: ৳ {zone?.shippingCharges[type]}
                    </div>
                  ))}
                </td>
                <td className="text-xs p-3 text-gray-700">
                  {zone?.selectedShipmentHandler?.deliveryType.map((type, idx) => (
                    <div key={idx}>
                      {type}: {zone?.shippingHours[type]} Hours
                    </div>
                  ))}
                </td>

                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Button onClick={() => router.push(`/dash-board/zone/${zone?._id}`)} size="sm" className="text-xs" color="primary" variant="flat">
                      Edit
                    </Button>

                    <Button size="sm" className="text-xs" color="danger" variant="flat" onPress={() => openModal(zone?._id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody className='modal-body-scroll'>
                <p>Are you sure you want to delete this Shipment?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" size="sm" variant="flat" onPress={confirmDelete}>
                  Yes
                </Button>
                <Button variant="flat" size="sm" onPress={onClose}>
                  No
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ExistingZones;