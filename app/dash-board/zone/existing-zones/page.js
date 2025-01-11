"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useShippingZones from '@/app/hooks/useShippingZones';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';

const ExistingZones = () => {

  const axiosPublic = useAxiosPublic();
  const [shippingList, isShippingPending, refetch] = useShippingZones();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inside dhaka');

  const dhakaSuburbs = ["Savar", "Nabinagar", "Ashulia", "Keraniganj", "Tongi", "Gazipur", "Narayanganj"];

  // Filter data based on the active tab
  const filteredShippingList = shippingList?.filter((zone) => {
    if (activeTab === "inside dhaka") {
      return zone?.selectedCity?.includes("Dhaka");
    }
    if (activeTab === "dhaka suburbs") {
      return zone?.selectedCity?.some((city) => dhakaSuburbs.includes(city));
    }
    if (activeTab === "outside dhaka") {
      return !zone?.selectedCity?.includes("Dhaka") &&
        !zone?.selectedCity?.some((city) => dhakaSuburbs.includes(city));
    }
    return false;
  });

  // Ensure the code runs only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTabForShippingManagementPage');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Save the activeTab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTabForShippingManagementPage', activeTab);
    }
  }, [activeTab]);

  const handleDelete = async (zoneId) => {
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
          const res = await axiosPublic.delete(`/deleteShippingZone/${zoneId}`);
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
                        Shipment Removed!
                      </p>
                      <p className="mt-1 text-base text-gray-500">
                        Shipment Handler deleted successfully!
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
          toast.error('Failed to delete shipping zone. Please try again.');
        }
      }
    });
  };

  if (isShippingPending) {
    return <Loading />
  }

  return (
    <div className='px-5 2xl:px-16'>

      <div className='py-4 w-full flex justify-between'>
        <h3 className='text-start font-medium md:font-semibold text-[14px] md:text-2xl lg:text-3xl w-full'>Shipping Management</h3>
        <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/zone"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
      </div>

      <div className='flex flex-wrap items-center gap-3 bg-white pt-2'>
        <button
          className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'inside dhaka' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 hover:text-[#D2016E] after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'inside dhaka' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
          onClick={() => setActiveTab('inside dhaka')}
        >
          Inside Dhaka
        </button>

        <button
          className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'dhaka suburbs' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 hover:text-[#D2016E] after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'dhaka suburbs' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
          onClick={() => setActiveTab('dhaka suburbs')}
        >
          Dhaka Suburbs
        </button>

        <button
          className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'outside dhaka' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
        after:absolute after:left-0 after:right-0 hover:text-[#D2016E] after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] after:transition-all after:duration-300
        ${activeTab === 'outside dhaka' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
          onClick={() => setActiveTab('outside dhaka')}
        >
          Outside Dhaka
        </button>
      </div>

      <div className="pt-2">

        <p className="pt-1 pb-4 text-neutral-800 font-semibold">
          {activeTab === "inside dhaka"
            ? "Only Dhaka"
            : activeTab === "dhaka suburbs"
              ? "Savar, Nabinagar, Ashulia, Keraniganj, Tongi"
              : "Nationwide Areas Only without Dhaka"}
        </p>

        <div className="custom-max-h overflow-x-auto modal-body-scroll mt-3">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-[1] shadow-md">
              <tr>
                <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                  Shipping Zone
                </th>
                <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                  Shipping Handlers
                </th>
                <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                  Shipping Charge
                </th>
                <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                  Shipping Hour
                </th>
                <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShippingList?.map((zone, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                    {zone?.shippingZone}
                  </td>
                  <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                    {zone?.selectedShipmentHandler?.shipmentHandlerName}
                  </td>
                  <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                    {zone?.selectedShipmentHandler?.deliveryType.map((type, idx) => (
                      <div key={idx}>
                        {type}: ৳ {zone?.shippingCharges[type]}
                      </div>
                    ))}
                  </td>
                  <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                    {zone?.selectedShipmentHandler?.deliveryType.map((type, idx) => (
                      <div key={idx}>
                        {type}: {zone?.shippingDurations[type]} {type === "EXPRESS" ? "hours" : "days"}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={() => router.push(`/dash-board/zone/${zone?._id}`)}
                        size="md"
                        className="text-xs md:text-sm font-medium"
                        neutral-95text-neutral-950 color="primary"
                        variant="flat"
                      >
                        Edit
                      </Button>

                      <Button
                        size="md"
                        className="text-xs md:text-sm font-medium"
                        neutral-95text-neutral-950 color="danger"
                        variant="flat"
                        onPress={() => handleDelete(zone?._id)}
                      >
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

    </div>
  );
};

export default ExistingZones;