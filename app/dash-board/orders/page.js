"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, CheckboxGroup, DateRangePicker } from "@nextui-org/react";
import emailjs from '@emailjs/browser';
import Loading from '@/app/components/shared/Loading/Loading';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { FaUndo } from 'react-icons/fa';
import Barcode from '@/app/components/layout/Barcode';
import { IoMdClose } from 'react-icons/io';
import Papa from 'papaparse';
import useOrders from '@/app/hooks/useOrders';
import PrintButton from '@/app/components/layout/PrintButton';
import CustomPagination from '@/app/components/layout/CustomPagination';

const OrdersPage = () => {
  const isAdmin = true;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderList, isOrderListPending, refetchOrder] = useOrders();
  const axiosPublic = useAxiosPublic();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
  const columns = ['Order Number', 'Date & Time', 'Customer Name', 'Order Amount', 'Order Status', 'Action', 'Email', 'Phone Number', 'Alternative Phone Number', 'Shipping Zone', 'Shipping Method', 'Payment Status', 'Payment Method', 'Vendor'];
  const defaultColumns = useMemo(() => ['Order Number', 'Date & Time', 'Order Amount', 'Order Status'], []);
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedColumns'));
    if (savedColumns) {
      setSelectedColumns(savedColumns);
    } else {
      setSelectedColumns(defaultColumns);
    }
  }, [defaultColumns]);

  useEffect(() => {
    if (searchQuery) {
      refetchOrder();  // RefetchOrders when search query changes
    }
  }, [searchQuery, refetchOrder]);

  const handleColumnChange = (selected) => {
    const combinedSelection = [...defaultColumns, ...selected.filter(col => !defaultColumns.includes(col))];
    setSelectedColumns(combinedSelection);
  };

  const handleSelectAll = () => {
    setSelectedColumns(columns);
  };

  const handleDeselectAll = () => {
    setSelectedColumns(defaultColumns);
  };

  const handleSave = () => {
    localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
    setColumnModalOpen(false);
  };

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

  const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);

  const { data: { result, totalOrderList } = [], isOrderPending, refetch } = useQuery({
    queryKey: ["orderList", page, itemsPerPage],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orderList?page=${page}&itemsPerPage=${itemsPerPage}`);
      return res?.data;
    },
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    onError: (err) => {
      console.error('Error fetching order list:', err);
    }
  });

  const totalPage = Math.ceil(totalOrderList / itemsPerPage);
  const pages = Array.from({ length: totalPage }, (_, i) => i);

  // Check if filters are applied
  const isFilterActive = searchQuery || (selectedDateRange?.start && selectedDateRange?.end);

  const handleItemsPerPageChange = (e) => {
    // Extracting only the value from the event
    const value = Number(e.target.value);
    setItemsPerPage(value); // Set the number of items per page
    setPage(0); // Reset to the first page
    refetch(); // Refetch the data with updated items per page
  };

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

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  // Filter orders based on search query and date range
  const searchedOrders = orderList?.filter(order => {
    const query = searchQuery.toLowerCase();
    const isNumberQuery = !isNaN(query) && query.trim() !== '';
    const queryParts = query.split(' ');

    // Date range filtering
    const orderDate = parseDate(order.dateTime);
    const isDateInRange = startDate && adjustedEndDate
      ? (orderDate >= startDate && orderDate <= adjustedEndDate)
      : true;

    // Check if any product detail contains the search query
    const productMatch = order.productInformation?.some(product => {
      const productTitle = (product.productTitle || '').toString().toLowerCase();
      const size = (typeof product.size === 'string' ? product.size : '').toLowerCase();
      const color = (product.color?.label || '').toString().toLowerCase();
      const batchCode = (product.batchCode || '').toString().toLowerCase();
      const sku = (product.sku || '').toString(); // SKU might be numeric, so keep it as a string

      return (
        productTitle.includes(query) ||
        size.includes(query) ||
        color.includes(query) ||
        batchCode.includes(query) ||
        (isNumberQuery && sku === query) // Numeric comparison for SKU
      );
    });

    // Check if order details match the search query
    const orderMatch = (
      (order.orderNumber || '').toLowerCase().includes(query) ||
      (order.dateTime || '').toLowerCase().includes(query) ||
      (order.customerName || '').toLowerCase().includes(query) || // Added customerName search
      (order.email || '').toLowerCase().includes(query) ||
      (order.phoneNumber || '').toString().includes(query) ||
      (order.phoneNumber2 || '').toString().includes(query) ||
      (order.address1 || '').toLowerCase().includes(query) ||
      (order.address2 || '').toLowerCase().includes(query) ||
      (order.city || '').toLowerCase().includes(query) ||
      (order.postalCode || '').toString().includes(query) ||
      (order.orderStatus || '').toLowerCase().includes(query) ||
      (order.totalAmount || '').toString().includes(query) ||
      (order.paymentMethod || '').toLowerCase().includes(query) ||
      (order.vendor || '').toLowerCase().includes(query) ||
      (order.shippingZone || '').toLowerCase().includes(query) ||
      (order.promoDiscountValue || '').toString().includes(query) ||
      (order.offerDiscountValue || '').toString().includes(query) ||
      (order.promoCode || '').toLowerCase().includes(query) ||
      (order.offerCode || '').toLowerCase().includes(query) ||
      (order.offerTitle || '').toLowerCase().includes(query) ||
      (order.transactionId || '').toLowerCase().includes(query) ||
      (order.trackingNumber || '').toLowerCase().includes(query) ||
      (order.shippingMethod || '').toLowerCase().includes(query) ||
      (order.paymentStatus || '').toLowerCase().includes(query) ||
      (order.customerId || '').toLowerCase().includes(query)
    );

    // Check if query parts match first and last names
    const nameMatch = queryParts.length === 2 && (
      (order.firstName || '').toLowerCase().includes(queryParts[0]) &&
      (order.lastName || '').toLowerCase().includes(queryParts[1])
    );

    // Check if query matches date in specific format
    const dateMatch = (order.dateTime || '').toLowerCase().includes(query);

    // Combine all filters
    return isDateInRange && (productMatch || orderMatch || nameMatch || dateMatch);
  });

  const handleActions = async (id, actionType, isUndo = false) => {
    const order = result.find(order => order._id === id);

    if (!order) {
      toast.error("Order not found");
      return;
    }

    let updateStatus;
    if (isUndo) {
      updateStatus = order.previousStatus; // Set status to previous status on undo
      localStorage.removeItem(`undoVisible_${id}`);
    } else {
      switch (actionType) {
        case 'shipped':
          updateStatus = 'Shipped';
          break;
        case 'onHold':
          updateStatus = 'On Hold';
          break;
        case 'delivered':
          updateStatus = 'Delivered';
          break;
        case 'requestedReturn':
          updateStatus = 'Requested Return';
          break;
        case 'refunded':
          updateStatus = 'Refunded';
          break;
        default:
          updateStatus = 'Processing';
          break;
      }
      localStorage.setItem(`undoVisible_${id}`, true);
    }

    try {
      const res = await axiosPublic.patch(`/changeOrderStatus/${id}`, { orderStatus: updateStatus });
      if (res?.data?.modifiedCount) {
        if (isUndo) {
          toast.success("Order status reverted successfully.");
        } else {
          sendOrderEmail(order, actionType); // Send the email with the appropriate message
        }
        refetch(); // Refetch the orders to update the UI
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  // Adjust this logic to correctly determine the visibility of the Undo button
  const isUndoAvailable = (order) => {
    if (!isAdmin) return false;
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const lastChange = new Date(order.lastStatusChange);

    // Check localStorage to see if the undo button should be visible
    const isVisible = localStorage.getItem(`undoVisible_${order._id}`);
    return lastChange >= sixHoursAgo && isVisible;
  };

  // sending mail to customer
  const sendOrderEmail = (order, actionType) => {
    let message;
    let successToastMessage;

    switch (actionType) {
      case 'shipped':
        message = "Your order has been shipped and is on its way to you. You will receive tracking information shortly so you can follow its journey.";
        successToastMessage = "Shipping information sent successfully.";
        break;
      case 'delivered':
        message = "Your order has been successfully delivered. We hope you are happy with your purchase. If you have any issues, please contact us.";
        successToastMessage = "Thank you sent successfully.";
        break;
      case 'requestedReturn':
        message = "We have received your return request and will process it shortly. You will be contacted with further instructions on how to return your items.";
        successToastMessage = "Order cancellation sent successfully.";
        break;
      case 'refunded':
        message = "Your refund has been processed successfully. The amount will be credited to your original payment method. Thank you for your patience.";
        successToastMessage = "Refund information sent successfully.";
        break;
      default:
        message = "Thank you for your order! We have received it and are processing it. You will receive an update once your order is on its way.";
        successToastMessage = "Order confirmation sent successfully.";
        break;
    }

    const templateParams = {
      to_name: `${order.firstName} ${order.lastName}`,
      to_email: order.email,
      order_number: order.orderNumber,
      message: message,
    };

    emailjs.send('service_26qm3vn', 'template_u931mzo', templateParams, 'kM2ZZ-I4QiQPp3W81')
      .then(() => {
        toast.success(successToastMessage);
      })
      .catch(() => {
        toast.error("Failed to send email");
      });
  };

  const exportToCSV = async () => {
    let dataToExport = [];

    // Check if filtering is applied (i.e., if `searchedOrders` is not empty)
    if (searchedOrders.length > 0) {
      // If filtering is applied, use the searched orders
      dataToExport = searchedOrders;
    } else {
      // If no filtering, fetch all order data (across all pages)
      dataToExport = orderList;
    }

    // Extract only the order-level details for the export
    const filteredData = dataToExport.map(row => {
      const data = {};

      // Include only the selected columns
      if (selectedColumns.includes('Order Number')) data.orderNumber = row.orderNumber;
      if (selectedColumns.includes('Date & Time')) data.dateTime = row.dateTime;
      if (selectedColumns.includes('Customer Name')) data.customerName = row.customerName;
      if (selectedColumns.includes('Order Amount')) data.totalAmount = row.totalAmount;
      if (selectedColumns.includes('Order Status')) data.orderStatus = row.orderStatus;
      if (selectedColumns.includes('Email')) data.email = row.email;
      if (selectedColumns.includes('Phone Number')) data.phoneNumber = row.phoneNumber;
      if (selectedColumns.includes('Alternative Phone Number')) data.phoneNumber2 = row.phoneNumber2;
      if (selectedColumns.includes('Shipping Zone')) data.shippingZone = row.shippingZone;
      if (selectedColumns.includes('Shipping Method')) data.shippingMethod = row.shippingMethod;
      if (selectedColumns.includes('Payment Status')) data.paymentStatus = row.paymentStatus;
      if (selectedColumns.includes('Payment Method')) data.paymentMethod = row.paymentMethod;
      if (selectedColumns.includes('Vendor')) data.vendor = row.vendor;

      return data;
    });

    // Convert to CSV and trigger download
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'order_data.csv';
    link.click();
  };

  if (isOrderPending || isOrderListPending) {
    return <Loading />;
  }

  return (
    <div className='max-w-screen-2xl px-0 md:px-6 2xl:px-0 mx-auto'>

      <div className='flex flex-col md:flex-row items-center justify-between my-2 md:my-5'>
        <h3 className='px-6 w-full text-center md:text-start font-medium md:font-semibold text-[13px] md:text-xl lg:text-2xl'>Order Management</h3>

        <div className='flex w-full items-center max-w-screen-2xl px-3 mx-auto justify-center md:justify-end md:gap-6'>

          {/* Button to export to CSV */}
          <button
            onClick={exportToCSV}
            className="mx-2 relative w-[150px] h-[40px] cursor-pointer text-xs flex items-center border border-[#9F5216] bg-[#9F5216] overflow-hidden transition-all hover:bg-[#803F11] active:border-[#70350E] group rounded-lg
       md:w-[140px] md:h-[38px] lg:w-[150px] lg:h-[40px] sm:w-[130px] sm:h-[36px]">
            <span className="relative translate-x-[26px] text-white transition-transform duration-300 group-hover:text-transparent text-xs
             md:translate-x-[24px] lg:translate-x-[26px] sm:translate-x-[22px]">
              Export CSV
            </span>
            <span className="absolute transform translate-x-[109px] h-full w-[39px] bg-[#803F11] flex items-center justify-center transition-transform duration-300 group-hover:w-[148px] group-hover:translate-x-0 active:bg-[#70350E]
             md:translate-x-[100px] lg:translate-x-[109px] sm:translate-x-[90px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 35 35"
                className="w-[20px] fill-white"
              >
                <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
              </svg>
            </span>
          </button>

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
                  {/* Search Product Item */}
                  <li className="flex items-center relative group">
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

                  {/* Choose Columns Button */}
                  <div className="py-1">
                    <Button variant="light" color="primary" onClick={() => { setColumnModalOpen(true); setIsOpenDropdown(false) }} className="w-full">
                      Choose Columns
                    </Button>
                  </div>

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

                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Column Selection Modal */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setColumnModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Choose Columns</ModalHeader>
          <ModalBody>
            <CheckboxGroup value={selectedColumns} onChange={handleColumnChange}>
              {columns.map((column) => (
                <Checkbox key={column} value={column} isDisabled={defaultColumns.includes(column)}>
                  {column}
                </Checkbox>
              ))}
            </CheckboxGroup>
            <Button onClick={handleSelectAll} size="sm" color="primary" variant="flat">
              Select All
            </Button>
            <Button onClick={handleDeselectAll} size="sm" color="default" variant="flat">
              Deselect All
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button variant="solid" color="primary" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* table content */}
      <div className="max-w-screen-2xl mx-auto px-0 md:px-4 lg:px-6 custom-max-h overflow-x-auto modal-body-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-[1] shadow-md">
            <tr>
              {selectedColumns.includes('Order Number') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Order Number</th>
              )}
              {selectedColumns.includes('Date & Time') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Date & Time</th>
              )}
              {selectedColumns.includes('Customer Name') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Customer Name</th>
              )}
              {selectedColumns.includes('Order Amount') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Order Amount</th>
              )}
              {selectedColumns.includes('Order Status') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Order Status</th>
              )}
              {selectedColumns.includes('Action') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Action</th>
              )}
              {selectedColumns.includes('Email') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Email</th>
              )}
              {selectedColumns.includes('Phone Number') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Phone Number</th>
              )}
              {selectedColumns.includes('Alternative Phone Number') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Alternative Phone Number</th>
              )}
              {selectedColumns.includes('Shipping Zone') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Zone</th>
              )}
              {selectedColumns.includes('Shipping Method') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Shipping Method</th>
              )}
              {selectedColumns.includes('Payment Status') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Payment Status</th>
              )}
              {selectedColumns.includes('Payment Method') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Payment Method</th>
              )}
              {selectedColumns.includes('Vendor') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Vendor</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(isFilterActive ? searchedOrders : result)?.map((order, index) => (
              <tr key={order?._id || index} className="hover:bg-gray-50 transition-colors">
                {selectedColumns.includes('Order Number') && (
                  <td className="text-xs p-3 font-mono cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => handleOrderClick(order)}>
                    {order?.orderNumber}
                  </td>
                )}
                {selectedColumns.includes('Date & Time') && (
                  <td className="text-xs p-3 text-gray-700">{order?.dateTime}</td>
                )}
                {selectedColumns.includes('Customer Name') && (
                  <td className="text-xs p-3 text-gray-700">{order?.customerName}</td>
                )}
                {selectedColumns.includes('Order Amount') && (
                  <td className="text-xs p-3 text-gray-700 pl-1 md:pl-2 lg:pl-4 xl:pl-9">৳ {order?.totalAmount.toFixed(2)}</td>
                )}
                {selectedColumns.includes('Order Status') && (
                  <td className="text-xs p-3 text-yellow-600">{order?.orderStatus}</td>
                )}
                {selectedColumns.includes('Action') && (
                  <td className="p-3">
                    <div className="flex gap-2 items-center">
                      {order.orderStatus === 'Pending' && (
                        <Button onClick={() => handleActions(order._id)} size="sm" className="text-xs w-20" color="primary" variant="flat">
                          Confirm
                        </Button>
                      )}
                      {order.orderStatus === 'Processing' && (
                        <Button onClick={() => handleActions(order._id, 'shipped')} size="sm" className="text-xs w-20" color="secondary" variant="flat">
                          Shipped
                        </Button>
                      )}
                      {order.orderStatus === 'Shipped' && (
                        <div className="flex items-center gap-2">
                          <Button className="text-xs w-20" onClick={() => handleActions(order._id, 'onHold')} size="sm" color="warning" variant="flat">
                            On Hold
                          </Button>
                          <Button className="text-xs w-20" onClick={() => handleActions(order._id, 'delivered')} size="sm" color="success" variant="flat">
                            Delivered
                          </Button>
                        </div>
                      )}
                      {order.orderStatus === 'On Hold' && (
                        <Button className="text-xs w-20" onClick={() => handleActions(order._id, 'delivered')} size="sm" color="success" variant="flat">
                          Delivered
                        </Button>
                      )}
                      {order.orderStatus === 'Delivered' && (
                        <Button className="text-xs w-20" onClick={() => handleActions(order._id, 'requestedReturn')} size="sm" color="danger" variant="flat">
                          Return
                        </Button>
                      )}
                      {order.orderStatus === 'Requested Return' && (
                        <Button className="text-xs w-20" onClick={() => handleActions(order._id, 'refunded')} size="sm" color="danger" variant="flat">
                          Refund
                        </Button>
                      )}
                      {order.orderStatus === 'Refunded' && (
                        <Button className="text-xs w-20" size="sm" color="default" isDisabled>
                          Refunded
                        </Button>
                      )}

                      {/* Undo button logic */}
                      {isAdmin && isUndoAvailable(order) && (
                        <button
                          onClick={() => handleActions(order._id, '', true)}
                          className="text-red-600 hover:text-red-800 focus:ring-2 focus:ring-red-500 rounded p-1"
                        >
                          <FaUndo />
                        </button>
                      )}
                    </div>
                  </td>
                )}
                {selectedColumns.includes('Email') && (
                  <td className="text-xs p-3 text-gray-700">{order?.email}</td>
                )}
                {selectedColumns.includes('Phone Number') && (
                  <td className="text-xs p-3 text-gray-700">{order?.phoneNumber}</td>
                )}
                {selectedColumns.includes('Alternative Phone Number') && (
                  <td className="text-xs p-3 text-gray-700">{order?.phoneNumber2 === 0 ? '--' : order?.phoneNumber2}</td>
                )}
                {selectedColumns.includes('Shipping Zone') && (
                  <td className="text-xs p-3 text-gray-700">{order?.shippingZone}</td>
                )}
                {selectedColumns.includes('Shipping Method') && (
                  <td className="text-xs p-3 text-gray-700">{order?.shippingMethod}</td>
                )}
                {selectedColumns.includes('Payment Status') && (
                  <td className="text-xs p-3 text-gray-700">{order?.paymentStatus}</td>
                )}
                {selectedColumns.includes('Payment Method') && (
                  <td className="text-xs p-3 text-gray-700">{order?.paymentMethod}</td>
                )}
                {selectedColumns.includes('Vendor') && (
                  <td className="text-xs p-3 text-gray-700">{order?.vendor}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal of order number */}
      {selectedOrder && (
        <Modal className='mx-4 lg:mx-0' isOpen={isOpen} onOpenChange={onClose} size='xl'>
          <ModalContent>
            <div className='flex items-center'>
              <ModalHeader className="text-sm md:text-base">Order Id - #{selectedOrder?.orderNumber}</ModalHeader>
              <ModalHeader className='text-sm md:text-base'>Customer Id - {selectedOrder?.customerId}</ModalHeader>
            </div>
            <ModalBody className="modal-body-scroll">
              <div className='flex justify-center'>
                <Barcode selectedOrder={selectedOrder} />
              </div>
              <p className='text-xs md:text-base'>Address: {selectedOrder?.address1} {selectedOrder?.address2}, {selectedOrder?.city}, {selectedOrder?.postalCode}</p>
              <p className='text-xs md:text-base'>Transaction Id: {selectedOrder?.transactionId}</p>
              <p className='text-xs md:text-base'>Tracking Number: {selectedOrder?.trackingNumber === "" ? '--' : selectedOrder?.trackingNumber}</p>

              {/* Display product information */}
              {selectedOrder.productInformation && selectedOrder.productInformation.length > 0 && (
                <>
                  <h4 className="mt-4 mb-2 text-lg font-semibold">Product Information</h4>
                  {selectedOrder.productInformation.map((product, index) => (
                    <div key={index} className="mb-4">
                      <p><strong>Product : </strong> {product?.productTitle}</p>
                      <p><strong>Size:</strong>  {product?.size}</p>
                      <p className='flex items-center gap-2'><strong>Color:</strong>
                        {product?.color?.label}
                        <span
                          style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            backgroundColor: product.color?.color || '#fff',
                            marginRight: '8px',
                            borderRadius: '4px'
                          }}
                        />
                      </p>
                      <p><strong>Batch Code:</strong> {product?.batchCode}</p>
                      <p><strong>Unit Price:</strong> {product?.unitPrice}</p>
                      <p><strong>SKU:</strong> {product?.sku}</p>
                    </div>
                  ))}
                </>
              )}
            </ModalBody>
            <ModalFooter className='flex justify-between items-center'>
              <div className='flex items-center gap-1 text-xs md:text-sm'>
                <p className=''>Total Amount:  ৳ {selectedOrder?.totalAmount.toFixed(2)}</p>,
                <p className=''>
                  {selectedOrder?.promoCode ? (
                    <>
                      Promo applied: {selectedOrder.promoDiscountValue > 0 ? (
                        selectedOrder.promoDiscountType === 'Percentage' ? (
                          `${selectedOrder.promoDiscountValue.toFixed(2)}%`
                        ) : (
                          `৳ ${selectedOrder.promoDiscountValue.toFixed(2)}`
                        )
                      ) : (
                        '৳ 0.00'
                      )}
                    </>
                  ) : selectedOrder?.offerCode ? (
                    <>
                      Offer applied: {selectedOrder.offerDiscountValue > 0 ? (
                        selectedOrder.offerDiscountType === 'Percentage' ? (
                          `${selectedOrder.offerDiscountValue.toFixed(2)}%`
                        ) : (
                          `৳ ${selectedOrder.offerDiscountValue.toFixed(2)}`
                        )
                      ) : (
                        '৳ 0.00'
                      )}
                    </>
                  ) : (
                    'Promo / Offer applied : X'
                  )}
                </p>


              </div>
              <PrintButton selectedOrder={selectedOrder} />
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Pagination Button */}
      {!isFilterActive && (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <CustomPagination
            totalPages={pages.length}
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
      )}
    </div>
  );
};

export default OrdersPage;