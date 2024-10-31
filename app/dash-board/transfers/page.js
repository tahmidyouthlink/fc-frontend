"use client";
import React, { useEffect, useMemo, useState } from 'react';
import arrowSvgImage from "../../../public/card-images/arrow.svg";
import arrivals1 from "../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../public/card-images/arrivals2.svg";
import CustomPagination from '@/app/components/layout/CustomPagination';
import TabsOrder from '@/app/components/layout/TabsOrder';
import Link from 'next/link';
import useTransferOrders from '@/app/hooks/useTransferOrders';
import Loading from '@/app/components/shared/Loading/Loading';
import Progressbar from '@/app/components/layout/Progressbar';
import { useRouter } from 'next/navigation';

const transferStatusTabs = [
  'All',
  'Pending',
  'Received',
  'Canceled'
];

const Transfers = () => {

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedTab, setSelectedTab] = useState(transferStatusTabs[0]);
  const [transferOrderList, isTransferOrderPending, refetch] = useTransferOrders();
  const router = useRouter();

  useEffect(() => {
    if (searchQuery) {
      refetch();  // RefetchOrders when search query changes
    }
  }, [searchQuery, refetch]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(0); // Reset to first page when changing items per page
  };

  const filterPurchaseOrders = (transferOrderList, searchQuery) => {
    const query = searchQuery.toLowerCase();
    const isNumberQuery = !isNaN(query) && query.trim() !== '';

    return transferOrderList?.filter(order => {
      // Check if any product detail contains the search query
      const productMatch = order?.transferOrderVariants?.some(product => {
        const productTitle = (product.productTitle || '').toLowerCase();
        const size = (typeof product.size === 'string' ? product.size : '').toLowerCase();
        const colorCode = (product.colorCode || '').toLowerCase();
        const colorName = (product.colorName || '').toLowerCase();
        const quantity = (product.quantity || '').toString(); // Assuming quantity is a number

        return (
          productTitle.includes(query) ||
          size.includes(query) ||
          colorCode.includes(query) ||
          colorName.includes(query) ||
          (isNumberQuery && quantity === query)
        );
      });

      // Check if order details match the search query
      const orderMatch = (
        (order.transferOrderNumber || '').toLowerCase().includes(query) || // Order number
        (order.origin.locationName || '').toLowerCase().includes(query) ||  // Origin location name
        (order.origin.contactPersonName || '').toLowerCase().includes(query) || // Origin contact person
        (order.origin.cityName || '').toLowerCase().includes(query) || // Origin city name
        (order.destination.locationName || '').toLowerCase().includes(query) ||  // Destination location name
        (order.destination.contactPersonName || '').toLowerCase().includes(query) || // Destination contact person
        (order.destination.cityName || '').toLowerCase().includes(query) || // Destination city name
        (order.status || '').toLowerCase().includes(query) || // Order status
        (order.estimatedArrival || '').toLowerCase().includes(query) // Estimated arrival date
      );

      // Combine all filters
      return productMatch || orderMatch;
    });
  };

  const searchedOrders = filterPurchaseOrders(transferOrderList, searchQuery);

  const getFilteredOrders = () => {
    let filtered = [];

    switch (selectedTab) {
      case 'Pending':
        filtered = transferOrderList?.filter(order => order?.status === 'pending');
        break;
      case 'Received':
        filtered = transferOrderList?.filter(order => order?.status === 'received');
        break;
      case 'Canceled':
        filtered = transferOrderList?.filter(order => order?.status === 'canceled');
        break;
      default:
        filtered = transferOrderList;
    }

    // Sort the filtered orders based on last status change, most recent first
    return filtered;
  };

  const filteredOrders = searchQuery ? searchedOrders : getFilteredOrders();

  const paginatedOrders = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders?.slice(startIndex, endIndex);
  }, [filteredOrders, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);

  const handleGoToEditPage = (id) => {
    router.push(`/dash-board/transfers/${id}`);
  }

  useEffect(() => {
    if (paginatedOrders?.length === 0) {
      setPage(0); // Reset to the first page if no data
    }
  }, [paginatedOrders]);

  if (isTransferOrderPending) {
    return <Loading />
  }

  console.log(paginatedOrders);

  return (
    <div className='relative w-full min-h-screen bg-gray-100'>

      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat left-[45%] lg:left-[60%] -top-[138px]'
      />
      <div
        style={{
          backgroundImage: `url(${arrivals2.src})`,
        }}
        className='absolute inset-0 z-0 bg-contain bg-center xl:-top-28 w-full bg-no-repeat'
      />
      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-2 md:top-0 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />

      <div className='max-w-screen-2xl px-0 md:px-6 2xl:px-0 mx-auto relative'>

        <div className='flex items-center justify-between py-2 md:py-5 gap-2 w-full'>

          <h3 className='text-center md:text-start font-semibold text-xl lg:text-2xl'>Transfers</h3>

          <button className="cursor-pointer hover:bg-neutral-950 bg-neutral-800 text-white shadow-lg font-semibold px-4 py-2 rounded-lg">
            <Link href={"/dash-board/transfers/create-transfer"}>Create transfer</Link>
          </button>

        </div>

        <div className='flex justify-between items-center gap-6 w-full'>
          <div className='flex-1'>
            <TabsOrder
              tabs={transferStatusTabs}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab} // This passes the function to change the tab
            />
          </div>

          {/* Search Product Item */}
          <div className='flex-1'>
            <li className="flex items-center relative group">
              <svg className="absolute left-4 fill-[#9e9ea7] w-4 h-4 icon" aria-hidden="true" viewBox="0 0 24 24">
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
              <input
                type="search"
                placeholder="Search by transfer details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-white text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base"
              />
            </li>
          </div>

        </div>

        <div className="max-w-screen-2xl mx-auto custom-max-h-orders overflow-x-auto custom-scrollbar relative drop-shadow rounded-lg pt-4">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-[1] bg-white">
              <tr>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b">
                  Purchase order
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b">
                  Origin
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b">
                  Destination
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b">
                  Status
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-right">
                  Received
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-right">
                  Expected Arrival
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500 py-36 md:py-44 xl:py-52 2xl:py-80">
                    No purchase orders found. Please adjust your filters or check back later.
                  </td>
                </tr>
              ) : (
                paginatedOrders?.map((order, index) => {
                  const totals = order?.transferOrderVariants?.reduce(
                    (acc, variant) => {
                      acc.totalQuantity += variant.quantity || 0;
                      acc.totalAccept += variant.accept || 0;
                      acc.totalReject += variant.reject || 0;
                      return acc;
                    },
                    { totalQuantity: 0, totalAccept: 0, totalReject: 0 }
                  );
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td onClick={() => handleGoToEditPage(order?._id)} className="text-sm p-3 cursor-pointer text-blue-600 hover:text-blue-800">
                        {order?.transferOrderNumber}
                      </td>
                      <td className="text-sm p-3 text-neutral-500 font-semibold">
                        {order?.origin?.locationName}
                      </td>
                      <td className="text-sm p-3 text-neutral-500 font-semibold">
                        {order?.destination?.locationName}
                      </td>
                      <td className="text-xs p-3 font-semibold">
                        <span
                          className={`px-3 py-1 rounded-full
      ${order?.status === "pending" ? "bg-yellow-100 text-yellow-600"
                              : order?.status === "received" ? "bg-green-100 text-green-600"
                                : order?.status === "canceled" ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-600"}`}
                        >
                          {order?.status === "pending" ? "Pending"
                            : order?.status === "received" ? "Received"
                              : order?.status === "canceled" ? "Canceled"
                                : "Unknown"}
                        </span>
                      </td>
                      <td className="text-sm p-3 text-neutral-500 font-semibold">
                        <div className='flex flex-col'>
                          <Progressbar
                            accepted={totals?.totalAccept}
                            rejected={totals?.totalReject}
                            total={totals?.totalQuantity}
                          />
                          <div className="mt-1">
                            {totals?.totalAccept} of {totals?.totalQuantity}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm p-3 text-neutral-500 font-semibold text-right">
                        {order?.estimatedArrival}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Button */}
        <div className="flex flex-col mt-2 md:flex-row gap-4 justify-center items-center relative">
          <CustomPagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
          <div className="relative inline-block">
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="cursor-pointer px-3 py-2 rounded-lg text-sm md:text-base text-gray-800 bg-white shadow-lg border border-gray-300 focus:outline-none hover:bg-gradient-to-tr hover:from-pink-400 hover:to-yellow-400 hover:text-white transition-colors duration-300 appearance-none w-16 md:w-20 lg:w-24"
            >
              <option className='bg-white text-black' value={25}>25</option>
              <option className='bg-white text-black' value={50}>50</option>
              <option className='bg-white text-black' value={100}>100</option>
            </select>
            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Transfers;