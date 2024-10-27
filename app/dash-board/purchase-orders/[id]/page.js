"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import useProductsInformation from '@/app/hooks/useProductsInformation';
import VendorSelect from '@/app/components/layout/VendorSelect';
import LocationSelect from '@/app/components/layout/LocationSelect';
import ReactSelect from "react-select";
import useTags from '@/app/hooks/useTags';
import Image from 'next/image';
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';

const EditPurchaseOrderPage = () => {

 const { id } = useParams();
 const axiosPublic = useAxiosPublic();
 const router = useRouter();
 const { register, handleSubmit, setValue, formState: { errors } } = useForm();
 const [isLoading, setIsLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [estimatedArrival, setEstimatedArrival] = useState(''); // Initial state set to an empty string
 const { isOpen, onOpen, onOpenChange } = useDisclosure();
 const [dateError, setDateError] = useState(false)
 const [productList, isProductPending] = useProductsInformation();
 const [selectedVendor, setSelectedVendor] = useState("");
 const [selectedLocation, setSelectedLocation] = useState("");
 const [paymentTerms, setPaymentTerms] = useState("");
 const [tagList, isTagPending] = useTags();
 const [selectedTags, setSelectedTags] = useState([]);
 const [menuPortalTarget, setMenuPortalTarget] = useState(null);
 const [shipping, setShipping] = useState(0);  // Initial value for shipping
 const [discount, setDiscount] = useState(0);  // Initial value for discount
 const [filteredProducts, setFilteredProducts] = useState([]);
 const [selectedProducts, setSelectedProducts] = useState([]);
 const [purchaseOrderVariants, setPurchaseOrderVariants] = useState([]);
 const [purchaseOrderStatus, setPurchaseOrderStatus] = useState("");
 const [statusOrderedModalOpen, setStatusOrderedModalOpen] = useState(false);
 const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");

 // Format date to yyyy-mm-dd for date input field
 const formatDateForInput = (dateStr) => {
  const date = new Date(dateStr);
  const day = (`0${date.getDate()}`).slice(-2);
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
 };

 // Update handleVariantChange to initialize values if not set
 const handleVariantChange = (index, field, value, productTitle, size) => {
  setPurchaseOrderVariants(prevVariants => {
   const updatedVariants = [...prevVariants];
   if (!updatedVariants[index]) {
    updatedVariants[index] = {};
   }

   // Initialize values if not present
   if (!updatedVariants[index].productTitle) {
    updatedVariants[index].productTitle = productTitle;
    updatedVariants[index].size = size;
   }

   updatedVariants[index][field] = value;

   return updatedVariants;
  });
 };

 // Step 3: Handle input changes
 const handleShippingChange = (e) => {
  setShipping(parseFloat(e.target.value) || 0);  // Update state with parsed value
 };

 const handleDiscountChange = (e) => {
  setDiscount(parseFloat(e.target.value) || 0);  // Update state with parsed value
 };

 const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  if (e.target.value) {
   onOpen(); // Open modal when there's input
  }
 };

 useEffect(() => {
  const fetchPurchaseOrderData = async () => {
   try {
    const response = await axiosPublic.get(`/getSinglePurchaseOrder/${id}`);
    const order = response?.data;

    // Ensure the expiry date is set to midnight to avoid timezone issues
    const fetchedEstimatedArrival = formatDateForInput(order.estimatedArrival);
    setEstimatedArrival(fetchedEstimatedArrival); // Ensure no time zone shift
    setSelectedVendor(order?.supplier);
    setSelectedLocation(order?.destination);
    setPaymentTerms(order?.paymentTerms);
    setValue('shipping', order?.shippingCharge);
    setValue('discount', order?.discountCharge);
    setValue('referenceNumber', order?.referenceNumber);
    setValue('supplierNote', order?.supplierNote);
    setShipping(order?.shippingCharge);
    setDiscount(order?.discountCharge);
    setSelectedTags(order?.tags);
    setSelectedProducts(order?.selectedProducts);
    setPurchaseOrderVariants(order?.purchaseOrderVariants);
    setPurchaseOrderStatus(order?.status);
    setPurchaseOrderNumber(order?.purchaseOrderNumber)

    setIsLoading(false);
   } catch (err) {
    console.error(err); // Log error to the console for debugging
    toast.error("Failed to fetch purchase order details!");
   }
  };

  fetchPurchaseOrderData();
 }, [id, axiosPublic, setValue]);

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

 // Function to toggle selection for a specific product size
 const toggleProductSizeSelection = (product, size) => {
  setSelectedProducts((prevSelectedProducts) => {
   const isSelected = prevSelectedProducts.some(
    (item) => item.productTitle === product.productTitle && item.size === size
   );

   if (isSelected) {
    // Remove the selected size entry
    // Clear the corresponding variant values
    setPurchaseOrderVariants((prevVariants) => {
     const updatedVariants = [...prevVariants];
     const index = updatedVariants.findIndex(
      (variant) => variant.productTitle === product.productTitle && variant.size === size
     );
     if (index > -1) {
      updatedVariants[index] = {}; // Reset the variant
     }
     return updatedVariants;
    });

    return prevSelectedProducts.filter(
     (item) => !(item.productTitle === product.productTitle && item.size === size)
    );
   } else {
    // Add the selected size entry
    return [
     ...prevSelectedProducts,
     { productTitle: product.productTitle, imageUrl: product.imageUrl, size }
    ];
   }
  });
 };

 // Function to toggle selection for all sizes of a product
 const toggleAllSizesForProduct = (product) => {
  setSelectedProducts((prevSelectedProducts) => {
   const allSizesSelected = Object.keys(product.skuBySize).every((size) =>
    prevSelectedProducts.some(
     (item) => item.productTitle === product.productTitle && item.size === size
    )
   );

   if (allSizesSelected) {
    // Deselect all sizes for the product
    const removedSizes = Object.keys(product.skuBySize);

    // Clear corresponding values in purchaseOrderVariants
    setPurchaseOrderVariants(prevVariants => {
     const updatedVariants = [...prevVariants];
     removedSizes.forEach(size => {
      const index = prevSelectedProducts.findIndex(
       (item) => item.productTitle === product.productTitle && item.size === size
      );
      if (updatedVariants[index]) {
       updatedVariants[index] = {}; // Reset the variant
      }
     });
     return updatedVariants;
    });

    return prevSelectedProducts.filter(
     (item) => item.productTitle !== product.productTitle
    );
   } else {
    // Select all sizes for the product
    const newSelections = Object.keys(product.skuBySize).map((size) => ({
     productTitle: product.productTitle,
     imageUrl: product.imageUrl,
     size,
    }));

    // Filter out existing entries for this product, then add all sizes
    return [
     ...prevSelectedProducts.filter((item) => item.productTitle !== product.productTitle),
     ...newSelections,
    ];
   }
  });
 };

 // Function to remove a selected product
 const removeSelectedProduct = (product, size) => {
  setSelectedProducts((prevSelectedProducts) => {
   // Filter out the product from selected products
   const updatedSelectedProducts = prevSelectedProducts.filter(
    (item) => !(item.productTitle === product.productTitle && item.size === size)
   );

   // Now update purchaseOrderVariants accordingly
   setPurchaseOrderVariants((prevVariants) => {
    const updatedVariants = prevVariants.filter(
     (variant) => !(variant.productTitle === product.productTitle && variant.size === size)
    );
    return updatedVariants; // Return the updated variants
   });

   return updatedSelectedProducts; // Return the updated selected products
  });
 };

 // Update filtered products whenever productList or searchQuery changes
 useEffect(() => {

  if (typeof document !== 'undefined') {
   setMenuPortalTarget(document.body);
  }

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

 const handlePaymentTerms = (value) => {
  setPaymentTerms(value);
 }

 // Assuming purchaseOrderVariants is your array of variants
 const calculateTotals = () => {
  return purchaseOrderVariants.reduce(
   (acc, variant) => {
    const quantity = parseFloat(variant.quantity) || 0; // Default to 0 if undefined or NaN
    const cost = parseFloat(variant.cost) || 0; // Default to 0 if undefined or NaN
    const taxPercentage = parseFloat(variant.tax) || 0; // Default to 0 if undefined or NaN

    // Calculate subtotal for this variant
    const subtotal = quantity * cost; // Subtotal: cost based on quantity
    const taxAmount = (subtotal * taxPercentage) / 100; // Calculate tax based on percentage

    // Update totals
    acc.totalQuantity += quantity; // Sum of quantities
    acc.totalSubtotal += subtotal; // Total subtotal of all variants
    acc.totalTax += taxAmount; // Sum of tax amounts

    return acc; // Return the accumulator for the next iteration
   },
   {
    totalQuantity: 0, // Initialize total quantity
    totalSubtotal: 0, // Initialize total subtotal (costs before tax)
    totalTax: 0, // Initialize total tax
   }
  );
 };
 const totals = calculateTotals();
 // Access totals
 const { totalQuantity, totalSubtotal, totalTax } = totals;

 // Calculate total price including tax
 const totalPrice = totalSubtotal + totalTax;
 const total = totalPrice + shipping - discount;

 const handleTagChange = (newValue) => {
  setSelectedTags(newValue);
 };

 const handleMarkAsOrderedClick = () => {
  setStatusOrderedModalOpen(true); // Open the modal
 };

 const onSubmit = async (data) => {

  setIsSubmitting(true);

  const { shipping, discount, referenceNumber, supplierNote, estimatedArrival, paymentTerms, status } = data;

  let hasError = false;

  if (!estimatedArrival) {
   setDateError(true);
   hasError = true;
  } else {
   setDateError(false);

   const today = new Date();
   today.setHours(0, 0, 0, 0);
   const selectedEstimatedArrival = new Date(estimatedArrival);

   if (selectedEstimatedArrival < today) {
    toast.error("Expiry date cannot be in the past.");
    hasError = true;
   }
  }

  if (hasError) {
   return;
  }

  if (selectedProducts?.length === 0) {
   toast.error("Please add product.");
   return;
  }

  // Ensure required fields are filled
  for (const variant of purchaseOrderVariants) {
   if (!variant?.quantity || variant?.quantity <= 0) {
    toast.error("Quantity must be greater than 0 for all products.");
    return; // Prevent form submission
   }
   if (!variant.cost || variant.cost <= 0) {
    toast.error("Cost must be greater than 0 for all products.");
    return; // Prevent form submission
   }
  }

  try {
   const updatedPurchaseOrderData = {
    estimatedArrival,
    paymentTerms,
    supplier: selectedVendor,
    destination: selectedLocation,
    purchaseOrderVariants: purchaseOrderVariants?.map(variant => ({
     productTitle: variant.productTitle,
     supplierSku: parseFloat(variant.supplierSku) || null,
     quantity: parseFloat(variant.quantity),
     cost: parseFloat(variant.cost),
     tax: parseFloat(variant.tax) || 0,
     size: variant?.size,
    })),
    tags: selectedTags,
    referenceNumber,
    supplierNote,
    shippingCharge: parseFloat(shipping) || 0,
    discountCharge: parseFloat(discount) || 0,
    totalPrice: parseFloat(total),
    status,
    selectedProducts
   };

   const res = await axiosPublic.put(`/editPurchaseOrder/${id}`, updatedPurchaseOrderData);
   if (res.data.modifiedCount > 0) {
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
          Purchase order Updated!
         </p>
         <p className="mt-1 text-sm text-gray-500">
          Purchase order has been successfully updated!
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
    router.push('/dash-board/purchase-orders');
   } else {
    toast.error('No changes detected.');
    setIsSubmitting(false);
   }
  } catch (error) {
   console.error('Error editing offer:', error);
   toast.error('Failed to update offer. Please try again!');
   setIsSubmitting(false);
  }
 };

 if (isLoading || isProductPending || isTagPending) {
  return <Loading />;
 }

 return (
  <div className='bg-gray-100 min-h-screen px-6'>

   <div className='max-w-screen-xl mx-auto pt-3 md:pt-6'>
    <div className='flex items-center justify-between w-full'>
     <h3 className='w-full font-semibold text-base md:text-xl lg:text-2xl'>#{purchaseOrderNumber} <span className=''>{purchaseOrderStatus}</span></h3>
     <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/purchase-orders"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
    </div>
   </div>

   {/* Your form code */}
   <form onSubmit={handleSubmit(onSubmit)}>

    <div className='max-w-screen-xl mx-auto py-6 flex flex-col gap-4'>

     <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
      <VendorSelect register={register} errors={errors} selectedVendor={selectedVendor} setSelectedVendor={setSelectedVendor} />
      <LocationSelect register={register} errors={errors} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
     </div>

     <div className='bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>

       <div className='flex-1'>
        <label htmlFor='paymentTerms' className='flex justify-start font-medium text-neutral-800 pb-2'>Payment Terms</label>
        <select id="paymentTerms" value={paymentTerms}
         {...register('paymentTerms', { required: 'Please select payment terms.' })} className='lg:w-1/2 font-semibold' style={{ zIndex: 10, pointerEvents: 'auto', position: 'relative', outline: 'none' }}
         onChange={(e) => {
          handlePaymentTerms(e.target.value);
         }}
        >
         <option value="" disabled>Select</option>
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
        {errors.paymentTerms && (
         <p className="text-red-600 text-left">{errors.paymentTerms.message}</p>
        )}
       </div>

       <div className='flex-1'>
        <label htmlFor='estimatedArrival' className='flex justify-start font-medium text-neutral-800 pb-2'>Estimated Arrival</label>
        <input
         type="date"
         id="estimatedArrival"
         {...register("estimatedArrival", { required: true })}
         value={estimatedArrival}
         onChange={(e) => setEstimatedArrival(e.target.value)} // Update state with the input value
         className="w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000"
        />
        {dateError && (
         <p className="text-red-600 text-sm mt-1">Expiry Date is required</p>
        )}
       </div>

      </div>

     </div>

     <div className='bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
      <h1 className='font-bold text-lg'>Add products</h1>
      <div className='w-full pt-2'>
       <li className="flex items-center relative group border-2 rounded-lg">
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

      {selectedProducts?.length > 0 &&
       <div className="max-w-screen-2xl mx-auto overflow-x-auto custom-scrollbar relative pt-4">
        <table className="w-full text-left border-collapse">
         <thead className="sticky top-0 z-[1] bg-white">
          <tr>
           <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b">
            Products
           </th>
           <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
            Supplier SKU
           </th>
           <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
            Quantity
           </th>
           <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
            Cost
           </th>
           <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
            Tax
           </th>
           <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
            Total
           </th>
          </tr>
         </thead>

         <tbody className="bg-white divide-y divide-gray-200">
          {selectedProducts?.map((product, index) => {
           const quantity = parseFloat(purchaseOrderVariants[index]?.quantity) || 0; // Default to 0 if undefined or NaN
           const cost = parseFloat(purchaseOrderVariants[index]?.cost) || 0; // Default to 0 if undefined or NaN
           const taxPercentage = parseFloat(purchaseOrderVariants[index]?.tax) || 0; // Default to 0 if undefined or NaN

           // Calculate total
           const totalCost = quantity * cost; // Calculate cost based on quantity and cost per item
           const taxAmount = (totalCost * taxPercentage) / 100; // Calculate tax based on percentage
           const total = totalCost + taxAmount;

           return (
            <tr key={index} className="hover:bg-gray-50">
             <td className="text-sm p-3 text-neutral-500 text-center cursor-pointer flex flex-col lg:flex-row items-center gap-3">
              <div>
               <Image className='h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5' src={product?.imageUrl} alt='productIMG' height={600} width={600} />
              </div>
              <div className='flex flex-col items-start justify-start gap-1'>
               <p className='font-bold text-blue-700 text-start'>{product?.productTitle}</p>
               <p className='font-medium'>{product?.size}</p>
              </div>
             </td>
             <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
              <input
               id={`supplierSku-${index}`}
               {...register(`supplierSku-${index}`)}
               value={purchaseOrderVariants[index]?.supplierSku || ''}
               onChange={(e) => handleVariantChange(index, 'supplierSku', e.target.value, product?.productTitle, product?.size)}
               className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
               type="number"
              />
             </td>
             <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
              <input
               id={`quantity-${index}`}
               {...register(`quantity-${index}`, { required: true })}
               value={purchaseOrderVariants[index]?.quantity || ''}
               onChange={(e) => handleVariantChange(index, 'quantity', e.target.value, product?.productTitle, product?.size)}
               className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
               type="number"
               min="0" // Prevents negative values in the input
              />
              {errors[`quantity-${index}`] && (
               <p className="text-red-600 text-left">Quantity is required.</p>
              )}
             </td>
             <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
              <div className="input-wrapper">
               <span className="input-prefix">৳</span>
               <input
                id={`cost-${index}`}
                {...register(`cost-${index}`, { required: true })}
                value={purchaseOrderVariants[index]?.cost || ''}
                onChange={(e) => handleVariantChange(index, 'cost', e.target.value, product?.productTitle, product?.size)}
                className="pl-7 custom-number-input w-full pr-3 py-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                type="number"
                min="0" // Prevents negative values in the input
               />
               {errors[`cost-${index}`] && (
                <p className="text-red-600 text-left">Cost is required.</p>
               )}
              </div>
             </td>
             <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
              <div className="input-wrapper">
               <input
                id={`tax-${index}`}
                {...register(`tax-${index}`)} // No required validation here
                value={purchaseOrderVariants[index]?.tax || ''}
                onChange={(e) => handleVariantChange(index, 'tax', e.target.value, product?.productTitle, product?.size)}
                className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                type="number"
               />
               <span className="input-suffix">%</span>
              </div>
             </td>
             <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
              <div className='flex gap-3 w-full justify-center items-center'>
               <p className="font-bold flex gap-1 text-neutral-500"><span>৳</span> {total.toFixed(2)}</p> {/* Display the total */}
               <button
                onClick={() => removeSelectedProduct(product, product.size)}
                className="hover:text-red-700 text-gray-700"
                aria-label="Remove product"
               >
                <RxCross2 size={18} />
               </button>
              </div>
             </td>
            </tr>
           );
          })}
         </tbody>
        </table>
       </div>
      }
      {selectedProducts?.length > 0 && <p className='px-4 pt-4 text-neutral-500 font-medium'>{selectedProducts?.length} variants on purchase order</p>}
     </div>

     <div className='flex flex-col lg:flex-row w-full justify-between items-start gap-6'>

      <div className='flex-1 flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
       <h1 className='font-semibold'>Additional Details</h1>
       <div>
        <label htmlFor='referenceNumber' className='flex justify-start font-medium text-neutral-500 pb-2'>Reference Number</label>
        <input
         id={`referenceNumber`}
         {...register(`referenceNumber`)}
         className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
         type="number"
        />
       </div>
       <div>
        <label htmlFor='supplierNote' className='flex justify-start font-medium text-neutral-500 pb-2'>Note to supplier</label>
        <input
         id={`supplierNote`}
         {...register(`supplierNote`)}
         className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
         type="text"
        />
       </div>
       <div>
        <label htmlFor='tags' className='flex justify-start font-medium pb-1 text-neutral-500'>Select Tag</label>
        <ReactSelect
         options={tagList}
         isMulti
         className="w-full border rounded-md creatable-select-container"
         value={selectedTags}
         menuPortalTarget={menuPortalTarget}
         styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
         menuPlacement="auto"
         onChange={handleTagChange}
        />
       </div>
      </div>

      <div className='flex-1 flex flex-col justify-between gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
       <h1 className='font-semibold'>Cost summary</h1>
       <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-center gap-6'>
         <h2 className='font-medium text-neutral-500'>Taxes (Included)</h2>
         <p className='text-neutral-500'>৳ {totalTax.toFixed(2)}</p>
        </div>
        <div className='flex justify-between items-center gap-6'>
         <h2 className='font-semibold'>Subtotal</h2>
         <p className='text-neutral-950 font-semibold'>৳ {totalPrice.toFixed(2)}</p>
        </div>
        <p className='text-neutral-500'>{totalQuantity}  items</p>
       </div>
       <div className='flex flex-col gap-2'>
        <h1 className='font-semibold'>Cost adjustments</h1>
        <div className='flex justify-between items-center gap-6'>
         <label htmlFor='shipping' className='flex w-full justify-start font-medium text-neutral-600'>Shipping +</label>
         <input
          id='shipping'
          {...register('shipping')}
          className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
          type="number"
          onChange={handleShippingChange}  // Step 3: Update shipping state on change
         />
        </div>
        <div className='flex justify-between items-center gap-6'>
         <label htmlFor='discount' className='flex w-full justify-start font-medium text-neutral-600'>Discount -</label>
         <input
          id='discount'
          {...register('discount')}
          className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
          type="number"
          onChange={handleDiscountChange}  // Step 3: Update discount state on change
         />
        </div>
       </div>
       <div className='flex justify-between items-center gap-6'>
        <p className='text-neutral-950 font-semibold'>Total</p>
        <p className='font-bold'>৳ {total}</p>
       </div>
      </div>

     </div>

     {/* Submit Button */}
     <div className='flex justify-end items-center gap-6 w-full my-4'>

      <button
       type='submit'
       disabled={isSubmitting}
       className={`bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold ${isSubmitting ? 'bg-gray-400' : 'bg-neutral-950 hover:bg-neutral-800'} text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold`}
      >
       {isSubmitting ? 'Saving...' : 'Save changes'}
      </button>

      {purchaseOrderStatus === "pending" && (
       <button
        className="bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold"
        onClick={handleMarkAsOrderedClick} // Opens modal only
       >
        Mark as ordered
       </button>
      )}

      {purchaseOrderStatus === "ordered" && (
       <Link href={`/dash-board/purchase-orders/receive-inventory/${id}`}
        className="bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold"
       >
        Receive inventory
       </Link>
      )}

     </div>
    </div>

   </form>

   {statusOrderedModalOpen && <Modal isOpen={statusOrderedModalOpen} onOpenChange={() => setStatusOrderedModalOpen(false)}>
    <ModalContent>
     <>
      <ModalHeader className="font-bold">Mark as ordered?</ModalHeader>
      <ModalBody>
       <p>Are you sure you want to mark this order as ordered?</p>
      </ModalBody>
      <ModalFooter>
       <Button color="danger" variant="light" onClick={() => setStatusOrderedModalOpen(false)}>
        Cancel
       </Button>
       <button
        className="bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold"
        onClick={handleSubmit(async (formData) => {
         // Call onSubmit and wait for the result
         const success = await onSubmit({ ...formData, status: "ordered" }); // Pass status as "ordered"

         if (success) {
          setStatusOrderedModalOpen(false); // Close modal only if the submission was successful
         }
        })}
        disabled={isSubmitting} // Disable button during submission
       >
        {isSubmitting ? 'Processing...' : 'Mark as ordered'}
       </button>
      </ModalFooter>
     </>
    </ModalContent>
   </Modal>}

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
           autoFocus
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
          {filteredProducts.length === 0 ? (
           <tr>
            <td colSpan="3" className="text-center p-4 text-gray-500 py-32">
             <h1 className="text-xl font-semibold text-neutral-800">No Products Available!</h1>
            </td>
           </tr>
          ) : (
           filteredProducts.map((product, index) => (
            <React.Fragment key={index}>
             <tr className="hover:bg-gray-50 transition-colors">
              <td className="text-xs p-3 cursor-pointer flex items-center gap-3">
               <Checkbox
                isSelected={
                 selectedProducts.some((p) => p.productTitle === product.productTitle) &&
                 Object.keys(product.skuBySize).every((size) =>
                  selectedProducts.some(
                   (p) => p.productTitle === product.productTitle && p.size === size
                  )
                 )
                }
                onValueChange={() => toggleAllSizesForProduct(product)}
               />
               <div>
                <Image
                 className="h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5"
                 src={product.imageUrl}
                 alt="productIMG"
                 height={600}
                 width={600}
                />
               </div>
               <div className="flex flex-col">
                <p className="font-bold text-sm">{product.productTitle}</p>
               </div>
              </td>
              <td colSpan="2"></td>
             </tr>

             {Object.keys(product.skuBySize).map((size) => (
              <tr key={`${index}-${size}`} className="hover:bg-gray-50 transition-colors">
               <td className="pl-12 text-xs p-3 text-gray-600 flex items-center">
                <Checkbox
                 isSelected={selectedProducts.some(
                  (p) => p.productTitle === product.productTitle && p.size === size
                 )}
                 onValueChange={() => toggleProductSizeSelection(product, size)}
                />
                <span className="font-semibold ml-2">{size}</span>
               </td>
               <td className="text-center">
                {product.skuBySize[size]?.locationSku}
               </td>
               <td className="text-center">
                {product.skuBySize[size]?.totalSku}
               </td>
              </tr>
             ))}
            </React.Fragment>
           ))
          )}
         </tbody>
        </table>
       </ModalBody>
       <ModalFooter className='flex justify-between items-center'>
        <div>
         {selectedProducts?.length > 0 && <p className='border px-4 rounded-lg shadow py-1'>{selectedProducts?.length} variants selected</p>}
        </div>
        <div className='flex gap-4 items-center'>
         <Button size='sm' variant="bordered" onPress={onClose}>
          Cancel
         </Button>
         <Button size='sm' className='bg-neutral-700 text-white font-bold' onPress={onClose}>
          Done
         </Button>
        </div>
       </ModalFooter>
      </>
     )}
    </ModalContent>
   </Modal>

  </div>
 );
};

export default EditPurchaseOrderPage;