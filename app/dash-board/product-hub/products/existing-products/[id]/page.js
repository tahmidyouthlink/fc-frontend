"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import arrivals2 from "/public/card-images/arrivals2.svg";
import SmallHeightLoading from '@/app/components/shared/Loading/SmallHeightLoading';
import { Button, Checkbox, CheckboxGroup, DateRangePicker, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import TabsOrder from '@/app/components/layout/TabsOrder';
import CustomPagination from '@/app/components/layout/CustomPagination';
import Link from 'next/link';
import { today, getLocalTimeZone } from "@internationalized/date";
import { IoMdClose } from 'react-icons/io';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { TbColumnInsertRight, TbBoxOff } from 'react-icons/tb';
import PaginationSelect from '@/app/components/layout/PaginationSelect';
import { BsGraphDownArrow } from "react-icons/bs";
import useLocations from '@/app/hooks/useLocations';
import Loading from '@/app/components/shared/Loading/Loading';
import { useAuth } from '@/app/contexts/auth';

const initialColumns = ['Product', 'Status', 'SKU', 'Season', 'Price', 'Discount (৳ / %)', 'Sizes', 'Colors', 'Vendor', 'Shipping Zones', 'Shipment Handlers'];

const productStatusTab = ['All', 'Active', 'Draft', 'Archived'];

const ProductPage = () => {

  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const router = useRouter();

  // Decode the URL-encoded category name
  const decodedCategoryName = decodeURIComponent(id);

  const [productDetails, setProductDetails] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [locationList, isLocationPending] = useLocations();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnOrder, setColumnOrder] = useState(initialColumns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [isSkuModalOpen, setSkuModalOpen] = useState(false);
  const [groupedByLocation, setGroupedByLocation] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(productStatusTab[0]);
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
  const { existingUserData, isUserLoading } = useAuth();
  const role = existingUserData?.role;
  const isAuthorized = role === "Owner" || role === "Editor";

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedColumnsProductCategory'));
    const savedExistingProduct = JSON.parse(localStorage.getItem('selectedExistingProduct'));

    if (savedColumns) {
      setSelectedColumns(savedColumns);
    } else {
      // Set to default if no saved columns exist
      setSelectedColumns(initialColumns);
    }

    if (savedExistingProduct) {
      setColumnOrder(savedExistingProduct);
    } else {
      // Set to default column order if no saved order exists
      setColumnOrder(initialColumns);
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
  };

  const handleSave = () => {
    localStorage.setItem('selectedColumnsProductCategory', JSON.stringify(selectedColumns));
    localStorage.setItem('selectedExistingProduct', JSON.stringify(columnOrder));
    setColumnModalOpen(false);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = Array.from(columnOrder);
    const [draggedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, draggedColumn);

    setColumnOrder(reorderedColumns); // Update the column order both in modal and table
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/productFromCategory/${decodedCategoryName}`);
        setProductDetails(data);
      } catch (error) {
        toast.error("Failed to load product category details.");
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    fetchProductDetails();
  }, [decodedCategoryName, axiosPublic]);

  // Convert dateTime string to Date object
  const parseDate = (dateString) => {
    if (!dateString) {
      console.error("Invalid dateString:", dateString); // Log the error for debugging
      return null; // Return null or some default date
    }

    // Parse the date string using Date.parse or create a new Date object directly
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateString); // Log if the date is invalid
      return null; // Return null or some default date
    }

    return date; // Return the valid date object
  };

  // Extract start and end dates from selectedDateRange
  const startDate = selectedDateRange?.start ? new Date(selectedDateRange.start.year, selectedDateRange.start.month - 1, selectedDateRange.start.day) : null;
  const endDate = selectedDateRange?.end ? new Date(selectedDateRange.end.year, selectedDateRange.end.month - 1, selectedDateRange.end.day) : null; // Adjust end date to include the entire end day
  const adjustedEndDate = endDate ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1) : null; // Add 1 day and subtract 1 ms

  const currentDate = today(getLocalTimeZone());

  // Function to get low stock products (SKU ≤ 10 and > 0)
  const handleShowLowStockProducts = () => {
    setShowLowStock(true);
    setShowOutOfStock(false);
  };

  // Function to get out of stock products (SKU === 0)
  const handleShowOutOfStockProducts = () => {
    setShowOutOfStock(true);
    setShowLowStock(false);
  };

  // Filter products based on search and selected tab
  const searchedProductDetails = productDetails?.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    // const isNumberQuery = !isNaN(query) && query !== '';

    const publishDate = parseDate(product.publishDate);
    const isDateInRange = startDate && adjustedEndDate
      ? (publishDate >= startDate && publishDate <= adjustedEndDate)
      : true;

    // Calculate total SKU for all product variants
    const totalSku = product?.productVariants?.reduce((acc, variant) => acc + variant?.sku, 0) || 0;

    const matchesSearch =
      product?.productTitle?.toLowerCase().includes(query) ||
      product?.productId?.toLowerCase().includes(query) ||
      product?.status?.toLowerCase().includes(query) ||
      product?.productVariants?.some(variant => variant?.sku?.toString().includes(query)) ||
      product?.category?.toLowerCase().includes(query) ||
      product?.regularPrice?.toString().includes(query) || // Convert regularPrice to string for searching
      product?.allSizes?.some(size => size.toString().toLowerCase().includes(query)) || // Convert sizes to string
      product?.season?.some(season => season.toString().toLowerCase().includes(query)) || // Convert season to string
      product?.availableColors?.some(color => color?.value?.toLowerCase().includes(query)) ||
      product?.vendors?.some(vendor => vendor?.value?.toLowerCase().includes(query)) ||
      product?.shippingDetails?.some(shipping => shipping?.shippingZone?.toLowerCase().includes(query)) ||
      product?.shippingDetails?.some(shipping => shipping?.selectedShipmentHandler?.shipmentHandlerName?.toLowerCase().includes(query)) ||
      totalSku.toString().includes(query); // Convert total SKU to string for searching

    return isDateInRange && matchesSearch;
  });

  const getOrderCounts = () => {
    return {
      'All': productDetails?.filter(product => product?.status).length || 0,
      'Active': productDetails?.filter(product => product?.status === 'active').length || 0,
      'Draft': productDetails?.filter(product => product?.status === 'draft').length || 0,
      'Archived': productDetails?.filter(product => product?.status === "archive").length || 0,
    };
  };

  // Memoize counts to prevent unnecessary recalculations
  const counts = useMemo(getOrderCounts, [productDetails]);

  // Append counts to tabs
  const tabsWithCounts = useMemo(() => {
    return productStatusTab?.map(tab => `${tab} (${counts[tab] || 0})`);
  }, [counts]);

  const getFilteredProducts = () => {
    switch (selectedTab) {
      case 'Active':
        return productDetails?.filter(product => product?.status === 'active');
      case 'Archived':
        return productDetails?.filter(product => product?.status === "archive");
      case 'Draft':
        return productDetails?.filter(product => product?.status === 'draft');
      default:
        return productDetails;
    }
  };

  const handleReset = () => {
    setSelectedDateRange(null); // Reset the selected date range
  };

  const isFilterActive = searchQuery || (selectedDateRange?.start && selectedDateRange?.end) || showLowStock || showOutOfStock;

  const filteredProducts = isFilterActive ? searchedProductDetails?.filter(product => {

    const primaryLocation = locationList?.find(location => location.isPrimaryLocation)?.locationName || null;

    if (showLowStock) {
      // Function to get low stock products (SKU ≤ 10 and > 0)
      const lowStockProducts = product.productVariants.some(variant =>
        variant.location === primaryLocation && variant.sku <= 10
      )
      return lowStockProducts;
    }

    if (showOutOfStock) {
      // Function to get out of stock products (SKU === 0)
      const outOfStockProducts = product.productVariants.some(variant =>
        variant.location === primaryLocation && variant.sku === 0
      )
      return outOfStockProducts;
    }
    return true;

  }) : getFilteredProducts();

  const paginatedProducts = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts?.slice(startIndex, endIndex);
  }, [filteredProducts, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown)); // Toggle the clicked dropdown
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemsPerPageChange = (newValue) => {
    setItemsPerPage(newValue);
    setPage(0); // Reset to first page when changing items per page
  };

  const handleGoToEditPage = (id) => {
    router.push(`/dash-board/product-hub/products/${id}`);
  };

  const handlePassProduct = (product) => {

    // Process the data to group by location
    const groupedByLocation = product?.productVariants?.reduce((acc, variant) => {
      const { location, color, size, sku } = variant;

      if (!acc[location]) {
        acc[location] = { colors: new Set(), sizes: new Set(), totalSku: 0 };
      }

      acc[location].colors.add(color.label);
      acc[location].sizes.add(size);
      acc[location].totalSku += sku;

      return acc;
    }, {});

    // Store the processed data in a state to pass to the modal
    setGroupedByLocation(groupedByLocation);
    setSkuModalOpen(true); // Open the modal
  };

  useEffect(() => {
    if (paginatedProducts?.length === 0) {
      setPage(0); // Reset to the first page if no data
    }
  }, [paginatedProducts]);

  if (isLocationPending || isUserLoading) {
    return <Loading />
  };

  return (
    <div className='relative w-full min-h-screen bg-gray-50'>

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

      <div className='max-w-screen-2xl mx-auto px-6 2xl:px-0 pt-6 pb-6 relative'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-3xl'>Look at {decodedCategoryName}</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/dash-board/product-hub/products/existing-products"> <span className='border border-black rounded-full p-1 md:p-2 hover:scale-105 duration-300'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <div className='flex justify-between flex-wrap items-center gap-3 md:gap-0 max-w-screen-2xl mx-auto pb-3 px-6 2xl:px-0'>

        <TabsOrder
          tabs={tabsWithCounts}
          selectedTab={`${selectedTab} (${counts[selectedTab] || 0})`} // Pass the selected tab with the count
          onTabChange={(tab) => setSelectedTab(tab.split(' (')[0])} // Extract the tab name without the count
        />

        <div className='min-w-[40%]'>
          {/* Search Product Item */}
          <li className="flex items-center relative group">
            <svg
              className="absolute left-4 fill-[#9e9ea7] w-4 h-4 icon cursor-pointer"
              aria-hidden="true"
              viewBox="0 0 24 24"
              onClick={() => {
                setSearchQuery(''); // Clear the search query
                setSelectedTab('All'); // Switch to the 'All' tab
              }}
            >
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              type="search"
              placeholder="Filter Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-white transition-[border-color,background-color] font-semibold text-neutral-600 duration-300 ease-in-out focus:outline-none focus:border-[#F4D3BA] hover:shadow-none focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base shadow placeholder:text-neutral-400"
            />
          </li>
        </div>

        <div ref={dropdownRef} className="relative inline-block text-left z-50">

          <button onClick={() => toggleDropdown('other')} className="relative z-[1] flex items-center gap-x-1.5 rounded-lg bg-[#ffddc2] px-3 py-3 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[10px] md:text-[14px] text-neutral-700">
            CUSTOMIZE
            <svg
              className={`h-5 w-5 transform transition-transform duration-300 ${openDropdown === "other" ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'other' && (
            <div className="absolute right-0 z-10 mt-2 w-64 md:w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1 flex flex-col gap-2">

                <div className='flex items-center gap-2'>
                  <DateRangePicker
                    label="Order Duration"
                    visibleMonths={1}
                    onChange={(range) => setSelectedDateRange(range)} // Ensure range is an array
                    value={selectedDateRange} // Ensure this matches the expected format
                    maxValue={currentDate}
                  />

                  {selectedDateRange && selectedDateRange.start && selectedDateRange.end && (
                    <button className="hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1" onClick={handleReset}>
                      <IoMdClose size={20} />
                    </button>
                  )}
                </div>

                {/* Choose Columns Button */}
                <button className="relative z-[1] flex items-center justify-center gap-x-3 rounded-lg bg-[#ffddc2] px-[18px] py-3 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-semibold text-[14px] text-neutral-700 w-full" onClick={() => { setColumnModalOpen(true) }}>
                  Choose Columns <TbColumnInsertRight size={20} />
                </button>

                <div className='flex items-center gap-2'>
                  {/* Low stock product Button */}
                  <button className={`relative z-[1] flex items-center justify-center gap-x-3 rounded-lg px-[18px] ${showLowStock ? 'bg-[#ffe69d]' : 'bg-[#fff3cd] hover:bg-[#ffe69d]'
                    } py-3 transition-[background-color] duration-300 ease-in-out font-semibold text-[14px] text-neutral-700 w-full`} onClick={handleShowLowStockProducts}>
                    Low Stock <BsGraphDownArrow size={20} />
                  </button>
                  {showLowStock &&
                    <button className="hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1" onClick={() => { setShowLowStock(false) }}>
                      <IoMdClose size={20} />
                    </button>
                  }
                </div>

                <div className='flex items-center gap-2'>
                  {/* Out of stock Button */}
                  <button className={`relative z-[1] flex items-center justify-center gap-x-3 rounded-lg ${showOutOfStock ? 'bg-[#bdf6b4]' : 'bg-[#d4ffce] hover:bg-[#bdf6b4]'} px-[18px] py-3 transition-[background-color] duration-300 ease-in-out font-semibold text-[14px] text-neutral-700 w-full`} onClick={handleShowOutOfStockProducts}>
                    Out of Stock <TbBoxOff size={20} />
                  </button>
                  {showOutOfStock && <button className="hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1" onClick={() => { setShowOutOfStock(false) }}>
                    <IoMdClose size={20} />
                  </button>}
                </div>

              </div>
            </div>
          )}
        </div>

      </div>

      {isLoading ? (
        <div className="min-h-[700px] flex justify-center items-center relative z-10">
          <SmallHeightLoading />
        </div>
      ) : (
        paginatedProducts?.length > 0 ? (
          <div className='mx-6 2xl:mx-0 custom-max-h-order'>
            <div className="max-w-screen-2xl mx-auto custom-max-h-order overflow-x-auto custom-scrollbar relative drop-shadow rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-[1] w-full bg-white">
                  <tr className='w-full'>

                    {columnOrder.map((column, index) => selectedColumns.includes(column) && (
                      <th key={index} className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">{column}</th>
                    ))}

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

                  {paginatedProducts?.map((product, index) => (
                    <tr key={product?._id || index} className="hover:bg-gray-50 transition-colors">
                      {columnOrder.map(
                        (column) =>
                          selectedColumns.includes(column) && (
                            <>
                              {column === 'Product' && (
                                <td key="Product" onClick={isAuthorized ? () => handleGoToEditPage(product?._id) : undefined} className={`text-xs p-3 ${isAuthorized ? "cursor-pointer text-blue-600 hover:text-blue-800" : "text-neutral-800"} flex flex-col lg:flex-row items-center gap-3`}>
                                  <div>
                                    <Image className='h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5' src={product?.thumbnailImageUrl} alt='productIMG' height={600} width={600} />
                                  </div>
                                  <div className='flex flex-col'>
                                    <p>{product?.productTitle}</p>
                                    <p>{product?.productId}</p>
                                  </div>
                                </td>
                              )}
                              {column === 'Status' && (
                                <td key="Status" className="text-xs p-3 text-gray-700 text-center">
                                  <span className={`px-2 py-0.5 ${product?.status === "active" ? "bg-green-200 text-green-800 rounded-full"
                                    : product?.status === "archive" ? "bg-blue-200 text-blue-800 rounded-full"
                                      : "bg-yellow-200 text-yellow-800 rounded-full"}`}>
                                    {product?.status === "active" ? "Active"
                                      : product?.status === "archive" ? "Archived"
                                        : "Draft"}
                                  </span>
                                </td>
                              )}
                              {column === 'SKU' && (
                                <td key="SKU" onClick={() => { handlePassProduct(product), setSkuModalOpen(true) }} className="text-xs p-3 text-center text-blue-500 hover:underline hover:cursor-pointer">{product?.productVariants?.length > 0
                                  ? `${product.productVariants.reduce((acc, variant) => acc + variant.sku, 0)} ${product.productVariants.reduce((acc, variant) => acc + variant.sku, 0) === 1 ? 'Item' : 'Items'}`
                                  : 'No Items'}</td>
                              )}
                              {column === 'Season' && (
                                <td key="Season" className="text-xs p-3 text-gray-700 text-center">{product?.season?.map((season, index) => (
                                  <span key={index}>
                                    {season}
                                    {index < product.season.length - 1 ? <>,<br /></> : null}
                                  </span>
                                )) || '--'}</td>
                              )}
                              {column === 'Price' && (
                                <td key="Price" className="text-xs p-3 text-gray-700 text-center">৳ {product?.regularPrice}</td>
                              )}
                              {column === 'Discount (৳ / %)' && (
                                <td key="Discount (৳ / %)" className="text-xs p-3 text-gray-700 text-center">{product?.discountValue && product?.discountValue != 0 ?
                                  `${product?.discountType === 'Flat' ? '৳' : ''} ${product?.discountValue} ${product?.discountType === 'Percentage' ? '%' : ''}`
                                  : '--'}
                                </td>
                              )}
                              {column === 'Sizes' && (
                                <td key="Sizes" className="text-xs p-3 text-gray-700 text-center">{product?.allSizes?.join(', ') || 'No sizes available'}</td>
                              )}
                              {column === 'Colors' && (
                                <td key="Colors" className="text-xs p-3 text-gray-700 text-center">{product?.availableColors?.map(colorObj => (
                                  <span key={colorObj._id} style={{ backgroundColor: colorObj.color }} className="inline-block w-5 h-5 mr-1 rounded-full text-center"></span>
                                ))}</td>
                              )}
                              {column === 'Vendor' && (
                                <td key="Vendor" className="text-xs p-3 text-gray-700 text-center">{product?.vendors?.length > 0 ? <div>{product?.vendors?.map((vendor, index) => (<div key={index}>{vendor?.value}</div>))}</div> : <div>--</div>} </td>
                              )}
                              {column === 'Shipping Zones' && (
                                <td key="Shipping Zones" className="text-xs p-3 text-gray-700 text-center">{product?.shippingDetails?.map(detail => detail.shippingZone).join(', ') || '--'}</td>
                              )}
                              {column === 'Shipment Handlers' && (
                                <td key="Shipment Handlers" className="text-xs p-3 text-gray-700 text-center">
                                  {product?.shippingDetails
                                    ? Array.from(new Set(product.shippingDetails.map(detail => detail.selectedShipmentHandler.shipmentHandlerName)))
                                      .join(', ')
                                    : '--'}
                                </td>
                              )}
                            </>
                          )
                      )}
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>

        ) : (
          <div className="min-h-[calc(100vh-300px)] flex justify-center items-center relative z-10 px-6">
            <h1 className="text-center text-xl lg:text-2xl xl:text-3xl font-bold bg-gray-50 py-8">There are no products listed in this category yet.</h1>
          </div>
        )
      )}

      {/* Column Selection Modal */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setColumnModalOpen(false)}>
        <ModalContent>
          <ModalHeader className='bg-gray-200'>Choose Columns</ModalHeader>
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
          <ModalFooter className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Button onClick={handleDeselectAll} size="sm" color="default" variant="flat">
                Deselect All
              </Button>
              <Button onClick={handleSelectAll} size="sm" color="primary" variant="flat">
                Select All
              </Button>
            </div>
            <Button variant="solid" color="primary" size='sm' onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal of tracking number */}
      <Modal size='2xl' isOpen={isSkuModalOpen} onOpenChange={() => setSkuModalOpen(false)}>
        <ModalContent className='mx-4 lg:mx-0'>
          <ModalHeader className="flex flex-col gap-1 bg-gray-200 px-8">
            Details
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              {Object?.entries(groupedByLocation)?.map(([location, details]) => (
                <div key={location} className="border-l p-3">
                  <h3 className="font-bold text-lg mb-2">Location: {location}</h3>
                  <p className="text-gray-700">
                    <strong>Colors:</strong> {details.colors.size}
                  </p>
                  <p className="text-gray-700">
                    <strong>Sizes:</strong> {details.sizes.size}
                  </p>
                  <p className="text-gray-700">
                    <strong>Total SKUs:</strong> {details.totalSku}
                  </p>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter className='border'>
            <Button variant='light' color="danger" onClick={() => setSkuModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Pagination Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <CustomPagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
        <PaginationSelect
          options={[25, 50, 100]} // ✅ Pass available options
          value={itemsPerPage} // ✅ Selected value
          onChange={handleItemsPerPageChange} // ✅ Handle value change
        />
      </div>

    </div>
  );
};

export default ProductPage;