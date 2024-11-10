"use client";
import * as XLSX from 'xlsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, CheckboxGroup, DateRangePicker, Input } from "@nextui-org/react";
import emailjs from '@emailjs/browser';
import Loading from '@/app/components/shared/Loading/Loading';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useDisclosure } from '@nextui-org/react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import toast from 'react-hot-toast';
import { FaUndo } from 'react-icons/fa';
import Barcode from '@/app/components/layout/Barcode';
import { IoMdClose } from 'react-icons/io';
import Papa from 'papaparse';
import useOrders from '@/app/hooks/useOrders';
import CustomPagination from '@/app/components/layout/CustomPagination';
import TabsOrder from '@/app/components/layout/TabsOrder';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import Swal from 'sweetalert2';
import arrowSvgImage from "../../../public/card-images/arrow.svg";
import arrivals1 from "../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../public/card-images/arrivals2.svg";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { parseISO, isBefore, subDays } from "date-fns";
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
const PrintButton = dynamic(() => import("@/app/components/layout/PrintButton"), { ssr: false });

const initialColumns = ['Order Number', 'Date & Time', 'Customer Name', 'Order Amount', 'Order Status', 'Action', 'Email', 'Phone Number', 'Alternative Phone Number', 'Shipping Zone', 'Shipping Method', 'Payment Status', 'Payment Method', 'Vendor'];

const orderStatusTabs = [
  'New Orders',
  'Active Orders',
  'Completed Orders',
  'Canceled Orders',
];

