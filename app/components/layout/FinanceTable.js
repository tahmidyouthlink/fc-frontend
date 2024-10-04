"use client";
import useOrders from '@/app/hooks/useOrders';
import React, { useEffect, useMemo, useState } from 'react';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';
import CustomPagination from './CustomPagination';
import { Button, Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

const columns = ['Order ID', 'Customer Name', 'Payment Method', 'Transaction ID', 'Payment Status'];

const FinanceTable = () => {

  const [orderList, isOrderPending, refetch] = useOrders();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('selectedColumnsFinancesPage'));
    if (savedColumns) {
      setSelectedColumns(savedColumns);
    } else {
      setSelectedColumns([]);
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
    setSelectedColumns(columns);
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleSave = () => {
    localStorage.setItem('selectedColumnsFinancesPage', JSON.stringify(selectedColumns));
    setColumnModalOpen(false);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(0); // Reset to first page when changing items per page
  };

  // Filter orders based on search query and date range
  const searchedOrders = orderList?.filter(order => {
    const query = searchQuery.toLowerCase();

    // Check if order details match the search query
    const orderMatch = (
      (order.orderNumber || '').toLowerCase().includes(query) ||
      (order.customerName || '').toLowerCase().includes(query) || // Added customerName search
      (order.paymentMethod || '').toLowerCase().includes(query) ||
      (order.transactionId || '').toLowerCase().includes(query) ||
      (order.paymentStatus || '').toLowerCase().includes(query)
    );

    return orderMatch;
  });

  const paginatedOrders = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchedOrders?.slice(startIndex, endIndex);
  }, [searchedOrders, page, itemsPerPage]);

  const totalPages = Math.ceil(searchedOrders?.length / itemsPerPage);

  if (isOrderPending) {
    return <SmallHeightLoading />
  }

  return (
    <div>

      <div className='mt-8 md:mt-16 flex items-center justify-between gap-6'>
        <div className="py-1 flex-1">
          <Button variant="light" color="primary" onClick={() => { setColumnModalOpen(true) }} className="w-full">
            Choose Columns
          </Button>
        </div>
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
      {/* Column Selection Modal */}
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

      <div className="max-w-screen-2xl mx-auto custom-max-discount overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-[1] rounded-md">
            <tr>
              {selectedColumns.includes('Order ID') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Order ID</th>
              )}
              {selectedColumns.includes('Customer Name') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Customer Name</th>
              )}
              {selectedColumns.includes('Payment Method') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Payment Method</th>
              )}
              {selectedColumns.includes('Transaction ID') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Transaction ID</th>
              )}
              {selectedColumns.includes('Payment Status') && (
                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Status</th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders?.map((order, index) => {

              return (
                <>
                  <tr key={order?._id || index} className="hover:bg-gray-50 transition-colors">
                    {selectedColumns.includes('Order ID') && (
                      <td className="text-xs p-3 text-gray-700">{order?.orderNumber}</td>
                    )}
                    {selectedColumns.includes('Customer Name') && (
                      <td className="text-xs p-3 text-gray-700">{order?.customerName}</td>
                    )}
                    {selectedColumns.includes('Payment Method') && (
                      <td className="text-xs p-3 text-gray-700">{order?.paymentMethod}</td>
                    )}
                    {selectedColumns.includes('Transaction ID') && (
                      <td className="text-xs p-3 text-gray-700">{order?.transactionId ? order.transactionId : '--'}</td>
                    )}
                    {selectedColumns.includes('Payment Status') && (
                      <td className="text-xs p-3 text-gray-700">{order?.paymentStatus}</td>
                    )}
                  </tr>
                </>
              )
            })}
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