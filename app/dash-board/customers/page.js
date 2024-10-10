"use client";
import CustomPagination from '@/app/components/layout/CustomPagination';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useOrders from '@/app/hooks/useOrders';
import { Button, Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CustomerPrintButton from '@/app/components/layout/CustomerPrintButton';
import useCustomers from '@/app/hooks/useCustomers';
import { FaCrown, FaMedal, FaRegUser, FaStar } from 'react-icons/fa6';
import arrowSvgImage from "../../../public/card-images/arrow.svg";
import arrivals1 from "../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../public/card-images/arrivals2.svg";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// import RatingModal from '@/app/components/layout/RatingModal';
// import toast from 'react-hot-toast';
// import { PiFlagPennantFill } from "react-icons/pi";
// import { getColorClass } from '@/app/components/layout/getColorClass';

const Customers = () => {

  // const isAdmin = true;
  const dropdownRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orderList, isOrderListPending] = useOrders();
  const [customerDetails, isCustomerPending] = useCustomers();
  const axiosPublic = useAxiosPublic();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const initialColumns = ['Customer ID', 'Customer Name', 'Email', 'Phone Number', 'Order History', 'City', 'Postal Code', 'Street Address', 'Preferred Payment Method', 'Shipping Method', 'Alternative Phone Number', 'Verification', 'Status'];
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOrder, setColumnOrder] = useState(initialColumns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  // const [isRatingModalOpen, setRatingModalOpen] = useState(false);
  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  // const [ratings, setRatings] = useState({});

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedCustomer'));
    const savedCustomerColumns = JSON.parse(localStorage.getItem('selectedCustomerColumns'));
    if (savedColumns) {
      setSelectedColumns(savedColumns);
    }
    if (savedCustomerColumns) {
      setColumnOrder(savedCustomerColumns);
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
    localStorage.setItem('selectedCustomer', JSON.stringify(selectedColumns));
    localStorage.setItem('selectedCustomerColumns', JSON.stringify(columnOrder));
    setColumnModalOpen(false);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columnOrder);
    const [draggedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, draggedColumn);

    setColumnOrder(reorderedColumns); // Update the column order both in modal and table
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

  const { data: { result, totalCustomerList } = [], isCustomerListPending, refetch } = useQuery({
    queryKey: ["customerList", page, itemsPerPage],
    queryFn: async () => {
      const res = await axiosPublic.get(`/customerList?page=${page}&itemsPerPage=${itemsPerPage}`);
      return res?.data;
    },
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    onError: (err) => {
      console.error('Error fetching customer list:', err);
    }
  });

  const handleItemsPerPageChange = (e) => {
    // Extracting only the value from the event
    const value = Number(e.target.value);
    setItemsPerPage(value); // Set the number of items per page
    setPage(0); // Reset to the first page
    refetch(); // Refetch the data with updated items per page
  };

  const handleViewClick = async (orderId) => {
    const orderDetails = orderList?.filter(order => order?.customerId === orderId);
    setSelectedOrder(orderDetails);
    onOpen();
  };

  const combinedData = useMemo(() => {
    return customerDetails?.map((customer) => {
      const customerOrders = (orderList || []).filter(order => order.customerId === customer.customerId);

      const aggregatedOrderDetails = customerOrders.reduce((acc, order) => {
        acc.city = order.city || acc.city;
        acc.postalCode = order.postalCode || acc.postalCode;
        acc.streetAddress = `${order.address1} ${order.address2}` || acc.streetAddress;
        acc.paymentMethods.add(order.paymentMethod);
        acc.shippingMethods.add(order.shippingMethod);
        acc.alternativePhoneNumber = order.phoneNumber2 || acc.alternativePhoneNumber;
        return acc;
      }, {
        city: '',
        postalCode: '',
        streetAddress: '',
        paymentMethods: new Set(),
        shippingMethods: new Set(),
        alternativePhoneNumber: '',
      });

      return {
        ...customer,
        city: aggregatedOrderDetails.city || "--",
        postalCode: aggregatedOrderDetails.postalCode || "--",
        streetAddress: aggregatedOrderDetails.streetAddress || "--",
        paymentMethods: Array.from(aggregatedOrderDetails.paymentMethods).join(', ') || "--",
        shippingMethods: Array.from(aggregatedOrderDetails.shippingMethods).join(', ') || "--",
        alternativePhoneNumber: aggregatedOrderDetails.alternativePhoneNumber || '--',
      };
    });
  }, [customerDetails, orderList]);

  const filteredData = useMemo(() => {
    const normalizeString = (value) => (value ? value.toString().toLowerCase() : '');

    const doesCustomerMatchSearch = (customer, searchTerm) => {
      return (
        normalizeString(customer.customerId).includes(searchTerm) ||
        normalizeString(customer.customerName).includes(searchTerm) ||
        normalizeString(customer.email).includes(searchTerm) ||
        normalizeString(customer.phoneNumber).includes(searchTerm) ||
        normalizeString(customer.city).includes(searchTerm) ||
        normalizeString(customer.postalCode).includes(searchTerm) ||
        normalizeString(customer.streetAddress).includes(searchTerm) ||
        normalizeString(customer.paymentMethods).includes(searchTerm) ||
        normalizeString(customer.shippingMethods).includes(searchTerm) ||
        normalizeString(customer.emailVerified).includes(searchTerm) ||
        normalizeString(customer.alternativePhoneNumber).includes(searchTerm)
      );
    };

    if (!searchQuery) return combinedData;

    const searchTerm = searchQuery.toLowerCase();
    return combinedData.filter((customer) => doesCustomerMatchSearch(customer, searchTerm));
  }, [combinedData, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);  // Reset to the first page
  };

  const isFiltering = searchQuery.length > 0;

  const totalPage = isFiltering
    ? Math.ceil(filteredData.length / itemsPerPage)
    : Math.ceil(totalCustomerList / itemsPerPage);
  const pages = Array.from({ length: totalPage }, (_, i) => i);

  const paginatedData = useMemo(() => {
    const start = page * itemsPerPage;
    return filteredData?.slice(start, start + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  const statusColors = {
    basic: 'bg-gray-400',      // Light gray for basic
    bronze: 'bg-orange-700',    // Softer orange for bronze
    silver: 'bg-gray-600',      // Softer gray for silver
    gold: 'bg-yellow-800',      // Softer yellow for gold
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'basic':
        return <FaRegUser className="mr-3" />; // User icon for basic
      case 'bronze':
        return <FaMedal className="mr-1" />; // Medal icon for bronze
      case 'silver':
        return <FaStar className="mr-2" />; // Star icon for silver
      case 'gold':
        return <FaCrown className="mr-3" />; // Crown icon for gold
      default:
        return null; // Default icon if status is unknown
    }
  };

  // const handleRateClick = (customer) => {
  //   setSelectedCustomer(customer);
  //   setRatingModalOpen(true);
  // };

  // const handleSaveRating = async (ratingColor) => {
  //   if (selectedCustomer) {
  //     try {
  //       const response = await axiosPublic.patch(`/addRatingToCustomer/${selectedCustomer.customerId}`, { rating: ratingColor });

  //       if (response.status === 200) {
  //         setRatings({
  //           ...ratings,
  //           [selectedCustomer.customerId]: ratingColor // Update with the selected color
  //         });
  //         toast.success(`Rating updated successfully for customer ${selectedCustomer.customerId}`);
  //       } else {
  //         toast.error('Failed to save rating: ' + response.data.message);
  //       }
  //     } catch (error) {
  //       console.error('Error saving rating:', error);
  //       toast.error('Error saving rating. Please try again.');
  //     }
  //   }

  //   setRatingModalOpen(false);
  // };

  // const handleCloseModal = () => {
  //   // Reset rating for the selected customer
  //   if (selectedCustomer) {
  //     setRatings({
  //       ...ratings,
  //       [selectedCustomer.customerId]: 0 // Or any default value
  //     });
  //   }
  //   setSelectedCustomer(null);
  //   setRatingModalOpen(false);
  // };

  if (isCustomerListPending || isOrderListPending || isCustomerPending) {
    return <Loading />
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
        className='absolute inset-0 z-0 top-2 md:top-0 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[25%] xl:left-[26%] 2xl:left-[24%] bg-no-repeat'
      />

      <div className='max-w-screen-2xl px-6 2xl:px-0 mx-auto'>

        <div className='flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-0 justify-center md:justify-between py-2 md:py-5'>
          <h3 className='w-1/2 text-center md:text-start font-medium md:font-semibold text-[13px] lg:text-lg xl:text-2xl'>Customer Management</h3>

          <div className='flex items-center justify-center gap-2 w-full'>
            <div className='w-full'>
              {/* Search Product Item */}
              <li className="flex items-center relative group w-full">
                <svg className="absolute left-4 fill-[#9e9ea7] w-4 h-4 icon" aria-hidden="true" viewBox="0 0 24 24">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input
                  type="search"
                  placeholder="Search By Customer Details..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-white text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base"
                />
              </li>
            </div>

            <div className='flex items-center max-w-screen-2xl mx-auto justify-center md:justify-end md:gap-6'>

              <div>
                <Button variant="solid" size='sm' color="danger" onClick={() => { setColumnModalOpen(true) }} className="w-full">
                  Choose Columns
                </Button>
              </div>

              {/* <div ref={dropdownRef} className="relative inline-block text-left">
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
    </div> */}

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
              <Button variant="solid" size='sm' color="primary" onClick={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* table content */}
        <div className="max-w-screen-2xl mx-auto custom-max-h overflow-x-auto custom-scrollbar relative drop-shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-[1] bg-white">
              <tr>
                {columnOrder.map((column) => selectedColumns.includes(column) && (
                  <th key={column} className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">

              {paginatedData?.length === 0 ? (
                <tr className='relative'>
                  <td colSpan={selectedColumns.length} className="text-center p-4 text-gray-500 pt-24">
                    No orders found matching your criteria. Please adjust your filters or check back later.
                  </td>
                </tr>
              ) : (
                paginatedData?.map((customer, index) => {
                  // Determine the color class based on customer.rating or ratings[customer.customerId]
                  // const ratingColorClass = getColorClass(ratings[customer.customerId] || customer.rating);
                  const formattedStatus = customer?.status.charAt(0).toUpperCase() + customer?.status.slice(1);
                  return (
                    <tr key={customer?._id || index} className="hover:bg-gray-50 bg-white transition-colors">

                      {columnOrder.map(
                        (column) =>
                          selectedColumns.includes(column) && (
                            <>
                              {column === 'Customer ID' && (
                                <td key="customerId" className="text-xs p-3 font-mono">
                                  {customer?.customerId}
                                </td>
                              )}
                              {column === 'Customer Name' && (
                                <td key="customerName" className="text-xs p-3 text-gray-700 uppercase">
                                  {customer?.customerName}
                                </td>
                              )}
                              {column === 'Email' && (
                                <td key="email" className={`text-xs p-3 ${customer?.emailVerified === "Verified" ? "text-green-600 font-semibold" : "text-gray-700"}`}>
                                  {customer?.email}
                                </td>
                              )}
                              {column === 'Phone Number' && (
                                <td key="phoneNumber" className="text-xs p-3 text-gray-700">
                                  {customer?.phoneNumber}
                                </td>
                              )}
                              {column === 'Order History' && (
                                <td key="orderHistory" onClick={() => handleViewClick(customer?.customerId)} className="text-xs p-3 cursor-pointer text-blue-600 hover:text-blue-800">
                                  View
                                </td>
                              )}
                              {column === 'City' && (
                                <td key="city" className="text-xs p-3 text-gray-700">
                                  {customer?.city}
                                </td>
                              )}
                              {column === 'Postal Code' && (
                                <td key="postalCode" className="text-xs p-3 text-gray-700">
                                  {customer?.postalCode}
                                </td>
                              )}
                              {column === 'Street Address' && (
                                <td key="streetAddress" className="text-xs p-3 text-gray-700">
                                  {customer?.streetAddress}
                                </td>
                              )}
                              {column === 'Preferred Payment Method' && (
                                <td key="paymentMethod" className="text-xs p-3 text-gray-700">
                                  {customer?.paymentMethods}
                                </td>
                              )}
                              {column === 'Shipping Method' && (
                                <td key="shippingMethod" className="text-xs p-3 text-gray-700">
                                  {customer?.shippingMethods}
                                </td>
                              )}
                              {column === 'Alternative Phone Number' && (
                                <td key="altPhoneNumber" className="text-xs p-3 text-gray-700">
                                  {customer?.alternativePhoneNumber}
                                </td>
                              )}
                              {column === 'Verification' && (
                                <td key="verification" className="text-xs p-3 text-gray-700">
                                  {customer?.emailVerified}
                                </td>
                              )}
                              {column === 'Status' && (
                                <td key="status" className="text-xs p-3 text-gray-700 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center rounded-md py-1 px-2 text-white font-medium ${statusColors[customer?.status]} transition duration-300 ease-in-out transform hover:scale-105`}
                                    title={formattedStatus}
                                  >
                                    {getStatusIcon(customer?.status)}
                                    <span className="ml-1">{formattedStatus}</span>
                                  </span>
                                </td>
                              )}
                              {/* <button
                    onClick={() => handleRateClick(customer)}
                    disabled={!isAdmin}
                    className={ratingColorClass} // Apply the color class
                  >
                    <PiFlagPennantFill size={24} />
                  </button> */}
                            </>
                          )
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Add Rating Modal */}
        {/* {selectedCustomer && (
  <RatingModal
    isOpen={isRatingModalOpen}
    onClose={handleCloseModal}
    onSave={handleSaveRating}
    initialRating={ratings[selectedCustomer.customerId] || 'default'}
    selectedCustomer={selectedCustomer}
  />
)} */}

        {selectedOrder && (
          <Modal className='mx-4 lg:mx-0 px-4' isOpen={isOpen} onOpenChange={onClose} size='2xl'>
            <ModalContent>
              <ModalHeader className="text-lg">
                Order History
              </ModalHeader>
              <ModalBody className="modal-body-scroll space-y-6">
                {selectedOrder.length > 0 ? (
                  selectedOrder.map((order, index) => (
                    <div key={index} className="bg-white px-5 md:px-10 py-5 rounded-lg flex flex-col md:flex-row justify-between shadow-md border border-gray-200">
                      <div>
                        <p className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                          <strong>Order ID : </strong><CustomerPrintButton selectedOrder={order} />
                        </p>
                        <p className='text-sm font-medium text-gray-700'>
                          <span className="font-semibold">Order Amount:</span> ৳ {order?.totalAmount.toFixed(2)}
                        </p>
                        <p className='text-sm font-medium text-gray-700'>
                          <span className="font-semibold">Payment Method:</span> {order?.paymentMethod}
                        </p>
                        <p className='text-sm font-medium text-gray-700'>
                          <span className="font-semibold">Shipping Method:</span> {order?.shippingMethod}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          <span className="font-semibold">Date & Time:</span> {order?.dateTime}
                        </p>
                        <p className='text-sm font-medium text-gray-700'>
                          <span className="font-semibold">Order Status:</span> {order?.orderStatus}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-700 text-lg font-medium">This customer has not ordered anything yet.</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className='flex justify-end border-gray-300 pt-2'>
                <Button
                  onClick={onClose} color="danger" size='sm'
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center relative mt-2">
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

      </div >

    </div>
  );
};

export default Customers;