const OrdersPage = () => {
  const isAdmin = true;
  const searchParams = useSearchParams();
  const promo = searchParams.get('promo');
  const offer = searchParams.get('offer');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderList, isOrderListPending, refetchOrder] = useOrders();
  const axiosPublic = useAxiosPublic();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefDownload = useRef(null);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOrder, setColumnOrder] = useState(initialColumns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(orderStatusTabs[0]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderIdToUpdate, setOrderIdToUpdate] = useState(null); // Store order ID
  const [orderToUpdate, setOrderToUpdate] = useState({}); // selected order for update
  const [isTrackingModalOpen, setTrackingModalOpen] = useState(false);
  const [isToggleOn, setIsToggleOn] = useState(true);
  const [selectedHandler, setSelectedHandler] = useState(null);

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedColumns'));
    const savedOrder = JSON.parse(localStorage.getItem('columnOrder'));
    if (savedColumns) {
      setSelectedColumns(savedColumns);
    }
    if (savedOrder) {
      setColumnOrder(savedOrder);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      refetchOrder();  // RefetchOrders when search query changes
    }
  }, [searchQuery, refetchOrder]);

  useEffect(() => {
    // Set the search query to promo or offer
    if (promo) {
      setSearchQuery(promo);
    } else if (offer) {
      setSearchQuery(offer);
    }
  }, [promo, offer]);

  // Handler for selecting a shipment handler
  const handleSelectHandler = (handler) => {
    setSelectedHandler(handler);
  };

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
    localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
    localStorage.setItem('columnOrder', JSON.stringify(columnOrder));
    setColumnModalOpen(false);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columnOrder);
    const [draggedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, draggedColumn);

    setColumnOrder(reorderedColumns); // Update the column order both in modal and table
  };

  // Convert dateTime string to Date object
  const parseDate = (dateString) => {
    const [date, time] = dateString.split(' | ');
    const [day, month, year] = date.split('-').map(num => parseInt(num, 10));
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return new Date(year + 2000, month - 1, day, hours, minutes);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Extract start and end dates from selectedDateRange
  const startDate = selectedDateRange?.start ? new Date(selectedDateRange.start.year, selectedDateRange.start.month - 1, selectedDateRange.start.day) : null;
  const endDate = selectedDateRange?.end ? new Date(selectedDateRange.end.year, selectedDateRange.end.month - 1, selectedDateRange.end.day) : null; // Adjust end date to include the entire end day
  const adjustedEndDate = endDate ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1) : null; // Add 1 day and subtract 1 ms

  const handleReset = () => {
    setSelectedDateRange(null); // Reset the selected date range
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown)); // Toggle the clicked dropdown
  };

  // Check if filters are applied
  const isFilterActive = searchQuery || (selectedDateRange?.start && selectedDateRange?.end);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(0); // Reset to first page when changing items per page
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
      const productId = (product.productId || '').toString().toLowerCase();
      const size = (typeof product.size === 'string' ? product.size : '').toLowerCase();
      const color = (product.color?.label || '').toString().toLowerCase();
      const batchCode = (product.batchCode || '').toString().toLowerCase();
      const offerTitle = (product.offerTitle || '').toString().toLowerCase();
      const offerDiscountValue = (product.offerDiscountValue || '').toString();
      const sku = (product.sku || '').toString(); // SKU might be numeric, so keep it as a string

      return (
        productTitle.includes(query) ||
        productId.includes(query) ||
        size.includes(query) ||
        color.includes(query) ||
        batchCode.includes(query) ||
        offerTitle.includes(query) ||
        offerDiscountValue.includes(query) ||
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

    // Check if promo or offer exists and the order is 'Paid'
    const isPromoOrOffer = promo || offer;
    const isPaidOrder = order.paymentStatus === 'Paid';

    // Combine all filters
    return isDateInRange && (productMatch || orderMatch || nameMatch || dateMatch) && (!isPromoOrOffer || isPaidOrder);
  });

  // Function to get filtered orders based on the selected tab and sort by last status change
  const getFilteredOrders = () => {
    let filtered = [];

    switch (selectedTab) {
      case 'New Orders':
        filtered = orderList?.filter(order => order?.orderStatus === 'Pending');
        break;
      case 'Active Orders':
        filtered = orderList?.filter(order => ['Processing', 'Shipped', 'On Hold'].includes(order?.orderStatus));
        break;
      case 'Completed Orders':
        filtered = orderList?.filter(order => order?.orderStatus === 'Delivered');
        break;
      case 'Canceled Orders':
        filtered = orderList?.filter(order => ['Requested Return', 'Refunded'].includes(order?.orderStatus));
        break;
      default:
        filtered = orderList;
    }

    // Sort the filtered orders based on last status change, most recent first
    return filtered?.sort((a, b) => new Date(b.lastStatusChange) - new Date(a.lastStatusChange));
  };

  // Filtered orders based on the selected tab
  const filteredOrders = isFilterActive ? searchedOrders : getFilteredOrders();

  const paginatedOrders = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders?.slice(startIndex, endIndex);
  }, [filteredOrders, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);

  const handleActions = async (id, actionType, isUndo = false) => {
    const order = paginatedOrders?.find(order => order._id === id);

    if (!order) {
      toast.error("Order not found");
      return;
    }

    const actionMessages = {
      undefined: "Do you want to confirm this order?",
      shipped: "Do you want to ship this order?",
      onHold: "Do you want to put this order on hold?",
      delivered: "Do you want to mark this order as delivered?",
      requestedReturn: "Do you want to approve a return request for this order?",
      refunded: "Do you want to refund this order?",
      "": "Do you want to revert this order?"
    };

    Swal.fire({
      title: "Are you sure?",
      text: actionMessages[actionType] || "Action not recognized",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (actionType === "shipped") {
          // Open the modal for tracking number input only for 'shipped'
          setOrderToUpdate(order);
          setOrderIdToUpdate(id); // Set the order ID for modal
          setTrackingModalOpen(true);  // Open the modal
        } else {
          // For all other statuses, update order directly
          updateOrderStatus(order, id, actionType, isUndo); // Keep the existing logic for non-shipped actions
        }
      }
    });
  };

  // Function to update order status
  const updateOrderStatus = async (order, id, actionType, isUndo) => {
    let updateStatus;

    if (isUndo) {
      updateStatus = order?.previousStatus; // Revert to previous status if undoing
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

    const data = {
      orderStatus: updateStatus,
      ...(actionType === "shipped" && trackingNumber ? { trackingNumber } : {}), // Add tracking number if provided for shipped
      ...(actionType === "shipped" && selectedHandler ? { selectedHandlerName: selectedHandler } : {}) // Add selectedHandler for shipped
    };

    try {
      const res = await axiosPublic.patch(`/changeOrderStatus/${id}`, data);
      if (res?.data?.modifiedCount) {
        refetchOrder(); // Refresh orders list
        if (isUndo) {
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
                      Order Updated!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Order status reverted successfully.
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
        else {
          sendOrderEmail(order, actionType); // Send notification email
        }
        refetchOrder();
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
        successToastMessage = "Order has been shipped";
        break;
      case 'delivered':
        message = "Your order has been successfully delivered. We hope you are happy with your purchase. If you have any issues, please contact us.";
        successToastMessage = "Delivered successfully.";
        break;
      case 'onHold':
        message = "We have received your return request and will process it shortly. You will be contacted with further instructions on how to return your items.";
        successToastMessage = "Shipment is on hold.";
        break;
      case 'requestedReturn':
        message = "We have received your return request and will process it shortly. You will be contacted with further instructions on how to return your items.";
        successToastMessage = "Return request has been initiated!";
        break;
      case 'refunded':
        message = "Your refund has been processed successfully. The amount will be credited to your original payment method. Thank you for your patience.";
        successToastMessage = "Customer has been refunded";
        break;
      default:
        message = "Thank you for your order! We have received it and are processing it. You will receive an update once your order is on its way.";
        successToastMessage = "Order confirmation sent successfully";
        break;
    }

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
                Order Updated!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {successToastMessage}
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
    // const templateParams = {
    //   to_name: `${order.firstName} ${order.lastName}`,
    //   to_email: order.email,
    //   order_number: order.orderNumber,
    //   message: message,
    // };


    // emailjs.send('service_26qm3vn', 'template_u931mzo', templateParams, 'kM2ZZ-I4QiQPp3W81')
    //   .then(() => {
    //     toast.custom((t) => (
    //       <div
    //         className={`${t.visible ? 'animate-enter' : 'animate-leave'
    //           } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
    //       >
    //         <div className="pl-6">
    //           <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
    //         </div>
    //         <div className="flex-1 w-0 p-4">
    //           <div className="flex items-start">
    //             <div className="ml-3 flex-1">
    //               <p className="text-base font-bold text-gray-900">
    //                 Order Updated!
    //               </p>
    //               <p className="mt-1 text-sm text-gray-500">
    //                 {successToastMessage}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="flex border-l border-gray-200">
    //           <button
    //             onClick={() => toast.dismiss(t.id)}
    //             className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-text-700 focus:outline-none text-2xl"
    //           >
    //             <RxCross2 />
    //           </button>
    //         </div>
    //       </div>
    //     ), {
    //       position: "bottom-right",
    //       duration: 5000
    //     })
    //   })
    //   .catch(() => {
    //     toast.error("Failed to send email");
    //   });
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const exportToCSV = async () => {
    let dataToExport = [];

    // Check if a search query is applied (i.e., if `searchedOrders` is not empty)
    if (searchQuery) {
      dataToExport = searchedOrders;
    }
    // If date range is applied, filter orders based on date range
    else if (startDate && adjustedEndDate) {
      dataToExport = filteredOrders.filter(order => {
        const orderDate = parseDate(order.dateTime);
        return orderDate >= startDate && orderDate <= adjustedEndDate;
      });
    }
    // Otherwise, apply tab-based filtering
    else {
      dataToExport = filteredOrders;
    }

    // Extract only the order-level details for the export
    const filteredData = dataToExport.map(row => {
      const data = {};

      // Loop through columnOrder and include only the selected columns in the correct order
      columnOrder.forEach((col) => {
        if (selectedColumns.includes(col)) {
          switch (col) {
            case 'Order Number':
              data.orderNumber = row.orderNumber;
              break;
            case 'Date & Time':
              data.dateTime = row.dateTime;
              break;
            case 'Customer Name':
              data.customerName = row.customerName;
              break;
            case 'Order Amount':
              data.totalAmount = row.totalAmount;
              break;
            case 'Order Status':
              data.orderStatus = row.orderStatus;
              break;
            case 'Email':
              data.email = row.email;
              break;
            case 'Phone Number':
              data.phoneNumber = row.phoneNumber;
              break;
            case 'Alternative Phone Number':
              data.phoneNumber2 = row.phoneNumber2 || "--";
              break;
            case 'Shipping Zone':
              data.shippingZone = row.shippingZone;
              break;
            case 'Shipping Method':
              data.shippingMethod = row.shippingMethod;
              break;
            case 'Payment Status':
              data.paymentStatus = row.paymentStatus;
              break;
            case 'Payment Method':
              data.paymentMethod = row.paymentMethod;
              break;
            case 'Vendor':
              data.vendor = row.vendor;
              break;
            default:
              break;
          }
        }
      });

      return data;
    });

    // Create the filename dynamically based on applied filters
    let fileName = 'order_data';
    if (searchQuery) fileName += `_searched`;
    else if (startDate && adjustedEndDate) fileName += `_from_${formatDate(startDate)}_to_${formatDate(adjustedEndDate)}`;
    else fileName += `_${selectedTab.replace(/\s/g, '_').toLowerCase()}`;

    // Convert to CSV and trigger download
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  const exportToPDF = async () => {
    const { jsPDF } = await import("jspdf");  // Dynamically import jsPDF
    const autoTable = (await import("jspdf-autotable")).default;  // Import jsPDF-AutoTable

    // Create a new document in landscape mode
    const doc = new jsPDF('landscape'); // 'landscape' mode

    // Define the columns based on columnOrder
    const columns = columnOrder
      .filter((col) => selectedColumns.includes(col))  // Ensure only selected columns are included
      .map((col) => ({
        header: col,
        dataKey: col,
      }));

    // Map filtered orders to the correct data format based on columnOrder
    const rows = filteredOrders?.map((order) => {
      const rowData = {};

      columnOrder.forEach((col) => {
        if (selectedColumns.includes(col)) {
          switch (col) {
            case "Order Number":
              rowData["Order Number"] = order.orderNumber;
              break;
            case "Date & Time":
              rowData["Date & Time"] = order.dateTime;
              break;
            case "Customer Name":
              rowData["Customer Name"] = order.customerName;
              break;
            case "Order Amount":
              rowData["Order Amount"] = `${order.totalAmount.toFixed(2)}`;
              break;
            case "Order Status":
              rowData["Order Status"] = order.orderStatus;
              break;
            case "Email":
              rowData["Email"] = order.email;
              break;
            case "Phone Number":
              rowData["Phone Number"] = order.phoneNumber;
              break;
            case "Alternative Phone Number":
              rowData["Alternative Phone Number"] = order.phoneNumber2 || "--";
              break;
            case "Shipping Zone":
              rowData["Shipping Zone"] = order.shippingZone;
              break;
            case "Shipping Method":
              rowData["Shipping Method"] = order.shippingMethod;
              break;
            case "Payment Status":
              rowData["Payment Status"] = order.paymentStatus;
              break;
            case "Payment Method":
              rowData["Payment Method"] = order.paymentMethod;
              break;
            case "Vendor":
              rowData["Vendor"] = order.vendor;
              break;
            default:
              break;
          }
        }
      });

      return rowData;
    });

    // Use jsPDF-AutoTable to create the table
    autoTable(doc, {
      columns: columns,  // Column headers
      body: rows,        // Order data
      startY: 10,        // Start position for the table
      styles: { fontSize: 8, halign: 'center', valign: 'middle' },  // Center-align data
      headStyles: { halign: 'center', valign: 'middle' },           // Center-align headers
      theme: "striped",  // Optional: customize the look of the table
      columnStyles: {
        "Alternative Phone Number": { halign: 'center' }, // Center-align for "--" placeholder
      }
    });

    // Save the PDF document
    doc.save("Filtered_Orders.pdf");
  };

  const exportToXLS = async () => {
    let dataToExport = [];

    // Check if a search query is applied (i.e., if `searchedOrders` is not empty)
    if (searchQuery) {
      dataToExport = searchedOrders;
    }
    // If date range is applied, filter orders based on date range
    else if (startDate && adjustedEndDate) {
      dataToExport = filteredOrders.filter(order => {
        const orderDate = parseDate(order.dateTime);
        return orderDate >= startDate && orderDate <= adjustedEndDate;
      });
    }
    // Otherwise, apply tab-based filtering
    else {
      dataToExport = filteredOrders;
    }

    // Extract only the order-level details for the export
    const filteredData = dataToExport.map(row => {
      const data = {};

      // Include all selected columns, even if empty
      columnOrder.forEach((col) => {
        if (selectedColumns.includes(col)) {
          switch (col) {
            case 'Order Number':
              data["Order Number"] = row.orderNumber || "";  // Include empty cells
              break;
            case 'Date & Time':
              data["Date & Time"] = row.dateTime || "";  // Include empty cells
              break;
            case 'Customer Name':
              data["Customer Name"] = row.customerName || "";  // Include empty cells
              break;
            case 'Order Amount':
              data["Order Amount"] = row.totalAmount || "";  // Include empty cells
              break;
            case 'Order Status':
              data["Order Status"] = row.orderStatus || "";  // Include empty cells
              break;
            case 'Email':
              data["Email"] = row.email || "";  // Include empty cells
              break;
            case 'Phone Number':
              data["Phone Number"] = row.phoneNumber || "";  // Include empty cells
              break;
            case 'Alternative Phone Number':
              data["Alternative Phone Number"] = row.phoneNumber2 || "";  // Include empty cells
              break;
            case 'Shipping Zone':
              data["Shipping Zone"] = row.shippingZone || "";  // Include empty cells
              break;
            case 'Shipping Method':
              data["Shipping Method"] = row.shippingMethod || "";  // Include empty cells
              break;
            case 'Payment Status':
              data["Payment Status"] = row.paymentStatus || "";  // Include empty cells
              break;
            case 'Payment Method':
              data["Payment Method"] = row.paymentMethod || "";  // Include empty cells
              break;
            case 'Vendor':
              data["Vendor"] = row.vendor || "";  // Include empty cells
              break;
            default:
              break;
          }
        }
      });

      return data;
    });

    // Create the filename dynamically based on applied filters
    let fileName = 'order_data';
    if (searchQuery) fileName += `_searched`;
    else if (startDate && adjustedEndDate) fileName += `_from_${formatDate(startDate)}_to_${formatDate(adjustedEndDate)}`;
    else fileName += `_${selectedTab.replace(/\s/g, '_').toLowerCase()}`;

    // Prepare the worksheet and workbook for XLSX export
    const worksheet = XLSX.utils.json_to_sheet(filteredData);  // Convert JSON data to sheet format
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Export the file as XLSX
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const isSevenDaysOrMore = (lastStatusChange) => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    return isBefore(parseISO(lastStatusChange), sevenDaysAgo);
  };

  // Disable the button based on conditions
  const shouldDisableButton = (orderStatus, lastStatusChange, isAdmin) => {
    if (isAdmin) return false; // If admin, do not disable
    if (['Delivered', 'Requested Return', 'Refunded'].includes(orderStatus)) {
      return isSevenDaysOrMore(lastStatusChange); // Disable if last status change was 7 or more days ago
    }
    return false;
  };

  useEffect(() => {
    if (paginatedOrders?.length === 0) {
      setPage(0); // Reset to the first page if no data
    }
  }, [paginatedOrders]);

  if (isOrderListPending) {
    return <Loading />;
  }

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

      <div className='max-w-screen-2xl px-0 md:px-6 2xl:px-0 mx-auto'>

        <div className='flex items-center justify-between py-2 md:py-5 gap-2'>

          <div className='w-full'>
            <h3 className='text-center md:text-start font-semibold text-xl lg:text-2xl'>Order Management</h3>
          </div>

          {/* Search Product Item */}
          <div className='w-full'>
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
                className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-white text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base"
              />
            </li>
          </div>

        </div>

        <div className='pb-3 px-6 md:px-0 pt-3 md:pt-0 flex flex-wrap lg:flex-nowrap gap-3 lg:gap-0 justify-center md:justify-between'>
          <div className='flex justify-center md:justify-start w-full'>
            <TabsOrder
              tabs={orderStatusTabs}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab} // This passes the function to change the tab
            />
          </div>

          <div className='flex w-full items-center max-w-screen-2xl px-3 mx-auto justify-center md:justify-end gap-3 md:gap-6'>

            <div ref={dropdownRefDownload} className="relative inline-block text-left z-10">
              <Button onClick={() => toggleDropdown('download')} className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
                Download Data
                <svg
                  className={`-mr-1 ml-2 h-5 w-5 transform transition-transform duration-300 ${openDropdown === "download" ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Button>

              {openDropdown === 'download' && (
                <div className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-2 flex flex-col gap-2">

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

                    {/* Button to export to XLSX */}
                    <button
                      onClick={exportToXLS}
                      className="mx-2 relative w-[150px] h-[40px] cursor-pointer text-xs flex items-center border border-[#9F5216] bg-[#9F5216] overflow-hidden transition-all hover:bg-[#803F11] active:border-[#70350E] group rounded-lg
md:w-[140px] md:h-[38px] lg:w-[150px] lg:h-[40px] sm:w-[130px] sm:h-[36px]">
                      <span className="relative translate-x-[26px] text-white transition-transform duration-300 group-hover:text-transparent text-xs
md:translate-x-[24px] lg:translate-x-[26px] sm:translate-x-[22px]">
                        Export XLSX
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

                    <button
                      onClick={exportToPDF}
                      className="mx-2 relative w-[150px] h-[40px] cursor-pointer text-xs flex items-center border border-[#9F5216] bg-[#9F5216] overflow-hidden transition-all hover:bg-[#803F11] active:border-[#70350E] group rounded-lg
md:w-[140px] md:h-[38px] lg:w-[150px] lg:h-[40px] sm:w-[130px] sm:h-[36px]">
                      <span className="relative translate-x-[26px] text-white transition-transform duration-300 group-hover:text-transparent text-xs
md:translate-x-[24px] lg:translate-x-[26px] sm:translate-x-[22px]">
                        Export PDF
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

                  </div>
                </div>
              )}
            </div>

            <div ref={dropdownRef} className="relative inline-block text-left z-10">
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

                  {/* Choose Columns Button */}
                  <div className="py-1">
                    <Button variant="light" color="primary" onClick={() => { setColumnModalOpen(true); setOpenDropdown(false) }} className="w-full">
                      Choose Columns
                    </Button>

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
              <Button variant="solid" color="primary" size="sm" onClick={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* table content */}
        <div className="max-w-screen-2xl mx-auto custom-max-h-orders overflow-x-auto custom-scrollbar relative drop-shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-[1] bg-white">
              <tr>
                {columnOrder.map((column) => selectedColumns.includes(column) && (
                  <th key={column} className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">{column}</th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders?.length === 0 ? (
                <tr>
                  <td colSpan={selectedColumns.length} className="text-center p-4 text-gray-500 py-36 md:py-44 xl:py-52 2xl:py-80">
                    No orders found matching your criteria. Please adjust your filters or check back later.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr key={order?._id || index} className="hover:bg-gray-50 transition-colors">
                    {columnOrder.map(
                      (column) =>
                        selectedColumns.includes(column) && (
                          <>
                            {column === 'Order Number' && (
                              <td key="orderNumber" className="text-xs p-3 font-mono cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => handleOrderClick(order)}>
                                {order?.orderNumber}
                              </td>
                            )}
                            {column === 'Date & Time' && (
                              <td key="dateTime" className="text-xs p-3 text-gray-700 text-center">{order?.dateTime}</td>
                            )}
                            {column === 'Customer Name' && (
                              <td key="customerName" className="text-xs p-3 text-gray-700 uppercase text-center">{order?.customerName}</td>
                            )}
                            {column === 'Order Amount' && (
                              <td key="orderAmount" className="text-xs p-3 text-gray-700 text-right">৳ {order?.totalAmount.toFixed(2)}</td>
                            )}
                            {column === 'Order Status' && (
                              <td key="orderStatus" className="text-xs p-3 text-yellow-600 text-center">{order?.orderStatus}</td>
                            )}
                            {column === 'Action' && (
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
                                    <Button
                                      className="text-xs w-20"
                                      onClick={() => handleActions(order._id, 'requestedReturn')}
                                      size="sm"
                                      color="danger"
                                      variant="flat"
                                      isDisabled={shouldDisableButton(order.orderStatus, order.lastStatusChange, isAdmin)}
                                    >
                                      Return
                                    </Button>
                                  )}
                                  {order.orderStatus === 'Requested Return' && (
                                    <Button
                                      className="text-xs w-20"
                                      onClick={() => handleActions(order._id, 'refunded')}
                                      size="sm"
                                      color="danger"
                                      variant="flat"
                                      isDisabled={shouldDisableButton(order.orderStatus, order.lastStatusChange, isAdmin)}
                                    >
                                      Refund
                                    </Button>
                                  )}
                                  {order.orderStatus === 'Refunded' && (
                                    <Button
                                      className="text-xs w-20 cursor-not-allowed"
                                      size="sm"
                                      color="default"
                                      isDisabled
                                    >
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
                            {column === 'Email' && (
                              <td key="email" className="text-xs p-3 text-gray-700">{order?.email}</td>
                            )}
                            {column === 'Phone Number' && (
                              <td key="phoneNumber" className="text-xs p-3 text-gray-700 text-center">{order?.phoneNumber}</td>
                            )}
                            {column === 'Alternative Phone Number' && (
                              <td key="altPhoneNumber" className="text-xs p-3 text-gray-700 text-center">{order?.phoneNumber2 === 0 ? '--' : order?.phoneNumber2}</td>
                            )}
                            {column === 'Shipping Zone' && (
                              <td key="shippingZone" className="text-xs p-3 text-gray-700 text-center">{order?.shippingZone}</td>
                            )}
                            {column === 'Shipping Method' && (
                              <td key="shippingMethod" className="text-xs p-3 text-gray-700 text-center">{order?.shippingMethod}</td>
                            )}
                            {column === 'Payment Status' && (
                              <td key="paymentStatus" className="text-xs p-3 text-gray-700 text-center">{order?.paymentStatus}</td>
                            )}
                            {column === 'Payment Method' && (
                              <td key="paymentMethod" className="text-xs p-3 text-gray-700 text-center">{order?.paymentMethod}</td>
                            )}
                            {column === 'Vendor' && (
                              <td key="vendor" className="text-xs p-3 text-gray-700 text-center">{order?.vendor}</td>
                            )}
                          </>
                        )
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal of order number */}
        {selectedOrder && (
          <Modal className='mx-4 lg:mx-0' isOpen={isOpen} onOpenChange={onClose} size='xl'>
            <ModalContent>
              <div className='flex items-center justify-center'>
                <ModalHeader className="text-sm md:text-base"><Barcode selectedOrder={selectedOrder} /></ModalHeader>
              </div>
              <ModalBody className="modal-body-scroll">
                <div className='flex items-center justify-between w-full pr-10'>
                  <p>Order Id - <strong>#{selectedOrder?.orderNumber}</strong></p>
                  <p>Customer Id - <strong>{selectedOrder?.customerId}</strong></p>
                </div>
                <p className='text-xs md:text-base'>Address: {selectedOrder?.address1} {selectedOrder?.address2}, {selectedOrder?.city}, {selectedOrder?.postalCode}</p>
                <div className='flex items-center justify-between pr-10'>
                  <p className='text-xs md:text-base'>Payment Method: {selectedOrder?.paymentMethod}</p>
                  <p className='text-xs md:text-base'>Transaction Id: {selectedOrder?.transactionId}</p>
                </div>
                <div className='flex flex-wrap items-center justify-between pr-10'>
                  <p className='text-xs md:text-base'>Shipment Handler: {selectedOrder?.selectedHandlerName === undefined ? '--' : selectedOrder?.selectedHandlerName}</p>
                  <p className='text-xs md:text-base'>Tracking Number: {selectedOrder?.trackingNumber === "" ? '--' : selectedOrder?.trackingNumber}</p>
                </div>

                <h4 className="mt-4 text-lg font-semibold">Product Information</h4>
                {/* Display product and promo/offer information */}
                <div className='flex justify-between gap-6 pr-6'>
                  <div>
                    {selectedOrder.productInformation && selectedOrder.productInformation.length > 0 && (
                      <>
                        {selectedOrder.productInformation.map((product, index) => (
                          <div key={index} className="mb-4">
                            <p><strong>Product : </strong> {product?.productTitle}</p>
                            <p><strong>Product ID : </strong> {product?.productId}</p>
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
                  </div>
                  <div className='flex flex-col items-center text-sm md:text-base w-60'>
                    <p className='w-full'><strong>Total Amount:</strong>  ৳ {selectedOrder?.totalAmount.toFixed(2)}</p>
                    <p className='w-full'>
                      {selectedOrder?.promoCode || selectedOrder?.productInformation?.some((product) => product.offerTitle) ? (
                        (() => {
                          // Calculate promo discount only if it's greater than 0
                          const promoDiscount =
                            selectedOrder.promoDiscountType === 'Percentage'
                              ? (selectedOrder.totalAmount * selectedOrder.promoDiscountValue) / 100
                              : selectedOrder.promoDiscountValue;

                          // Extract offer discounts from productInformation and filter out 0-value offers
                          const offerDetails = selectedOrder.productInformation
                            .map((product) => {
                              const offerDiscount =
                                product.offerDiscountType === 'Percentage'
                                  ? (product.unitPrice * product.offerDiscountValue) / 100
                                  : product.offerDiscountValue;

                              return {
                                offerTitle: product.offerTitle,
                                offerDiscountType: product.offerDiscountType,
                                offerDiscountValue: product.offerDiscountValue,
                                offerDiscountAmount: offerDiscount,
                              };
                            })
                            .filter((offer) => offer.offerDiscountAmount > 0); // Filter out 0-value offers

                          return (
                            <div className='flex flex-col gap-2'>
                              {/* Show promo discount if applied */}
                              {selectedOrder.promoCode && promoDiscount > 0 ? (
                                <div>
                                  <strong>Promo applied:</strong> {selectedOrder.promoCode} ({selectedOrder.promoDiscountType === 'Percentage'
                                    ? `${selectedOrder.promoDiscountValue.toFixed(2)}%`
                                    : `৳ ${selectedOrder.promoDiscountValue.toFixed(2)}`})
                                  <br />
                                  <br />
                                </div>
                              ) : null}

                              {/* Show multiple offers if they are applied */}
                              {offerDetails.length > 0 ? (
                                <div>
                                  {offerDetails.map((offer, index) => (
                                    <span key={index}>
                                      <strong>Offer applied</strong> ({offer.offerTitle}):{' '}
                                      {offer.offerDiscountType === 'Percentage'
                                        ? `${offer.offerDiscountValue.toFixed(2)}%`
                                        : `৳ ${offer.offerDiscountAmount.toFixed(2)}`}
                                      <br />
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          );
                        })()
                      ) : (
                        <div>
                          <strong>Promo/Offer applied:</strong> X
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className='flex items-center justify-end'>
                <PrintButton selectedOrder={selectedOrder} />
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Modal of tracking number */}
        <Modal size='lg' isOpen={isTrackingModalOpen} onOpenChange={() => setTrackingModalOpen(false)}>
          <ModalContent className='px-2'>
            <ModalHeader className="flex flex-col gap-1">Select Shipment Handler</ModalHeader>
            <ModalBody>
              <div className='flex flex-wrap items-center justify-center gap-2'>
                {orderToUpdate?.shipmentHandlers?.map((handler, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 border-2 rounded-lg font-semibold px-6 py-2 cursor-pointer ${selectedHandler === handler ? 'border-[#ffddc2] bg-[#ffddc2]' : 'bg-white'
                      }`}
                    onClick={() => handleSelectHandler(handler)}
                  >
                    {handler}
                  </div>
                ))}
              </div>

              <div className='flex justify-between items-center gap-2'>
                <Input
                  clearable
                  bordered
                  fullWidth
                  size="lg"
                  label="Tracking Number *"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                />
              </div>

            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={async () => {
                  // Check if handler is selected, regardless of toggle state
                  if (!selectedHandler) {
                    toast.error("Please select a shipment handler.");
                    return; // Stop execution if no handler is selected
                  }

                  // When toggle is ON, ensure tracking number is entered
                  if (isToggleOn && !trackingNumber) {
                    toast.error("Please enter a tracking number.");
                    return; // Stop execution if no tracking number is provided
                  }

                  // Update order status with tracking number and selected handler
                  await updateOrderStatus(orderToUpdate, orderIdToUpdate, "shipped", false, trackingNumber, selectedHandler);
                  setTrackingModalOpen(false); // Close modal after submission
                  setTrackingNumber(''); // Clear input field
                  setSelectedHandler(null); // Clear the selected handler
                  setIsToggleOn(true); // Reset toggle to true
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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

export default OrdersPage;