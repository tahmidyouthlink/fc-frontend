import Link from 'next/link';
import React from 'react';
import { IoMdAdd } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";

const Products = () => {
  return (
    <div className="mt-32 md:mt-0 md:min-h-screen flex flex-col md:flex-row justify-center items-center gap-6">
      <div className="button-container">
        <Link href="/dash-board/products/add-product">
          <button className="brutalist-button openai button-1">
            <IoMdAdd className='openai-icon' />
            <div className="button-text">
              <span>New </span>
              <span>Product</span>
            </div>
          </button>
        </Link>
      </div>
      <div className="button-container">
        <Link href="/dash-board/products/edit-product">
          <button className="brutalist-button openai button-1">
            <FaRegEdit className='openai-icon' />
            <div className="button-text">
              <span>Existing</span>
              <span>Product</span>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Products;