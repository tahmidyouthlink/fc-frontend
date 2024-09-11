"use client";
import React, { useMemo, useState } from 'react';
import PromoDetailsModal from './PromoDetailsModal';
import { FaRegEye } from 'react-icons/fa6';
import CustomSwitch from './CustomSwitch';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdOutlineModeEdit } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useOrders from '@/app/hooks/useOrders';
import usePromoCodes from '@/app/hooks/usePromoCodes';
import toast from 'react-hot-toast';
import useOffers from '@/app/hooks/useOffers';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';

const RecentPromotions = () => {

  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [orderList, isOrderPending] = useOrders();
  const [promoList, isPromoPending, refetch] = usePromoCodes();
  const [offerList, isOfferPending, refetchOffer] = useOffers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOption, setSelectedOption] = useState('all'); // New state for dropdown
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

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

  // Memoized active offers
  const activeOffers = useMemo(() => {
    return offerList?.filter(promo => new Date(promo?.expiryDate) >= currentDate);
  }, [offerList, currentDate]);

  // Memoized expired offers
  const expiredOffers = useMemo(() => {
    return offerList?.filter(promo => new Date(promo?.expiryDate) < currentDate);
  }, [offerList, currentDate]);

  // Combined "All" offers
  const allOffers = useMemo(() => {
    return [...(activeOffers || []), ...(expiredOffers || [])];
  }, [activeOffers, expiredOffers]);

  const allItems = useMemo(() => [...(allPromos || []), ...(allOffers || [])], [allPromos, allOffers]);

  // Function to filter based on the search query and tab/dropdown selection
  const filterItems = (items) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item?.promoCode?.toLowerCase().includes(query) ||
      item?.offerTitle?.toLowerCase().includes(query) ||
      item?.expiryDate?.toLowerCase().includes(query) ||
      (item?.promoDiscountValue && item.promoDiscountValue.toString().includes(query)) ||
      (item?.promoDiscountType && item.promoDiscountType.toLowerCase().includes(query)) ||
      (item?.offerDiscountValue && item.offerDiscountValue.toString().includes(query)) ||
      (item?.offerDiscountType && item.offerDiscountType.toLowerCase().includes(query))
    );
  };

  const handleViewClickPromo = (promo) => {
    setSelectedPromo(promo);
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  const handleViewClickOffer = (offer) => {
    setSelectedOffer(offer);
    setSelectedPromo(null);
    setIsModalOpen(true);
  }

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

  const totalOfferApplied = useMemo(() => {
    return orderList?.filter(order => order?.offerTitle === selectedOffer?.offerTitle).length;
  }, [orderList, selectedOffer]);

  const totalOfferAmountDiscounted = useMemo(() => {
    return orderList?.reduce((total, order) => {
      if (order?.offerTitle === selectedOffer?.offerTitle) {
        if (order?.offerDiscountType === 'Percentage') {
          return total + (order?.totalAmount * (order?.offerDiscountValue / 100));
        } else if (order?.offerDiscountType === 'Amount') {
          return total + order?.offerDiscountValue;
        }
      }
      return total;
    }, 0).toFixed(2);
  }, [orderList, selectedOffer]);

  const handleDeletePromo = async (id) => {
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

  const handleDeleteOffer = async (id) => {
    try {
      const res = await axiosPublic.delete(`/deleteOffer/${id}`);
      if (res?.data?.deletedCount) {
        refetchOffer();
        toast.success('Offer deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete offer. Please try again!');
    }
  };

  const handleStatusChangePromo = async (id, currentStatus) => {
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

  const handleStatusChangeOffer = async (id, currentStatus) => {
    try {
      // Find the discount that needs to be updated
      const findDiscount = offerList.find(offer => offer?._id === id);
      if (!findDiscount) {
        toast.error('Offer not found.');
        return;
      }

      // Exclude the _id field from the discount data
      const { _id, ...rest } = findDiscount;
      const discountData = { ...rest, offerStatus: !currentStatus };

      // Send the update request
      const res = await axiosPublic.put(`/updateOffer/${id}`, discountData);
      if (res.data.modifiedCount > 0) {
        toast.success('Status changed successfully!');
        refetchOffer(); // Refetch the promo list to get the updated data
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing status:', error);
      toast.error('Failed to update status. Please try again!');
    }
  };

  // Render the promos/offers table
  const renderItems = (items) => {
    const filteredItems = filterItems(items);

    if (!filteredItems.length) {
      return (
        <tbody>
          <tr>
            <td colSpan="6" className="text-center py-4">No items found</td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredItems.map((item, index) => (
          <tr key={item?._id || index} className="hover:bg-gray-50 transition-colors">
            <td className="text-xs p-3 text-gray-700 font-mono">{item?.promoCode || item?.offerTitle}</td>
            <td className="text-xs p-3 text-gray-700">
              {item?.promoDiscountType
                ? `${item?.promoDiscountValue} ${item?.promoDiscountType === 'Amount' ? 'Tk' : '%'}`
                : item?.offerDiscountType
                  ? `${item?.offerDiscountValue} ${item?.offerDiscountType === 'Amount' ? 'Tk' : '%'}`
                  : 'No Discount'}
            </td>
            <td className="text-xs p-3 text-gray-700">{item?.expiryDate}</td>
            <td className="text-xs p-3 text-gray-700">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="group relative">
                  <button>
                    <MdOutlineModeEdit
                      onClick={() =>
                        item?.promoCode
                          ? router.push(`/dash-board/marketing/promo/${item._id}`) // Edit promo
                          : router.push(`/dash-board/marketing/offer/${item._id}`) // Edit offer
                      }
                      size={22}
                      className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-105 hover:duration-200"
                    />
                  </button>
                  <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                    Edit
                  </span>
                </div>
                <div className="group relative">
                  <button>
                    <RiDeleteBinLine
                      onClick={() =>
                        item?.promoCode
                          ? handleDeletePromo(item._id) // Delete promo
                          : handleDeleteOffer(item._id) // Delete offer
                      }
                      size={22}
                      className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-105 hover:duration-200"
                    />
                  </button>
                  <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                    Delete
                  </span>
                </div>
              </div>
            </td>
            <td className="text-xs p-3 text-gray-700">
              <CustomSwitch
                checked={item?.promoStatus || item?.offerStatus}
                onChange={() =>
                  item?.promoCode
                    ? handleStatusChangePromo(item?._id, item?.promoStatus)
                    : handleStatusChangeOffer(item?._id, item?.offerStatus)
                }
                size="md"
                color="primary"
              />
            </td>
            <td className="text-xs p-3 text-gray-700 cursor-pointer">
              <div className="group relative">
                <button>
                  <FaRegEye
                    onClick={() =>
                      item?.promoCode
                        ? handleViewClickPromo(item) // Pass promo details if promoCode exists
                        : handleViewClickOffer(item) // Pass offer details if promoCode does not exist
                    }
                    size={22}
                    className="hover:text-red-700 transition-transform transform hover:scale-105 hover:duration-200"
                  />
                </button>

                <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                  Preview
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  // Handle the dropdown change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setActiveTab('all'); // Reset the active tab when switching between promos and offers
  };

  const itemsToRender = () => {
    if (selectedOption === 'promos') {
      return activeTab === 'all' ? allPromos : activeTab === 'active' ? activePromos : expiredPromos;
    } else if (selectedOption === 'offers') {
      return activeTab === 'all' ? allOffers : activeTab === 'active' ? activeOffers : expiredOffers;
    } else {
      return allItems;  // "all" includes both promos and offers combined
    }
  };

  // Use the new itemsToRender function when rendering
  const filteredItems = filterItems(itemsToRender());

  const renderHeading = () => {
    switch (selectedOption) {
      case "offers":
        return "Offer Title";
      case "promos":
        return "Promo Code";
      default:
        return "Promo Code / Offer Title";
    }
  };

  if (isPromoPending || isOrderPending || isOfferPending) {
    return <SmallHeightLoading />;
  }

  return (
    <>
      <div className='flex justify-between items-center gap-6 mb-6 pr-4'>
        <div className="flex-1 flex flex-col gap-4">
          <select
            value={selectedOption}
            onChange={handleOptionChange}
            className="border p-3 rounded-lg max-w-sm h-[44px] md:h-12 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="promos">Promos</option>
            <option value="offers">Offers</option>
          </select>
        </div>

        {/* Search Product Item */}
        <li className="flex-1 flex items-center relative group">
          <svg className="absolute left-4 fill-[#9e9ea7] w-4 h-4 icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            type="search"
            placeholder="Search By Order Details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base"
          />
        </li>
      </div>

      {/* Conditionally render the tabs only if "All" is NOT selected */}
      {selectedOption !== 'all' && (
        <div className="flex space-x-4">
          <button
            className={`relative px-4 py-2 transition-all duration-300 ${activeTab === 'all' ? 'text-[#9F5216] font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#9F5216] hover:text-[#9F5216] after:transition-all after:duration-300 ${activeTab === 'all' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
            onClick={() => setActiveTab('all')}
          >
            {selectedOption === 'promos' ? `All Promos (${allPromos.length})` : `All Offers (${allOffers.length})`}
          </button>
          <button
            className={`relative px-4 py-2 transition-all duration-300 ${activeTab === 'active' ? 'text-[#9F5216] font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#9F5216] hover:text-[#9F5216] after:transition-all after:duration-300 ${activeTab === 'active' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
            onClick={() => setActiveTab('active')}
          >
            {selectedOption === 'promos' ? `Active Promos (${activePromos.length})` : `Active Offers (${activeOffers.length})`}
          </button>
          <button
            className={`relative px-4 py-2 transition-all duration-300 ${activeTab === 'expired' ? 'text-[#9F5216] font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#9F5216] hover:text-[#9F5216] after:transition-all after:duration-300 ${activeTab === 'expired' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
            onClick={() => setActiveTab('expired')}
          >
            {selectedOption === 'promos' ? `Used Promos (${expiredPromos.length})` : `Used Offers (${expiredOffers.length})`}
          </button>
        </div>
      )}


      <div className="max-w-screen-2xl mx-auto custom-max-discount overflow-x-auto my-4 modal-body-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-[1] rounded-md">
            <tr>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">{renderHeading()}</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Discount</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Expiry Date</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Actions</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Status</th>
              <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Preview</th>
            </tr>
          </thead>

          {/* Conditional rendering based on the selected tab and dropdown */}
          {renderItems(filteredItems)}
        </table>
      </div>


      {/* Promo Details Modal */}
      <PromoDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        totalPromoApplied={selectedPromo ? totalPromoApplied : null}
        totalAmountDiscounted={selectedPromo ? totalAmountDiscounted : null}
        totalOfferApplied={selectedOffer ? totalOfferApplied : null}  // New prop for total offers applied
        totalOfferAmountDiscounted={selectedOffer ? totalOfferAmountDiscounted : null}  // New prop for total offer amount discounted
        promo={selectedPromo}
        offer={selectedOffer}  // Passing the selected offer
      />
    </>
  );
};

export default RecentPromotions;