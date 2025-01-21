"use client";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import arrowSvgImage from "../../../public/card-images/arrow.svg";
import arrivals1 from "../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../public/card-images/arrivals2.svg";
import useProductsInformation from '@/app/hooks/useProductsInformation';
import Loading from '@/app/components/shared/Loading/Loading';
import LocationDropdown from '@/app/components/layout/LocationDropdown';
import Image from 'next/image';
import CustomPagination from '@/app/components/layout/CustomPagination';
import { Button } from '@nextui-org/react';
import useOrders from '@/app/hooks/useOrders';
import useLocations from '@/app/hooks/useLocations';

const InventoryPage = () => {

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [productList, isProductPending, refetch] = useProductsInformation();
  const [orderList, isOrderPending] = useOrders();
  const [locationList, isLocationPending] = useLocations();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dropdownRef = useRef(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [locationNameForMessage, setLocationNameForMessage] = useState("");

  useEffect(() => {
    if (searchQuery) {
      refetch();  // RefetchOrders when search query changes
    }
  }, [searchQuery, refetch]);

  const handleLocationSelect = (locationName) => {
    // Set location message to notify the user of the selected inventory location
    setLocationNameForMessage(locationName);

    // Step 1: Filter product variants by the selected location
    const filteredVariants = productList?.flatMap((product) =>
      product.productVariants
        ?.filter((variant) => variant?.location === locationName)
        .map((variant) => ({
          productTitle: product?.productTitle,
          size: variant?.size,
          color: variant?.color.label, // Display color label
          colorCode: variant?.color.color, // Display color code for visualization
          sku: variant?.sku,
          imageUrl: variant?.imageUrls[0], // Assuming you want the first image
          productId: product?.productId,
        }))
    );

    // Step 2: Set the filtered products with unique combinations of size and color
    setFilteredProducts(filteredVariants);
  };

  // Filter products based on search query
  const searchedProducts = filteredProducts?.filter(product => {
    const query = searchQuery.toLowerCase();
    const isNumberQuery = !isNaN(query) && query.trim() !== '';

    // Check if any product detail contains the search query
    const productTitle = (product.productTitle || '').toLowerCase();
    const productId = (product.productId || '').toLowerCase();
    const size = (product.size !== undefined && product.size !== null) ? product.size.toString().toLowerCase() : ''; // Convert size to string
    const color = (product.color || '').toLowerCase();
    const sku = (product.sku || '').toString();

    // Check for matches
    return (
      productTitle.includes(query) ||
      productId.includes(query) ||
      size.includes(query) ||
      color.includes(query) ||
      (isNumberQuery && sku === query) // Numeric comparison for SKU
    );
  });

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(0); // Reset to first page when changing items per page
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchedProducts?.slice(startIndex, endIndex);
  }, [searchedProducts, page, itemsPerPage]);

  const totalPages = Math.ceil(searchedProducts?.length / itemsPerPage);

  const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);

  // Export to CSV
  const exportToCSV = () => {
    const filteredData = filteredProducts.map(product => ({
      productName: product.productTitle,
      size: product.size,
      available: product.sku,
      onHand: product.sku,
    }));

    // Set filename and convert data to CSV format
    const fileName = 'products_data';
    const csv = Papa.unparse(filteredData);

    // Create blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    document.body.appendChild(link); // Append to body for Firefox compatibility
    link.click();
    document.body.removeChild(link); // Clean up the DOM
  };

  // Export to PDF
  const exportToPDF = async () => {
    const { jsPDF } = await import("jspdf"); // Dynamic import of jsPDF
    const autoTable = (await import("jspdf-autotable")).default; // Import autoTable

    // Create PDF document in landscape orientation
    const doc = new jsPDF('landscape');

    // Define table columns
    const columns = [
      { header: 'Product Name', dataKey: 'productName' },
      { header: 'Size', dataKey: 'size' },
      { header: 'Available', dataKey: 'available' },
      { header: 'On hand', dataKey: 'onHand' },
    ];

    // Map product details to table rows
    const rows = filteredProducts.map(product => ({
      productName: product.productTitle,
      size: product.size,
      available: product.sku,
      onHand: product.sku,
    }));

    // Generate table with autoTable
    autoTable(doc, {
      columns,
      body: rows,
      startY: 10,
      styles: { fontSize: 8, halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [22, 160, 133] }, // Optional head style color
      theme: "striped",
    });

    // Save the PDF file
    doc.save('products_data.pdf');
  };

  // Export to XLSX
  const exportToXLS = () => {
    // Map filtered products to JSON format suitable for Excel
    const filteredData = filteredProducts.map(product => ({
      productName: product.productTitle,
      size: product.size,
      available: product.sku,
      onHand: product.sku,
    }));

    // Convert JSON data to worksheet and create workbook
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Export workbook as .xlsx file
    XLSX.writeFile(workbook, 'products_data.xlsx');
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

  useEffect(() => {
    if (paginatedProducts?.length === 0) {
      setPage(0); // Reset to the first page if no data
    }
  }, [paginatedProducts]);

  if (isProductPending || isOrderPending || isLocationPending) {
    return <Loading />
  };

  console.log(locationNameForMessage, "locationList");

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

      <div className='max-w-screen-2xl px-6 2xl:px-0 mx-auto'>
        <div className='flex flex-wrap lg:flex-nowrap items-center justify-between py-2 md:py-5 gap-2'>

          <div className='w-full flex items-center gap-1'>
            <h3 className='text-center md:text-start font-semibold text-xl lg:text-2xl'>Inventory:</h3>
            <LocationDropdown onLocationSelect={handleLocationSelect} />
          </div>

          <div ref={dropdownRef} className="relative inline-block text-left">
            <Button onClick={toggleDropdown} className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
              Download Data
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
              <div className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-1">

                  <div className='flex flex-col gap-2 w-full'>
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

                    {/* Button to export to PDF */}
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
              </div>
            )}
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
                placeholder="Search By Product Details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-white text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base"
              />
            </li>
          </div>

        </div>

        <div className="max-w-screen-2xl mx-auto custom-max-h-inventory overflow-x-auto custom-scrollbar relative drop-shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-[1] bg-white">
              <tr>
                <th key="product" className="text-[10px] md:text-xs px-2 pr-2 xl:px-3 xl:pr-2 text-gray-700 border-b pl-20 xl:pl-20">Product</th>
                <th key="onProcess" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">On process</th>
                <th key="available" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">Available</th>
                <th key="onHand" className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">On hand</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500 py-80">
                    <h1 className="text-xl font-semibold text-neutral-800">No Products Available!</h1>
                    <div>
                      {locationNameForMessage === "" ? (
                        <span>Please  <span className='font-bold text-lg text-black'>select</span> a location to view inventory.</span>
                      ) : (
                        <div>
                          <h1>Please update inventory for this location.</h1>
                          <p>
                            Currently, there are no products in stock for <span className='font-bold text-lg text-black'>{locationNameForMessage}</span>.
                          </p>
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ) : (
                paginatedProducts?.map((product, index) => {
                  // Calculate "onProcess" and "available"
                  let onProcess = 0; // Default value
                  let available = product?.sku; // Default value is the product's SKU

                  // Check for matching products in the orderList
                  orderList?.forEach(order => {
                    order?.productInformation.forEach(orderProduct => {
                      const isMatchingProduct =
                        product?.productTitle === orderProduct?.productTitle &&
                        product?.productId === orderProduct?.productId &&
                        product?.size === orderProduct?.size &&
                        product?.colorCode === orderProduct.color?.color;

                      if (isMatchingProduct) {
                        if (order?.orderStatus === "Pending") {
                          // Add to "onProcess"
                          onProcess += orderProduct?.sku;
                        } else if (order?.orderStatus === "Processing") {
                          // Subtract from "available"
                          onProcess += orderProduct?.sku;
                          available -= orderProduct?.sku;
                        }
                      }
                    });
                  });

                  // Find the primary location
                  const primaryLocation = locationList?.find(location => location.isPrimaryLocation)?.locationName;

                  // Check if the primary location matches the selected location
                  const isMatchingLocation = primaryLocation === locationNameForMessage;

                  return (
                    <tr key={product?._id || index} className="hover:bg-gray-50 transition-colors">
                      <td key="product" className="text-sm p-3 text-neutral-500 text-center cursor-pointer flex flex-col lg:flex-row items-center gap-3">
                        <div>
                          <Image
                            className="h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5"
                            src={product?.imageUrl}
                            alt="productIMG"
                            height={600}
                            width={600}
                          />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-1">
                          <p className="font-bold text-blue-700 text-start">{product?.productTitle}</p>
                          <p className="font-medium">{product?.size}</p>
                          <span className="flex items-center gap-2">{product.color}</span>
                        </div>
                      </td>
                      <td key="onProcess" className="text-center"> {isMatchingLocation ? onProcess : 0}</td>
                      <td key="available" className="text-center"> {isMatchingLocation ? available : product?.sku}</td>
                      <td key="onHand" className="text-center">{product?.sku}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

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
  );
};

export default InventoryPage;