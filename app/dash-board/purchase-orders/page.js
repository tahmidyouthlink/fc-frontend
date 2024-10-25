"use client";
import React, { useState } from 'react';
import arrowSvgImage from "../../../public/card-images/arrow.svg";
import arrivals1 from "../../../public/card-images/arrivals1.svg";
import arrivals2 from "../../../public/card-images/arrivals2.svg";
import CustomPagination from '@/app/components/layout/CustomPagination';
import { Button, Checkbox, CheckboxGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import TabsOrder from '@/app/components/layout/TabsOrder';
import Link from 'next/link';

const PurchaseOrders = () => {

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

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

          <h3 className='text-center md:text-start font-semibold text-xl lg:text-2xl'>Purchase orders</h3>

          <button className="cursor-pointer hover:bg-neutral-950 bg-neutral-800 text-white shadow-lg font-semibold px-4 py-2 rounded-lg">
            <Link href={"/dash-board/purchase-orders/create-purchase-order"}>Create purchase order</Link>
          </button>

        </div>

        {/* Search Product Item
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
        </div> */}

      </div>

    </div>
  );
};

export default PurchaseOrders;