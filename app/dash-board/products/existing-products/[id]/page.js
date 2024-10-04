"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import arrowSvgImage from "../../../../../public/card-images/arrow.svg";
import arrivals1 from "../../../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../../../public/card-images/arrivals2.svg";
import SmallHeightLoading from '@/app/components/shared/Loading/SmallHeightLoading';
import { Button, Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import TabsOrder from '@/app/components/layout/TabsOrder';
import CustomPagination from '@/app/components/layout/CustomPagination';
import Link from 'next/link';

const columns = ['Product', 'Status', 'SKU', 'Category', 'Price', 'Sizes', 'Colors', 'Vendor', 'Shipping Zones', 'Shipment Handlers'];

const productStatusTab = ['All', 'Active', 'Archive', 'Draft'];

const ProductPage = () => {

  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const router = useRouter();

  // Decode the URL-encoded category name
  const decodedCategoryName = decodeURIComponent(id);

  const [productDetails, setProductDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(productStatusTab[0]);
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedColumnsProductCategory'));
    if (savedColumns) {
      setSelectedColumns(savedColumns);
    } else {
      setSelectedColumns([]);
    }
  }, []);

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

  // Filter products based on search and selected tab
  const searchedProductDetails = productDetails?.filter((product) => {
    // Calculate total SKU for all product variants
    const totalSku = product?.productVariants?.reduce((acc, variant) => acc + variant?.sku, 0);

    const matchesSearch =
      product?.productTitle?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      product?.productId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      product?.status?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      product?.productVariants?.some(variant => variant?.sku?.toString()?.includes(searchQuery)) ||
      product?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      product?.regularPrice?.includes(searchQuery) ||
      product?.allSizes?.some(size => size.toLowerCase()?.includes(searchQuery.toLowerCase())) ||
      product?.availableColors?.some(color => color?.value?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
      product?.vendors?.some(vendor => vendor?.value?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
      product?.shippingDetails?.some(shipping => shipping?.shippingZone?.toLowerCase()?.includes(searchQuery.toLowerCase())) ||
      product?.shippingDetails?.some(shipping => shipping?.selectedShipmentHandler?.shipmentHandlerName?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
      totalSku?.toString()?.includes(searchQuery); // Search by total SKU

    return matchesSearch;
  });

  const getFilteredProducts = () => {
    switch (selectedTab) {
      case 'Active':
        return productDetails?.filter(product => product?.status === 'active');
      case 'Archive':
        return productDetails?.filter(product => product?.status === "archive");
      case 'Draft':
        return productDetails?.filter(product => product?.status === 'draft');
      default:
        return productDetails;
    }
  };

  const isFilterActive = searchQuery;

  const filteredProducts = isFilterActive ? searchedProductDetails : getFilteredProducts();

  const paginatedOrders = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts?.slice(startIndex, endIndex);
  }, [filteredProducts, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);

  const handleColumnChange = (selected) => {
    setSelectedColumns(selected);
  };

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

  const handleSelectAll = () => {
    setSelectedColumns(columns);
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleSave = () => {
    localStorage.setItem('selectedColumnsProductCategory', JSON.stringify(selectedColumns));
    setColumnModalOpen(false);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(0); // Reset to first page when changing items per page
  };

  const handleGoToEditPage = (id) => {
    router.push(`/dash-board/products/${id}`);
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
        className='absolute inset-0 z-0 top-2 md:top-5 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />

      <div className='max-w-screen-2xl mx-auto px-6 2xl:px-0 pt-6 pb-6 relative'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-xl md:text-2xl lg:text-3xl'>Look at Our Products</h1>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href="/dash-board/products/existing-products"> <span className='border border-black rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <div className='flex justify-between flex-wrap items-center gap-3 md:gap-0 max-w-screen-2xl mx-auto pb-3 px-6 2xl:px-0'>

        <TabsOrder
          tabs={productStatusTab}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />

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
              <div className="p-1 flex flex-col gap-2">

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
                    className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30 text-[12px] md:text-base"
                  />
                </li>

                <Button color="danger" size='sm' onClick={() => { setColumnModalOpen(true) }}>
                  Choose Columns
                </Button>

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
        paginatedOrders?.length > 0 ? (
          <div className='mx-6 2xl:mx-0 custom-max-h-orders'>
            <div className='bg-white max-w-screen-2xl mx-auto relative'>
              <div className="max-w-screen-2xl mx-auto overflow-x-auto modal-body-scroll">
                <table className="w-full text-left border-collapse rounded-lg">
                  <thead className="sticky top-0 z-[1] w-full">
                    <tr className='w-full'>

                      {selectedColumns.includes('Product') && (
                        <th className="text-[10px] md:text-xs p-2 pl-6 lg:pl-20 text-gray-700 border-b ">Product</th>
                      )}
                      {selectedColumns.includes('Status') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Status</th>
                      )}
                      {selectedColumns.includes('SKU') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">SKU</th>
                      )}
                      {selectedColumns.includes('Category') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Category</th>
                      )}
                      {selectedColumns.includes('Price') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Price</th>
                      )}
                      {selectedColumns.includes('Sizes') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Sizes</th>
                      )}
                      {selectedColumns.includes('Colors') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Colors</th>
                      )}
                      {selectedColumns.includes('Vendor') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Vendor</th>
                      )}
                      {selectedColumns.includes('Shipping Zones') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Shipping Zones</th>
                      )}
                      {selectedColumns.includes('Shipment Handlers') && (
                        <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b ">Shipment Handlers</th>
                      )}

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">

                    {paginatedOrders?.map((product, index) => (
                      <tr key={product?._id || index} className="hover:bg-gray-50 transition-colors">
                        {selectedColumns.includes('Product') && (
                          <td onClick={() => handleGoToEditPage(product?._id)} className="text-xs p-3 font-mono cursor-pointer text-blue-600 hover:text-blue-800 flex flex-col lg:flex-row items-center gap-3">
                            <div>
                              <Image className='h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5' src={product?.imageUrls[0]} alt='productIMG' height={600} width={600} />
                            </div>
                            <div className='flex flex-col items-center'>
                              <p>{product?.productTitle}</p>
                              <p>{product?.productId}</p>
                            </div>
                          </td>
                        )}
                        {selectedColumns.includes('Status') && (
                          <td className="text-xs p-3 text-gray-700">
                            <span className={`px-2 py-0.5 ${product?.status === "active" ? "bg-green-200 text-green-800 rounded-full"
                              : product?.status === "archive" ? "bg-blue-200 text-blue-800 rounded-full"
                                : "bg-yellow-200 text-yellow-800 rounded-full"}`}>
                              {product?.status === "active" ? "Active"
                                : product?.status === "archive" ? "Archive"
                                  : "Draft"}
                            </span>
                          </td>
                        )}
                        {selectedColumns.includes('SKU') && (
                          <td className="text-xs p-3 text-gray-700">{product?.productVariants?.length > 0
                            ? `${product.productVariants.reduce((acc, variant) => acc + variant.sku, 0)} ${product.productVariants.reduce((acc, variant) => acc + variant.sku, 0) === 1 ? 'Item' : 'Items'}`
                            : 'No Items'}</td>
                        )}
                        {selectedColumns.includes('Category') && (
                          <td className="text-xs p-3 text-gray-700">{product?.category}</td>
                        )}
                        {selectedColumns.includes('Price') && (
                          <td className="text-xs p-3 text-gray-700">৳ {product?.regularPrice}</td>
                        )}
                        {selectedColumns.includes('Sizes') && (
                          <td className="text-xs p-3 text-gray-700"> {product?.allSizes?.join(', ') || 'No sizes available'} </td>
                        )}
                        {selectedColumns.includes('Colors') && (
                          <td className="text-xs p-3 text-gray-700">{product?.availableColors?.map(colorObj => (
                            <span key={colorObj._id} style={{ backgroundColor: colorObj.color }} className="inline-block w-5 h-5 mr-1 rounded-full"></span>
                          ))}</td>
                        )}
                        {selectedColumns.includes('Vendor') && (
                          <td className="text-xs p-3 text-gray-700">{product?.vendors?.length > 0 ? <div>{product?.vendors?.map((vendor, index) => (<div key={index}>{vendor?.value}</div>))}</div> : <div>N/A</div>} </td>
                        )}
                        {selectedColumns.includes('Shipping Zones') && (
                          <td className="text-xs p-3 text-gray-700">{product?.shippingDetails?.map(detail => detail.shippingZone).join(', ') || 'No shipping zones available'} </td>
                        )}
                        {selectedColumns.includes('Shipment Handlers') && (
                          <td className="text-xs p-3 text-gray-700">{product?.shippingDetails?.map(detail => detail.selectedShipmentHandler.shipmentHandlerName).join(', ') || 'No shipment handlers available'}
                          </td>
                        )}

                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          </div>

        ) : (
          <div className="min-h-[calc(100vh-300px)] flex justify-center items-center relative z-10 px-6">
            <h1 className="text-center text-xl lg:text-2xl xl:text-3xl font-bold bg-gray-100 py-8">There are no products listed in this category yet.</h1>
          </div>
        )
      )}
      <Modal isOpen={isColumnModalOpen} onClose={() => setColumnModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Choose Columns</ModalHeader>
          <ModalBody className="modal-body-scroll">
            <CheckboxGroup value={selectedColumns} onChange={handleColumnChange}>
              {columns.map((column) => (
                <Checkbox key={column} value={column}>
                  {column}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSelectAll} size="sm" color="primary" variant="flat">
              Select All
            </Button>
            <Button onClick={handleDeselectAll} size="sm" color="default" variant="flat">
              Deselect All
            </Button>
            <Button variant="solid" color="primary" size='sm' onClick={handleSave}>
              Save
            </Button>
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

export default ProductPage;