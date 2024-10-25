"use client";
import LocationSelect from '@/app/components/layout/LocationSelect';
import VendorSelect from '@/app/components/layout/VendorSelect';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useProductsInformation from '@/app/hooks/useProductsInformation';
import { Button, DatePicker, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const CreatePurchaseOrder = () => {

 const axiosPublic = useAxiosPublic();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const router = useRouter();
 const { register, handleSubmit, setValue, formState: { errors } } = useForm();
 const [selectedVendor, setSelectedVendor] = useState("");
 const [selectedLocation, setSelectedLocation] = useState("");
 const [paymentTerms, setPaymentTerms] = useState("");
 const [dateError, setDateError] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [productList, isProductPending] = useProductsInformation();
 const { isOpen, onOpen, onOpenChange } = useDisclosure();
 const [filteredProducts, setFilteredProducts] = useState([]);
 const [selectedProducts, setSelectedProducts] = useState([]);

 const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  if (e.target.value) {
   onOpen(); // Open modal when there's input
  }
 };

 const handlePaymentTerms = (e) => {
  const payment = e.target.value;
  setPaymentTerms(payment);
 }

 const handleShowDateError = (date) => {
  if (date) {
   setDateError(false);
   return;
  }
  setDateError(true);
 }

 const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = (`0${date.getMonth() + 1}`).slice(-2); // Get month and pad with 0 if needed
  const day = (`0${date.getDate()}`).slice(-2);       // Get day and pad with 0 if needed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
 };

 // Function to calculate total SKU per size and SKU for selected location
 const calculateSkuBySizeAndLocation = (productList, selectedLocation) => {
  if (!productList || !selectedLocation) return [];

  const skuByProduct = [];

  productList.forEach(product => {
   const skuBySize = {};

   product.productVariants.forEach(variant => {
    const size = variant.size;
    const sku = variant.sku || 0;

    // Initialize if size is not already in skuBySize
    if (!skuBySize[size]) {
     skuBySize[size] = { locationSku: 0, totalSku: 0 };
    }

    // Add to total SKU for this size across all colors
    skuBySize[size].totalSku += sku;

    // If the variant matches the selected location, add its SKU to locationSku
    if (variant.location === selectedLocation) {
     skuBySize[size].locationSku += sku;
    }
   });

   skuByProduct.push({
    productTitle: product.productTitle,
    skuBySize: skuBySize,
    imageUrl: product?.imageUrls[0]
   });
  });

  return skuByProduct;
 };

 // Update filtered products whenever productList or searchQuery changes
 useEffect(() => {
  const totalSku = calculateSkuBySizeAndLocation(productList, selectedLocation);
  const filtered = totalSku.filter(product => {
   // Check if productTitle, sizes, locationSku, or totalSku match the search query
   const sizeMatches = Object.keys(product.skuBySize).some(size =>
    size.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.skuBySize[size].locationSku.toString().includes(searchQuery) || // Check locationSku
    product.skuBySize[size].totalSku.toString().includes(searchQuery) // Check totalSku
   );
   return product.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) || sizeMatches;
  });
  setFilteredProducts(filtered);
 }, [productList, searchQuery, selectedLocation]);

 const onSubmit = async (data) => {
  setIsSubmitting(true);

  const { estimatedArrival } = data;

  // Get today's date (ignoring time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Reset hours to make it a date-only comparison

  // Check if expiryDate is selected
  if (!estimatedArrival) {
   setDateError(true);
   return;  // Do not show toast here, just prevent submission
  }

  // Check if expiryDate is in the past
  const selectedEstimatedArrival = new Date(estimatedArrival);
  if (selectedEstimatedArrival < today) {
   toast.error("Expiry date cannot be in the past.");
   return;  // Prevent form submission
  }

  // If date is valid, reset the date error
  setDateError(false);

  const formattedEstimatedArrival = formatDate(estimatedArrival);
  // console.log(formattedEstimatedArrival);

  const vendorData = {

  }

  // try {
  //   const response = await axiosPublic.post('/addVendor', vendorData);
  //   if (response?.data?.insertedId) {
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
  //                 Vendor Added!
  //               </p>
  //               <p className="mt-1 text-sm text-gray-500">
  //                 Vendor has been added successfully!
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
  //     router.push("/dash-board/vendors")
  //   }
  // } catch (error) {
  //   setIsSubmitting(false);
  //   toast.error('Failed to add vendors. Please try again!');
  // }
 };

 // console.log(selectedVendor?.value, selectedLocation);
 // console.log(paymentTerms);

 if (isProductPending) {
  return <Loading />
 }

 return (
  <div className='bg-gray-100 min-h-screen px-6'>

   <div className='max-w-screen-xl mx-auto pt-3 md:pt-6 px-6'>
    <div className='flex items-center justify-between'>
     <h3 className='w-full font-semibold text-xl lg:text-2xl'>Create purchase order</h3>
     <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/purchase-orders"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
    </div>
   </div>

   <form onSubmit={handleSubmit(onSubmit)}>

    <div className='max-w-screen-xl mx-auto p-6 flex flex-col gap-4'>

     <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
      <VendorSelect selectedVendor={selectedVendor} setSelectedVendor={setSelectedVendor} />
      <LocationSelect selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
     </div>

     <div className='bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

      <div className='flex flex-col md:flex-row justify-between items-center'>

       <div className='flex-1'>
        <label htmlFor='' className='flex justify-start font-medium text-neutral-800 pb-2'>Payment Terms</label>
        <select className='w-1/2 font-semibold' onChange={handlePaymentTerms} value={paymentTerms} style={{ zIndex: 10, pointerEvents: 'auto', position: 'relative', outline: 'none' }}
        >
         <option disabled value="">Select</option>
         <option key="Cash on delivery" value="Cash on delivery">
          Cash on delivery
         </option>
         <option key="Payment on receipt" value="Payment on receipt">
          Payment on receipt
         </option>
         <option key="Payment in advance" value="Payment in advance">
          Payment in advance
         </option>
        </select>
       </div>

       <div className='flex-1'>
        <label htmlFor='estimatedArrival' className='flex justify-start font-medium text-neutral-800 pb-2'>Estimated Arrival</label>
        <DatePicker
         id='estimatedArrival'
         placeholder="Select date"
         aria-label="Select expiry date"
         onChange={(date) => {
          handleShowDateError(date);
          if (date instanceof Date && !isNaN(date)) {
           setValue('estimatedArrival', date.toISOString().split('T')[0]); // Ensure it's a valid Date object and format it as YYYY-MM-DD
          } else {
           setValue('estimatedArrival', date); // If DatePicker returns something else, handle it here
          }
         }}
         className="w-full outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md"
        />

        {dateError && (
         <p className="text-red-600 text-left">Please select Promo Expire Date.</p>
        )}
       </div>

      </div>

     </div>

     <div className='bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
      <h1 className='font-bold text-lg'>Add products</h1>
      <div className='w-full pt-2'>
       <li className="flex items-center relative group border-1.5 rounded-lg">
        <svg className="absolute left-4 fill-[#9e9ea7] w-4 h-4 icon" aria-hidden="true" viewBox="0 0 24 24">
         <g>
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
         </g>
        </svg>
        <input
         type="search"
         placeholder="Search products"
         value={searchQuery}
         onChange={handleSearchChange}
         className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-white text-[#0d0c22] transition duration-300 ease-in-out focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:bg-white  text-[12px] md:text-base"
        />
       </li>
      </div>

     </div>

     {/* Submit Button */}
     <div className='flex justify-end items-center'>
      <button
       type='submit'
       disabled={isSubmitting}
       className={`mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-[#9F5216] hover:bg-[#9f5116c9]'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-medium`}
      >
       {isSubmitting ? 'Saving...' : 'Save'}
      </button>
     </div>
    </div>

   </form>

   <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
    <ModalContent>
     {(onClose) => (
      <>
       <ModalHeader className="flex flex-col">
        <p>All products</p>
        <div className='w-full pt-1'>
         <li className="flex items-center relative group border-1.5 rounded-lg">
          <svg className="absolute left-4 fill-[#9e9ea7] w-4 h-4 icon" aria-hidden="true" viewBox="0 0 24 24">
           <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
           </g>
          </svg>
          <input
           type="search"
           placeholder="Search products"
           value={searchQuery}
           onChange={handleSearchChange}
           className="w-full h-[35px] md:h-10 px-4 pl-[2.5rem] md:border-2 border-transparent rounded-lg outline-none bg-white text-[#0d0c22] transition duration-300 ease-in-out focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:bg-white  text-[12px] md:text-base"
          />
         </li>
        </div>
       </ModalHeader>
       <ModalBody className="modal-body-scroll">
        <table className="w-full text-left border-collapse">
         <thead className="sticky top-0 z-[1] bg-white">
          <tr>
           <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b">
            Products
           </th>
           <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">
            Available at destination
           </th>
           <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">
            Total available
           </th>
          </tr>
         </thead>

         <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts?.length === 0 ? (
           <tr>
            <td colSpan="3" className="text-center p-4 text-gray-500 py-32">
             <h1 className="text-xl font-semibold text-neutral-800">
              No Products Available!
             </h1>
            </td>
           </tr>
          ) : (
           filteredProducts?.map((product, index) => (
            <React.Fragment key={index}>
             <tr className="hover:bg-gray-50 transition-colors">
              {/* Product Image and Title */}
              <td className="text-xs p-3 cursor-pointer flex items-center gap-3">
               <div>
                <Image
                 className="h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5"
                 src={product?.imageUrl}
                 alt="productIMG"
                 height={600}
                 width={600}
                />
               </div>
               <div className="flex flex-col">
                <p className="font-bold text-sm">{product?.productTitle}</p>
               </div>
              </td>
              {/* Empty cell in the first row for other columns */}
              <td colSpan="2"></td>
             </tr>

             {/* SKU by Size Rows */}
             {Object.keys(product?.skuBySize)?.map((size) => (
              <tr
               key={`${index}-${size}`}
               className="hover:bg-gray-50 transition-colors"
              >
               {/* Display size in the product name column */}
               <td className="pl-12 text-xs p-3 text-gray-600">
                <span className="font-semibold">{size}</span>
               </td>

               {/* Available at selected location */}
               <td className="text-center">
                {product?.skuBySize[size]?.locationSku}
               </td>

               {/* Total SKU available for that size */}
               <td className="text-center">
                {product?.skuBySize[size]?.totalSku}
               </td>
              </tr>
             ))}
            </React.Fragment>
           ))
          )}
         </tbody>
        </table>
       </ModalBody>
       <ModalFooter>
        <Button size='sm' variant="bordered" onPress={onClose}>
         Cancel
        </Button>
        <Button size='sm' className='bg-neutral-700 text-white font-bold' onPress={onClose}>
         Done
        </Button>
       </ModalFooter>
      </>
     )}
    </ModalContent>
   </Modal>

  </div>
 );
};

export default CreatePurchaseOrder;