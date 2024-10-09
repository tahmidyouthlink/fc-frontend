"use client";
import useOrders from '@/app/hooks/useOrders';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';
import CustomPagination from './CustomPagination';
import { Button, Checkbox, CheckboxGroup, DateRangePicker, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { IoMdClose } from 'react-icons/io';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const initialColumns = ["Date & Time", 'Order ID', 'Customer Name', 'Payment Method', 'Transaction ID', 'Payment Status'];

const FinanceTable = () => {

  const [orderList, isOrderPending, refetch] = useOrders();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOrder, setColumnOrder] = useState(initialColumns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedColumnsFinance'));
    const savedColumnsFinancesPage = JSON.parse(localStorage.getItem('selectedColumnsFinancesPage'));
    if (savedColumns) {
      setSelectedColumns(savedColumns);
    }
    if (savedColumnsFinancesPage) {
      setColumnOrder(savedColumnsFinancesPage);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      refetch();  // RefetchOrders when search query changes
    }
  }, [searchQuery, refetch]);

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
    localStorage.setItem('selectedColumnsFinance', JSON.stringify(selectedColumns));
    localStorage.setItem('selectedColumnsFinancesPage', JSON.stringify(columnOrder));
    setColumnModalOpen(false);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columnOrder);
    const [draggedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, draggedColumn);

    setColumnOrder(reorderedColumns); // Update the column order both in modal and table
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(0); // Reset to first page when changing items per page
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown)); // Toggle the clicked dropdown
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Convert dateTime string to Date object
  const parseDate = (dateString) => {
    const [date, time] = dateString.split(' | ');
    const [day, month, year] = date.split('-').map(num => parseInt(num, 10));
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return new Date(year + 2000, month - 1, day, hours, minutes);
  };

  // Extract start and end dates from selectedDateRange
  const startDate = selectedDateRange?.start ? new Date(selectedDateRange.start.year, selectedDateRange.start.month - 1, selectedDateRange.start.day) : null;
  const endDate = selectedDateRange?.end ? new Date(selectedDateRange.end.year, selectedDateRange.end.month - 1, selectedDateRange.end.day) : null; // Adjust end date to include the entire end day
  const adjustedEndDate = endDate ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1) : null; // Add 1 day and subtract 1 ms

  const handleReset = () => {
    setSelectedDateRange(null); // Reset the selected date range
  };

  // Filter orders based on search query and date range
  const searchedOrders = orderList?.filter(order => {
    const query = searchQuery.toLowerCase();

    // Date range filtering
    const orderDate = parseDate(order.dateTime);
    const isDateInRange = startDate && adjustedEndDate
      ? (orderDate >= startDate && orderDate <= adjustedEndDate)
      : true;

    // Payment status filtering
    const isStatusMatch = selectedPaymentStatus === 'All' || order.paymentStatus === selectedPaymentStatus;

    // Check if order details match the search query
    const orderMatch = (
      (order.orderNumber || '').toLowerCase().includes(query) ||
      (order.customerName || '').toLowerCase().includes(query) || // Added customerName search
      (order.paymentMethod || '').toLowerCase().includes(query) ||
      (order.transactionId || '').toLowerCase().includes(query) ||
      (order.paymentStatus || '').toLowerCase().includes(query)
    );

    // Check if query matches date in specific format
    const dateMatch = (order.dateTime || '').toLowerCase().includes(query);

    return isDateInRange && isStatusMatch && (orderMatch || dateMatch);
  });

  const paginatedOrders = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchedOrders?.slice(startIndex, endIndex);
  }, [searchedOrders, page, itemsPerPage]);

  const totalPages = Math.ceil(searchedOrders?.length / itemsPerPage);

  useEffect(() => {
    if (paginatedOrders?.length === 0) {
      setPage(0); // Reset to the first page if no data
    }
  }, [paginatedOrders]);

  if (isOrderPending) {
    return <SmallHeightLoading />
  }

  return (
    <div>

      <div className='flex flex-col lg:flex-row items-center justify-evenly gap-6 max-w-screen-2xl mx-auto'>

        <div className='w-full'>
          <li className="flex items-center relative group flex-1">
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
              className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base"
            />
          </li>
        </div>

        <div className="flex items-center gap-6 flex-wrap w-full">
          <select
            id="paymentStatusFilter"
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="border border-gray-300 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9f511681] focus:border-transparent bg-white transition-all duration-200 ease-in-out w-full lg:w-1/2"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <div ref={dropdownRef} className="relative inline-block text-left z-50">
          <Button onClick={() => toggleDropdown('other')} className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
            Customize
            <svg
              className={`-mr-1 ml-2 h-5 w-5 transform transition-transform duration-300 ${openDropdown === "other" ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>

          {openDropdown === 'other' && (
            <div className="absolute right-0 z-10 mt-2 w-64 md:w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className='p-1'>

                <div className='flex items-center gap-2'>
                  <DateRangePicker
                    label="Order Duration"
                    visibleMonths={1}
                    onChange={(range) => setSelectedDateRange(range)} // Ensure range is an array
                    value={selectedDateRange} // Ensure this matches the expected format
                  />

                  {selectedDateRange && selectedDateRange.start && selectedDateRange.end && (
                    <button className="hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1" onClick={handleReset}>
                      <IoMdClose size={20} />
                    </button>
                  )}
                </div>

                <div className="py-1 flex-1">
                  <Button variant="light" color="primary" onClick={() => { setColumnModalOpen(true) }} className="w-full">
                    Choose Columns
                  </Button>
                </div>

              </div>

            </div>
          )}
        </div>

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
            <Button onClick={handleDeselectAll} size="sm" color="default" variant="flat">
              Deselect All
            </Button>
            <Button onClick={handleSelectAll} size="sm" color="primary" variant="flat">
              Select All
            </Button>
            <Button variant="solid" color="primary" size='sm' onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="max-w-screen-2xl mx-auto custom-scrollbar custom-max-discount overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-[1] rounded-md">
            <tr>
              {columnOrder.map((column) => selectedColumns.includes(column) && (
                <th key={column} className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b">{column}</th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders?.length === 0 ?
              <tr>
                <td colSpan={selectedColumns.length} className="text-center p-4 text-gray-500 md:pt-40 pt-32 lg:pt-52 xl:pt-60 2xl:pt-72">
                  No orders found matching your criteria. Please adjust your filters or check back later.
                </td>
              </tr>
              :
              (paginatedOrders?.map((order, index) => {

                return (
                  <>
                    <tr key={order?._id || index} className="hover:bg-gray-50 transition-colors">
                      {columnOrder.map(
                        (column) =>
                          selectedColumns.includes(column) && (
                            <>
                              {column === 'Date & Time' && (
                                <td key="dateTime" className="text-xs p-3 text-gray-700">
                                  {order?.dateTime}
                                </td>
                              )}
                              {column === 'Order ID' && (
                                <td key="orderNumber" className="text-xs p-3 text-gray-700">
                                  {order?.orderNumber}
                                </td>
                              )}
                              {column === 'Customer Name' && (
                                <td key="customerName" className="text-xs p-3 text-gray-700">
                                  {order?.customerName}
                                </td>
                              )}
                              {column === 'Payment Method' && (
                                <td key="paymentMethod" className="text-xs p-3 text-gray-700">
                                  {order?.paymentMethod}
                                </td>
                              )}
                              {column === 'Transaction ID' && (
                                <td key="transactionId" className="text-xs p-3 text-gray-700">
                                  {order?.transactionId ? order.transactionId : '--'}
                                </td>
                              )}
                              {column === 'Payment Status' && (
                                <td key="paymentStatus" className="text-xs p-3 text-gray-700">
                                  {order?.paymentStatus}
                                </td>
                              )}
                            </>
                          )
                      )}
                    </tr>
                  </>
                )
              }))
            }
          </tbody>

        </table>

      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
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
  );
};

export default FinanceTable;