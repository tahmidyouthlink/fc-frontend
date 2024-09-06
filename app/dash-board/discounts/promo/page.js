"use client";
import React, { useMemo, useState } from 'react';
import CustomSwitch from '@/app/components/layout/CustomSwitch';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import usePromoCodes from '@/app/hooks/usePromoCodes';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import useOrders from '@/app/hooks/useOrders';
import PromoDetailsModal from '@/app/components/layout/PromoDetailsModal';

const PromoPage = () => {
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [orderList, isOrderPending] = useOrders();
  const [promoList, isPromoPending, refetch] = usePromoCodes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Memoized current date
  const currentDate = useMemo(() => new Date(), []);

  // Memoized active promos
  const activePromos = useMemo(() => {
    return promoList?.filter(promo => new Date(promo?.expiryDate) >= currentDate);
  }, [promoList, currentDate]);

  // Memoized expired promos
  const expiredPromos = useMemo(() => {
    return promoList?.filter(promo => new Date(promo?.expiryDate) < currentDate);
  }, [promoList, currentDate]);

  // Combined "All" promos
  const allPromos = useMemo(() => {
    return [...(activePromos || []), ...(expiredPromos || [])];
  }, [activePromos, expiredPromos]);

  const handleViewClick = (promo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const totalPromoApplied = useMemo(() => {
    return orderList?.filter(order => order?.promoCode === selectedPromo?.promoCode).length;
  }, [orderList, selectedPromo]);

  const totalAmountDiscounted = useMemo(() => {
    return orderList?.reduce((total, order) => {
      if (order?.promoCode === selectedPromo?.promoCode) {
        if (order?.promoDiscountType === 'Percentage') {
          return total + (order?.totalAmount * (order?.promoDiscountValue / 100));
        } else if (order?.promoDiscountType === 'Amount') {
          return total + order?.promoDiscountValue;
        }
      }
      return total;
    }, 0).toFixed(2);
  }, [orderList, selectedPromo]);

  const handleDelete = async (id) => {
    try {
      const res = await axiosPublic.delete(`/deletePromo/${id}`);
      if (res?.data?.deletedCount) {
        refetch();
        toast.success('Promo deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete promo. Please try again!');
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      // Find the discount that needs to be updated
      const findDiscount = promoList.find(promo => promo?._id === id);
      if (!findDiscount) {
        toast.error('Promo not found.');
        return;
      }

      // Exclude the _id field from the discount data
      const { _id, ...rest } = findDiscount;
      const discountData = { ...rest, promoStatus: !currentStatus };

      // Send the update request
      const res = await axiosPublic.put(`/updatePromo/${id}`, discountData);
      if (res.data.modifiedCount > 0) {
        toast.success('Status changed successfully!');
        refetch(); // Refetch the promo list to get the updated data
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing status:', error);
      toast.error('Failed to update status. Please try again!');
    }
  };

  if (isPromoPending || isOrderPending) {
    return <Loading />;
  }

  const renderPromos = (promos) => {
    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {promos?.map((promo, index) => (
          <tr key={promo?._id || index} className="hover:bg-gray-50 transition-colors">
            <td className="text-xs p-3 text-gray-700 font-mono">
              {promo?.promoCode}
            </td>
            <td className="text-xs p-3 text-gray-700">
              {promo?.promoDiscountValue} {promo?.promoDiscountType === 'Amount' ? 'Tk' : '%'}
            </td>
            <td className="text-xs p-3 text-gray-700">
              {promo?.expiryDate}
            </td>
            <td className="text-xs p-3 text-gray-700">
              <div className="flex items-center gap-3 cursor-pointer">
                <div class="group relative">
                  <button>
                    <MdOutlineModeEdit onClick={() => router.push(`/dash-board/discounts/promo/${promo._id}`)} size={22} className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-105 hover:duration-200" />
                  </button>
                  <span
                    class="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100"
                  >Edit <span> </span
                  ></span>
                </div>
                <div class="group relative">
                  <button>
                    <RiDeleteBinLine onClick={() => handleDelete(promo._id)} size={22} className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-105 hover:duration-200" />
                  </button>
                  <span
                    class="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100"
                  >Delete <span> </span
                  ></span>
                </div>

              </div>
            </td>
            <td className="text-xs p-3 text-gray-700">
              <CustomSwitch
                checked={promo?.promoStatus}
                onChange={() => handleStatusChange(promo?._id, promo?.promoStatus)}
                size="md"
                color="primary"
              />
            </td>
            <td className="text-xs p-3 text-gray-700 cursor-pointer">
              <div class="group relative">
                <button>
                  <FaRegEye onClick={() => handleViewClick(promo)} size={22} className='hover:text-red-700 hover:transition hover:scale-105 hover:duration-200' />
                </button>
                <span
                  class="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100"
                >Preview <span> </span
                ></span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };


  return (
    <div className='px-0 md:px-6'>
      <div className='flex flex-col-reverse lg:flex-row items-center justify-between px-6 max-w-screen-2xl mx-auto my-6 gap-6'>

        <div className="flex space-x-0 md:space-x-4 border-b mb-4 text-xs md:text-base">
          <button
            className={`relative py-2 px-4 font-medium transition-all duration-300
      ${activeTab === 'all' ? 'text-blue-600' : 'text-gray-600'}
      after:absolute after:left-0 after:right-0 after:bottom-0 
      after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
      ${activeTab === 'all' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
    `}
            onClick={() => setActiveTab('all')}
          >
            All ({allPromos?.length || 0})
          </button>

          <button
            className={`relative py-2 px-4 font-medium transition-all duration-300
      ${activeTab === 'active' ? 'text-blue-600' : 'text-gray-600'}
      after:absolute after:left-0 after:right-0 after:bottom-0 
      after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
      ${activeTab === 'active' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
    `}
            onClick={() => setActiveTab('active')}
          >
            Active Promos ({activePromos?.length || 0})
          </button>

          <button
            className={`relative py-2 px-4 font-medium transition-all duration-300
      ${activeTab === 'expired' ? 'text-blue-600' : 'text-gray-600'}
      after:absolute after:left-0 after:right-0 after:bottom-0 
      after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
      ${activeTab === 'expired' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
    `}
            onClick={() => setActiveTab('expired')}
          >
            Used Promos ({expiredPromos?.length || 0})
          </button>
        </div>

        <Button onClick={() => router.push('/dash-board/discounts/promo/add-promo')} className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium'>
          Create a new Promo
        </Button>

      </div>


      <div className="max-w-screen-2xl mx-auto custom-max-discount overflow-x-auto px-2 md:px-6 my-4 modal-body-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-[1] rounded-md">
            <tr>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Promo Code</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Discount</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Expiry Date</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Actions</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Promo Status</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">View</th>
            </tr>
          </thead>
          {activeTab === 'all' && renderPromos(allPromos)}
          {activeTab === 'active' && renderPromos(activePromos)}
          {activeTab === 'expired' && renderPromos(expiredPromos)}
        </table>
      </div>

      {/* Promo Details Modal */}
      <PromoDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        totalPromoApplied={totalPromoApplied}
        totalAmountDiscounted={totalAmountDiscounted}
        promo={selectedPromo}
      />

    </div>
  );
};

export default PromoPage;