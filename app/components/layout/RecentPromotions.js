import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
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
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';
import { Button, Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const RecentPromotions = () => {

  const dropdownRef = useRef(null);
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [orderList, isOrderPending] = useOrders();
  const [promoList, isPromoPending, refetchPromo] = usePromoCodes();
  const [offerList, isOfferPending, refetchOffer] = useOffers();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOption, setSelectedOption] = useState('all'); // New state for dropdown
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  // const [isExpanded, setIsExpanded] = useState(null); // To track which row is expanded
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const initialColumns = ["Promo Code / Offer Title", "Type", "Discount Value", "Expiry Date", "Total Times Applied", "Total Discount Given", "Min Order Amount", "Max Capped Amount", "Actions", "Status"];
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOrder, setColumnOrder] = useState(initialColumns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedMarketing'));
    const savedMarketingColumns = JSON.parse(localStorage.getItem('selectedMarketingColumns'));
    if (savedColumns) {
      setSelectedColumns(savedColumns);
    }
    if (savedMarketingColumns) {
      setColumnOrder(savedMarketingColumns);
    }
  }, []);

  const handleColumnChange = (selected) => {
    setSelectedColumns(selected);
  };

  const handleSelectAll = () => {
    setSelectedColumns(initialColumns);
    setColumnOrder(initialColumns);
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
    setColumnOrder([]);
  };

  const handleSave = () => {
    localStorage.setItem('selectedMarketing', JSON.stringify(selectedColumns));
    localStorage.setItem('selectedMarketingColumns', JSON.stringify(columnOrder));
    setColumnModalOpen(false);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columnOrder);
    const [draggedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, draggedColumn);

    setColumnOrder(reorderedColumns); // Update the column order both in modal and table
  };

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

  const allItems = useMemo(() => {
    const combinedItems = [
      ...(promoList || []), // Contains all promos
      ...(offerList || []), // Contains all offers
    ];

    // Sort combined items by _id (MongoDB ObjectId) or createdAt field
    return combinedItems.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);

      return dateB - dateA; // Newest first
    });
  }, [promoList, offerList]);

  const calculateTotalPromoApplied = (promoCode) => {
    return orderList?.filter(order => order.promoCode === promoCode && order.paymentStatus === "Paid").length || 0;
  };

  const calculateTotalAmountDiscounted = (promoCode) => {
    const totalDiscount = orderList?.reduce((acc, order) => {
      if (order.promoCode !== promoCode || order.paymentStatus !== "Paid") return acc; // Check for payment status

      let offerDiscountTotal = 0;
      order.productInformation.forEach(product => {
        if (product.offerTitle && product.offerDiscountValue > 0) {
          const productTotal = product.unitPrice * product.sku;
          if (product.offerDiscountType === 'Percentage') {
            offerDiscountTotal += (product.offerDiscountValue / 100) * productTotal;
          } else if (product.offerDiscountType === 'Amount') {
            offerDiscountTotal += product.offerDiscountValue;
          }
        }
      });

      const adjustedOrderTotal = order.totalAmount - offerDiscountTotal;
      let promoDiscount = 0;
      if (order.promoDiscountType === 'Percentage') {
        promoDiscount = (order.promoDiscountValue / 100) * adjustedOrderTotal;
      } else if (order.promoDiscountType === 'Amount') {
        promoDiscount = order.promoDiscountValue;
      }

      return acc + promoDiscount;
    }, 0) || 0;

    return totalDiscount.toFixed(2);
  };

  const calculateTotalOfferApplied = (offerTitle) => {
    return orderList?.reduce((count, order) => {
      const offerCount = (order.paymentStatus === "Paid" && order.productInformation.filter(
        product => product.offerTitle === offerTitle
      ).length) || 0; // Check for payment status
      return count + offerCount;
    }, 0) || 0;
  };

  const calculateTotalOfferAmountDiscounted = (offerTitle) => {
    const totalDiscount = orderList?.reduce((acc, order) => {
      if (order.paymentStatus !== "Paid") return acc; // Check for payment status

      const offerDiscountTotal = order.productInformation.reduce((prodAcc, product) => {
        if (product.offerTitle !== offerTitle) return prodAcc;

        const productSubtotal = product.unitPrice * product.sku;
        let discount = 0;

        if (product.offerDiscountType === 'Percentage') {
          discount = (product.offerDiscountValue / 100) * productSubtotal;
        } else if (product.offerDiscountType === 'Amount') {
          discount = product.offerDiscountValue;
        }

        return prodAcc + discount;
      }, 0);

      return acc + offerDiscountTotal;
    }, 0) || 0;

    return totalDiscount.toFixed(2);
  };

  const getProductTitlesForPromo = (promoCode) => {
    const productTitles = [];

    orderList.forEach(order => {
      if (order.promoCode === promoCode && order.paymentStatus === "Paid") { // Check for payment status
        order.productInformation.forEach(product => {
          productTitles.push(product.productTitle); // Adjust this to your actual product title field
        });
      }
    });

    return productTitles;
  };

  const getProductTitlesForOffer = (offerTitle) => {
    const productTitles = [];

    orderList.forEach(order => {
      if (order.paymentStatus === "Paid") { // Check for payment status
        order.productInformation.forEach(product => {
          if (product.offerTitle === offerTitle) {
            productTitles.push(product.productTitle); // Adjust this to your actual product title field
          }
        });
      }
    });

    return productTitles;
  };

  // Function to filter based on the search query and tab/dropdown selection
  const filterItems = (items) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();

    return items.filter(item => {

      // Get calculated totals for promo/offer
      const totalPromoApplied = item?.promoCode ? calculateTotalPromoApplied(item.promoCode) : 0;
      const totalAmountDiscounted = item?.promoCode ? calculateTotalAmountDiscounted(item.promoCode) : '0.00';
      const totalOfferApplied = item?.offerTitle ? calculateTotalOfferApplied(item.offerTitle) : 0;
      const totalOfferAmountDiscounted = item?.offerTitle ? calculateTotalOfferAmountDiscounted(item.offerTitle) : '0.00';

      // Get product titles for promo and offer
      const promoProductTitles = getProductTitlesForPromo(item.promoCode);
      const offerProductTitles = getProductTitlesForOffer(item.offerTitle);

      // Check for product titles in the search query
      const productTitleMatch = promoProductTitles.some(title => title.toLowerCase().includes(query)) ||
        offerProductTitles.some(title => title.toLowerCase().includes(query));

      // Return true if any of the item's details or calculated values match the query
      return (
        item?.promoCode?.toLowerCase().includes(query) ||
        item?.offerTitle?.toLowerCase().includes(query) ||
        item?.expiryDate?.toLowerCase().includes(query) ||
        item?.minAmount?.toString().includes(query) ||
        item?.maxAmount?.toString().includes(query) ||
        (item?.promoDiscountValue && item.promoDiscountValue.toString().includes(query)) ||
        (item?.promoDiscountType && item.promoDiscountType.toLowerCase().includes(query)) ||
        (item?.offerDiscountValue && item.offerDiscountValue.toString().includes(query)) ||
        (item?.offerDiscountType && item.offerDiscountType.toLowerCase().includes(query)) ||
        totalPromoApplied.toString().includes(query) ||
        totalAmountDiscounted.toString().includes(query) ||
        totalOfferApplied.toString().includes(query) ||
        totalOfferAmountDiscounted.toString().includes(query) ||
        productTitleMatch // Check for product titles
      );
    });
  };

  // const handleViewClick = (item) => {
  //   setIsExpanded((prev) => (prev === item._id ? null : item._id)); // Use correct identifier for expansion
  // };

  const handleDeletePromo = async (id) => {
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
          const res = await axiosPublic.delete(`/deletePromo/${id}`);
          if (res?.data?.deletedCount) {
            refetchPromo();
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
                        Promo Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        The promo has been successfully deleted!
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
          toast.error('Failed to delete promo. Please try again!');
        }
      }
    });
  };

  const handleDeleteOffer = async (id) => {
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
          const res = await axiosPublic.delete(`/deleteOffer/${id}`);
          if (res?.data?.deletedCount) {
            refetchOffer();
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
                        Offer Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        The offer has been successfully deleted!
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
          toast.error('Failed to delete offer. Please try again!');
        }
      }
    });
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
        await refetchPromo(); // Refetch the promo list to get the updated data
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
                    Status Updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Status updated successfully!
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
        refetchOffer(); // Refetch the promo list to get the updated data
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
                    Status Updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Status updated successfully!
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

  // Render the promos/offers table
  const renderItems = (items) => {
    const filteredItems = filterItems(items);

    if (!filteredItems.length) {
      return (
        <tbody>
          <tr>
            <td colSpan="12" className="text-center py-4">No items found</td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredItems.map((item, index) => {
          const isExpired = new Date(item?.expiryDate) < currentDate;
          // const isExpandedItem = isExpanded === item._id;

          const totalPromoApplied = item?.promoCode
            ? calculateTotalPromoApplied(item?.promoCode)
            : 0;

          const totalAmountDiscounted = item?.promoCode
            ? calculateTotalAmountDiscounted(item?.promoCode)
            : '0.00';

          const totalOfferApplied = item?.offerTitle
            ? calculateTotalOfferApplied(item?.offerTitle)
            : 0;

          const totalOfferAmountDiscounted = item?.offerTitle
            ? calculateTotalOfferAmountDiscounted(item?.offerTitle)
            : '0.00';

          return (
            <>
              <tr key={item?._id || index} className="hover:bg-gray-50 transition-colors">
                {columnOrder.map((column) =>
                  selectedColumns.includes(column) && (
                    <>
                      {column === 'Promo Code / Offer Title' && (
                        <td key="promoCodeOfferTitle" className="text-xs p-3 text-gray-700">
                          {item?.promoCode || item?.offerTitle}
                        </td>
                      )}
                      {column === 'Type' && (
                        <td key="type" className="text-xs p-3 text-gray-700">
                          {item?.promoCode ? 'Promo' : 'Offer'}
                        </td>
                      )}
                      {column === 'Discount Value' && (
                        <td key="discountValue" className="text-xs p-3 text-gray-700">
                          {item?.promoDiscountType
                            ? `${item?.promoDiscountValue} ${item?.promoDiscountType === 'Amount' ? 'Tk' : '%'}`
                            : item?.offerDiscountType
                              ? `${item?.offerDiscountValue} ${item?.offerDiscountType === 'Amount' ? 'Tk' : '%'}`
                              : 'No Discount'}
                        </td>
                      )}
                      {column === 'Expiry Date' && (
                        <td key="expiryDate" className="text-xs p-3 text-gray-700">
                          {item?.expiryDate}
                        </td>
                      )}
                      {column === 'Total Times Applied' && (
                        <td
                          key="totalTimesApplied"
                          className="text-xs p-3 font-mono cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            const searchParam = item?.promoCode ? `promo=${item.promoCode}` : `offer=${item.offerTitle}`;
                            router.push(`/dash-board/orders?${searchParam}`);
                          }}
                        >
                          {item?.promoCode
                            ? `${totalPromoApplied} ${totalPromoApplied === 1 ? "Order" : "Orders"}`
                            : `${totalOfferApplied} ${totalOfferApplied === 1 ? "Order" : "Orders"}`}
                        </td>
                      )}
                      {column === 'Total Discount Given' && (
                        <td key="totalDiscountGiven" className="text-xs p-3 text-gray-700">
                          {item?.promoCode
                            ? `৳ ${totalAmountDiscounted}`
                            : `৳ ${totalOfferAmountDiscounted}`}
                        </td>
                      )}
                      {column === 'Min Order Amount' && (
                        <td key="minOrderAmount" className="text-xs p-3 text-gray-700">
                          ৳ {item?.minAmount || '0'}
                        </td>
                      )}
                      {column === 'Max Capped Amount' && (
                        <td key="maxCappedAmount" className="text-xs p-3 text-gray-700">
                          ৳ {item?.maxAmount || '0'}
                        </td>
                      )}
                      {column === 'Actions' && (
                        <td key="actions" className="text-xs p-3 text-gray-700">
                          <div className="flex items-center gap-3 cursor-pointer">
                            <div className="group relative">
                              <button disabled={isExpired}>
                                <MdOutlineModeEdit
                                  onClick={() =>
                                    item?.promoCode
                                      ? router.push(`/dash-board/marketing/promo/${item._id}`)
                                      : router.push(`/dash-board/marketing/offer/${item._id}`)
                                  }
                                  size={22}
                                  className={`text-blue-500 ${isExpired ? 'cursor-not-allowed' : 'hover:text-blue-700 transition-transform transform hover:scale-105 hover:duration-200'}`}
                                />
                              </button>
                              {!isExpired && <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">Edit</span>}
                            </div>
                            <div className="group relative">
                              <button disabled={isExpired}>
                                <RiDeleteBinLine
                                  onClick={() =>
                                    item?.promoCode
                                      ? handleDeletePromo(item._id)
                                      : handleDeleteOffer(item._id)
                                  }
                                  size={22}
                                  className={`text-red-500 ${isExpired ? 'cursor-not-allowed' : 'hover:text-red-700 transition-transform transform hover:scale-105 hover:duration-200'}`}
                                />
                              </button>
                              {!isExpired && <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">Delete</span>}
                            </div>
                          </div>
                        </td>
                      )}
                      {column === 'Status' && (
                        <td key="status" className="text-xs p-3 text-gray-700">
                          <CustomSwitch
                            checked={item?.promoCode ? item?.promoStatus : item?.offerStatus}
                            onChange={() => item?.promoCode ? handleStatusChangePromo(item?._id, item?.promoStatus) : handleStatusChangeOffer(item?._id, item?.offerStatus)}
                            size="md"
                            color="primary"
                            disabled={isExpired}
                          />
                        </td>
                      )}
                    </>
                  )
                )}
                {/* {selectedColumns.includes('Preview') && (
                  <td className="text-xs p-3 text-gray-700 cursor-pointer">
                    <button onClick={() =>
                      handleViewClick(item)
                    }>
                      {isExpandedItem ? <FaAngleUp className='hover:text-red-600' size={22} /> : <FaAngleDown className='hover:text-red-600' size={22} />}
                    </button>
                  </td>
                )} */}
              </tr>
              {/* {isExpandedItem && (
                <tr>
                  <td colSpan="12" className="p-4 bg-gray-100">
                    <div className="text-sm">
                      {item?.promoCode ? (
                        <>
                          <p>
                            Total Times Applied:

                            {totalPromoApplied === 0
                              ? " No Orders"
                              : ` ${totalPromoApplied} ${totalPromoApplied === 1 ? " Order" : " Orders"}`}
                          </p>
                          <p>Total Amount Discounted : ৳ {totalAmountDiscounted}</p>
                          <p>Minimum Order Amount : ৳ {item?.minAmount || '0'}</p>
                          <p>Maximum Capped Amount : ৳ {item?.maxAmount || '0'}</p>
                        </>
                      ) : (
                        <>
                          <p>
                            Total Times Applied:
                            {totalOfferApplied === 0
                              ? " No Orders"
                              : ` ${totalOfferApplied} ${totalOfferApplied === 1 ? " Order" : " Orders"}`}
                          </p>
                          <p>Total Amount Discounted : ৳ {totalOfferAmountDiscounted}</p>
                          <p>Minimum Order Amount : ৳ {item?.minAmount || '0'}</p>
                          <p>Maximum Capped Amount : ৳ {item?.maxAmount || '0'}</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )} */}
            </>
          )
        })}
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
      // Combined promos and offers sorted by creation date
      return allItems;
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

  const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        <div ref={dropdownRef} className="relative inline-block text-left">
          <Button onClick={toggleDropdown} className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
            Customize
            <svg
              className={`-mr-1 ml-2 h-5 w-5 transform transition-transform duration-300 ${isOpenDropdown ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>

          {isOpenDropdown && (
            <div className="absolute right-0 z-10 mt-2 w-64 md:w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1">


                <div className="py-1">
                  <Button variant="solid" color="danger" onClick={() => { setColumnModalOpen(true) }} className="w-full">
                    Choose Columns
                  </Button>
                </div>

              </div>
            </div>
          )}
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
            placeholder="Search By Promo/Offer Details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#D2016E]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#D2016E]/30 hover:bg-white hover:shadow-[#D2016E]/30 text-[12px] md:text-base"
          />
        </li>
      </div>

      {/* Conditionally render the tabs only if "All" is NOT selected */}
      {selectedOption !== 'all' && (
        <div className="flex space-x-4">
          <button
            className={`relative px-4 py-2 transition-all duration-300 ${activeTab === 'all' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] hover:text-[#D2016E] after:transition-all after:duration-300 ${activeTab === 'all' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
            onClick={() => setActiveTab('all')}
          >
            {selectedOption === 'promos' ? `All Promos (${allPromos.length})` : `All Offers (${allOffers.length})`}
          </button>
          <button
            className={`relative px-4 py-2 transition-all duration-300 ${activeTab === 'active' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] hover:text-[#D2016E] after:transition-all after:duration-300 ${activeTab === 'active' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
            onClick={() => setActiveTab('active')}
          >
            {selectedOption === 'promos' ? `Active (${activePromos.length})` : `Active (${activeOffers.length})`}
          </button>
          <button
            className={`relative px-4 py-2 transition-all duration-300 ${activeTab === 'expired' ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 after:bottom-0 
        after:h-[2px] after:bg-[#D2016E] hover:text-[#D2016E] after:transition-all after:duration-300 ${activeTab === 'expired' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
            onClick={() => setActiveTab('expired')}
          >
            {selectedOption === 'promos' ? `Expired (${expiredPromos.length})` : `Expired (${expiredOffers.length})`}
          </button>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto custom-max-discount custom-scrollbar overflow-x-auto my-4 drop-shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-[1] rounded-md">
            <tr>
              {columnOrder.map((column) => (
                <>
                  {column === 'Promo Code / Offer Title' && selectedColumns.includes(column) && (
                    <th key="promoCode" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      {renderHeading()}
                    </th>
                  )}
                  {column === 'Type' && selectedColumns.includes(column) && (
                    <th key="type" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Type
                    </th>
                  )}
                  {column === 'Discount Value' && selectedColumns.includes(column) && (
                    <th key="discountValue" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Discount Value
                    </th>
                  )}
                  {column === 'Expiry Date' && selectedColumns.includes(column) && (
                    <th key="expiryDate" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Expiry Date
                    </th>
                  )}
                  {column === 'Total Times Applied' && selectedColumns.includes(column) && (
                    <th key="totalTimesApplied" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Total Times Applied
                    </th>
                  )}
                  {column === 'Total Discount Given' && selectedColumns.includes(column) && (
                    <th key="totalDiscountGiven" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Total Discount Given
                    </th>
                  )}
                  {column === 'Products Affected' && selectedColumns.includes(column) && (
                    <th key="productsAffected" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Products Affected
                    </th>
                  )}
                  {column === 'Min Order Amount' && selectedColumns.includes(column) && (
                    <th key="minOrderAmount" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Min Order Amount
                    </th>
                  )}
                  {column === 'Max Capped Amount' && selectedColumns.includes(column) && (
                    <th key="maxCappedAmount" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Max Capped Amount
                    </th>
                  )}
                  {column === 'Actions' && selectedColumns.includes(column) && (
                    <th key="actions" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Actions
                    </th>
                  )}
                  {column === 'Status' && selectedColumns.includes(column) && (
                    <th key="status" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                      Status
                    </th>
                  )}
                </>
              ))}
            </tr>
          </thead>

          {/* Conditional rendering based on the selected tab and dropdown */}
          {renderItems(filteredItems)}
        </table>
      </div>

      {/* Column Selection Modal */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setColumnModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Choose Columns</ModalHeader>
          <ModalBody className="modal-body-scroll">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <CheckboxGroup value={selectedColumns} onChange={handleColumnChange}>
                      {columnOrder.map((column, index) => (
                        <Draggable key={column} draggableId={column} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-2 border-b"
                            >
                              <Checkbox
                                value={column}
                                isChecked={selectedColumns.includes(column)}
                                onChange={() => {
                                  // Toggle column selection
                                  if (selectedColumns.includes(column)) {
                                    setSelectedColumns(selectedColumns.filter(col => col !== column));
                                  } else {
                                    setSelectedColumns([...selectedColumns, column]);
                                  }
                                }}
                              >
                                {column}
                              </Checkbox>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CheckboxGroup>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSelectAll} size="sm" color="primary" variant="flat">
              Select All
            </Button>
            <Button onClick={handleDeselectAll} size="sm" color="default" variant="flat">
              Deselect All
            </Button>
            <Button variant="solid" size='sm' color="primary" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecentPromotions;