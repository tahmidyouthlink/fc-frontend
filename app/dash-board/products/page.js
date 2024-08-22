import Link from 'next/link';
import React from 'react';
import { IoMdAdd } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";

const Products = () => {
  return (
    <>
      <div className="min-h-screen justify-center items-center flex gap-6 md:gap-12">
        <div className="button-container">
          <Link href="/dash-board/products/add-product">
            <button className="brutalist-button openai button-1 animate-ripple">
              <IoMdAdd className="openai-icon animate-spin-and-zoom" />
              <div className="button-text animate-fade-in">
                <span>New </span>
                <span>Product</span>
              </div>
            </button>
          </Link>
        </div>
        <div className="button-container">
          <Link href="/dash-board/products/edit-product">
            <button className="brutalist-button openai button-1 animate-ripple">
              <FaRegEdit className="openai-icon animate-spin-and-zoom" />
              <div className="button-text animate-fade-in">
                <span>Existing</span>
                <span>Product</span>
              </div>
            </button>
          </Link>
        </div>
      </div>

    </>
  );
};

export default Products;