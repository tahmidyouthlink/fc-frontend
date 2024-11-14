"use client";
import Progressbar from '@/app/components/layout/Progressbar';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useProductsInformation from '@/app/hooks/useProductsInformation';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const ReceiveTransferOrder = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const { handleSubmit, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [transferOrderNumber, setTransferOrderNumber] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [transferOrderVariants, setTransferOrderVariants] = useState([]);
  const [productList, isProductPending] = useProductsInformation();
  const [originName, setOriginName] = useState([]);
  const [destinationName, setDestinationName] = useState([]);
  const [acceptError, setAcceptError] = useState(false);

  useEffect(() => {
    const fetchTransferOrderData = async () => {
      try {
        const response = await axiosPublic.get(`/getSingleTransferOrder/${id}`);
        const order = response?.data;

        setSelectedProducts(order?.selectedProducts);
        setTransferOrderVariants(order?.transferOrderVariants);
        setTransferOrderNumber(order?.transferOrderNumber);
        setDestinationName(order?.destination?.locationName);
        setOriginName(order?.origin?.locationName);

        setIsLoading(false);
      } catch (err) {
        console.error(err); // Log error to the console for debugging
        toast.error("Failed to fetch transfer order details!");
      }
    };

    fetchTransferOrderData();
  }, [id, axiosPublic, setValue]);

  const handleAddAllAccept = (index) => {
    setTransferOrderVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].accept = updatedVariants[index].quantity; // Set accept to total quantity
      updatedVariants[index].reject = 0; // Reset reject to 0
      return updatedVariants;
    });
  };

  const handleAddAllReject = (index) => {
    setTransferOrderVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].reject = updatedVariants[index].quantity; // Set reject to total quantity
      updatedVariants[index].accept = 0; // Reset accept to 0
      return updatedVariants;
    });
  };

  const handleAcceptChange = (index, value) => {
    // Allow any number as input
    const parsedValue = value === '' ? 0 : Math.max(0, parseInt(value)); // Allow 0 or positive numbers
    setTransferOrderVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].accept = parsedValue; // Update accept with parsed value
      return updatedVariants;
    });
  };

  const handleRejectChange = (index, value) => {
    // Allow any number as input
    const parsedValue = value === '' ? 0 : Math.max(0, parseInt(value)); // Allow 0 or positive numbers
    setTransferOrderVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].reject = parsedValue; // Update reject with parsed value
      return updatedVariants;
    });
  };

  // const onSubmit = async () => {
  //   // Validate accept values
  //   const invalidVariantsForZero = transferOrderVariants.filter(variant => variant.accept <= 0);
  //   const invalidVariants = transferOrderVariants.filter(variant => variant.accept === undefined);

  //   if (invalidVariantsForZero.length > 0) {
  //     toast.error('Accept value must be greater than 0');
  //     return; // Stop the submission
  //   }

  //   if (invalidVariants.length > 0) {
  //     setAcceptError(true);
  //     return; // Stop the submission
  //   }
  //   setAcceptError(false);

  //   const updatedProductList = [...productList]; // Clone productList to modify

  //   const receivedOrderData = {
  //     transferOrderVariants: transferOrderVariants?.map(variant => ({
  //       productTitle: variant.productTitle,
  //       quantity: parseFloat(variant.quantity),
  //       size: variant?.size,
  //       colorCode: variant.colorCode,  // Include the color code
  //       colorName: variant.colorName,   // Include the color name
  //       accept: parseFloat(variant?.accept) || 0,
  //       reject: parseFloat(variant?.reject) || 0
  //     })),
  //     status: 'received'
  //   };

  //   const modifiedProducts = new Set(); // To store only unique product IDs that need updating

  //   // SKU adjustment based on origin and destination
  //   const acceptValueMap = new Map(); // To track SKU adjustments for each variant

  //   // Iterate through each transfer order variant
  //   transferOrderVariants.forEach(variant => {
  //     const { productTitle, size, colorCode, colorName, accept } = variant;

  //     // Update product variants based on originName
  //     updatedProductList.forEach(product => {
  //       if (product.productTitle === productTitle && product.productVariants) {
  //         product.productVariants.forEach(variantItem => {
  //           // Check if location matches and other attributes match
  //           if (variantItem.location === originName &&
  //             variantItem.color.color === colorCode &&
  //             variantItem.color.value === colorName &&
  //             variantItem.size === size) {
  //             // Subtract accept value from SKU
  //             variantItem.sku = Math.max(0, variantItem.sku - accept);
  //           }

  //           // Check for destinationName
  //           if (variantItem.location === destinationName &&
  //             variantItem.color.color === colorCode &&
  //             variantItem.color.value === colorName &&
  //             variantItem.size === size) {
  //             // Add accept value to SKU
  //             variantItem.sku += accept;
  //           }
  //         });
  //       }
  //     });
  //   });

  //   console.log(updatedProductList, "updatedProductList");

  //   // API call for updating purchase order
  //   // const response1 = await axiosPublic.put(`/editPurchaseOrder/${id}`, receivedOrderData);

  //   // const updateResponses = await Promise.all(
  //   //   Array.from(modifiedProducts).map(async (productId) => {
  //   //     const updatedProduct = updatedProductList.find((product) => product._id === productId);
  //   //     if (updatedProduct) {
  //   //       try {
  //   //         // Send the update request for each modified product
  //   //         const response = await axiosPublic.put(`/editProductDetailsInventory/${productId}`, updatedProduct);
  //   //         return { productId, success: true, response: response.data };
  //   //       } catch (error) {
  //   //         console.error(`Failed to update product ${productId}:`, error.response?.data || error.message);
  //   //         return { productId, success: false, error: error.message };
  //   //       }
  //   //     } else {
  //   //       console.warn(`Product with ID ${productId} not found in updatedProductList`);
  //   //       return { productId, success: false, error: 'Product not found' };
  //   //     }
  //   //   })
  //   // );

  //   // Process the responses
  //   // const successfulUpdates = updateResponses.filter((update) => update.success);
  //   // const failedUpdates = updateResponses.filter((update) => !update.success);

  //   // Show single toast message based on the update results
  //   // if (successfulUpdates.length > 0 && response1.data.modifiedCount > 0) {
  //   //   toast.custom((t) => (
  //   //     <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}>
  //   //       <div className="pl-6">
  //   //         <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
  //   //       </div>
  //   //       <div className="flex-1 w-0 p-4">
  //   //         <div className="flex items-start">
  //   //           <div className="ml-3 flex-1">
  //   //             <p className="text-base font-bold text-gray-900">Purchase order received!</p>
  //   //             <p className="mt-1 text-sm text-gray-500">{successfulUpdates.length} product(s) successfully updated!</p>
  //   //           </div>
  //   //         </div>
  //   //       </div>
  //   //       <div className="flex border-l border-gray-200">
  //   //         <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-text-700 focus:outline-none text-2xl">
  //   //           <RxCross2 />
  //   //         </button>
  //   //       </div>
  //   //     </div>
  //   //   ), { position: "bottom-right", duration: 5000 });

  //   //   // Redirect after toast
  //   //   router.push('/dash-board/purchase-orders');
  //   // } else if (successfulUpdates.length === 0 && failedUpdates.length > 0) {
  //   //   toast.error('No changes detected or updates failed.');
  //   // }
  // };

  const onSubmit = async () => {
    // Validate transferOrderVariants
    const invalidVariantsForZero = transferOrderVariants.filter(variant => variant.accept <= 0);
    const invalidVariants = transferOrderVariants.filter(variant => variant.accept === undefined);

    if (invalidVariantsForZero.length > 0) {
      toast.error('Accept value must be greater than 0');
      return; // Stop the submission
    }

    if (invalidVariants.length > 0) {
      setAcceptError(true);
      return; // Stop the submission
    }

    setAcceptError(false);

    const updatedProductList = [...productList]; // Clone productList to modify

    const modifiedProducts = new Set();

    transferOrderVariants.forEach(variant => {
      updatedProductList.forEach(product => {
        if (product.productTitle === variant.productTitle && product.productVariants) {
          let originMatchFound = false;
          let destinationMatchFound = false;

          product.productVariants.forEach(prodVariant => {
            // Check for origin location
            if (prodVariant.location === originName &&
              prodVariant.color.color === variant.colorCode &&
              prodVariant.color.value === variant.colorName &&
              prodVariant.size === variant.size) {
              originMatchFound = true;

              // Prevent negative SKU values
              if (prodVariant.sku >= variant.accept) {
                // Subtract accept value from SKU
                prodVariant.sku -= variant.accept;
                modifiedProducts.add(product._id); // Track modified product
              }
            }

            // Check for destination location
            if (prodVariant.location === destinationName &&
              prodVariant.color.color === variant.colorCode &&
              prodVariant.color.value === variant.colorName &&
              prodVariant.size === variant.size) {
              destinationMatchFound = true;

              // Add accept value to SKU
              prodVariant.sku += variant.accept;
              modifiedProducts.add(product._id); // Track modified product
            }
          });

          // If no destination match was found, create a new product variant
          if (originMatchFound && !destinationMatchFound) {
            const matchingVariant = product.productVariants.find(
              prodVariant =>
                prodVariant.color.color === variant.colorCode &&
                prodVariant.color.value === variant.colorName &&
                prodVariant.size === variant.size
            );

            // Create a new variant based on the matching variant
            const newVariant = {
              color: {
                _id: variant.colorCode, // Assuming colorCode can be used as ID
                value: variant.colorName,
                label: variant.colorName,
                color: variant.colorCode,
              },
              size: variant.size,
              sku: variant.accept,
              imageUrls: matchingVariant ? matchingVariant.imageUrls : [], // Use the imageUrls of the matching variant
              location: destinationName, // New location
            };

            product.productVariants.push(newVariant);
            modifiedProducts.add(product._id); // Track modified product
          }
        }
      });
    });

    // Prepare data for the API call
    const receivedOrderData = {
      transferOrderVariants: transferOrderVariants.map(variant => ({
        productTitle: variant.productTitle,
        quantity: variant.quantity,
        size: variant.size,
        colorCode: variant.colorCode,
        colorName: variant.colorName,
        accept: parseFloat(variant.accept) || 0,
        reject: parseFloat(variant.reject) || 0,
      })),
      status: 'received'
    };

    // Update product details in the database
    const response1 = await axiosPublic.put(`/editTransferOrder/${id}`, receivedOrderData);

    const updateResponses = await Promise.all(
      Array.from(modifiedProducts).map(async (productId) => {
        const updatedProduct = updatedProductList?.find((product) => product._id === productId);
        if (updatedProduct) {
          try {
            // Send the update request for each modified product
            const response = await axiosPublic.put(`/editProductDetailsInventory/${productId}`, updatedProduct);
            return { productId, success: true, response: response.data };
          } catch (error) {
            console.error(`Failed to update product ${productId}:`, error.response?.data || error.message);
            return { productId, success: false, error: error.message };
          }
        } else {
          console.warn(`Product with ID ${productId} not found in updatedProductList`);
          return { productId, success: false, error: 'Product not found' };
        }
      })
    );

    // Process the responses
    const successfulUpdates = updateResponses.filter((update) => update.success);
    const failedUpdates = updateResponses.filter((update) => !update.success);

    // Show single toast message based on the update results
    if (successfulUpdates.length > 0 && response1.data.modifiedCount > 0) {
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
                  Transfer order received!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {successfulUpdates.length} product(s) successfully updated!
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
      });

      // Redirect after toast
      router.push('/dash-board/transfers');
    } else if (successfulUpdates.length === 0 && failedUpdates.length > 0) {
      toast.error('No changes detected or updates failed.');
    }

  };

  if (isLoading || isProductPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-100 min-h-screen px-6'>

      <div className='max-w-screen-xl mx-auto pt-3 md:pt-6'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex flex-col w-full'>
            <h3 className='w-full font-semibold text-base md:text-xl lg:text-2xl'>Receive items</h3>
            <span className='text-neutral-500 text-sm'>#{transferOrderNumber}</span>
          </div>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={`/dash-board/transfers/${id}`}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">

        <div className="max-w-screen-xl mx-auto overflow-x-auto rounded-lg custom-scrollbar relative pt-4">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-[1] bg-white">
              <tr>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b">
                  Products
                </th>
                <th className="text-[10px] md:text-xs text-center font-bold p-2 xl:p-3 text-neutral-950 border-b">
                  Available Quantity
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
                  Accept
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
                  Reject
                </th>
                <th className="text-[10px] md:text-xs font-bold p-2 xl:p-3 text-neutral-950 border-b text-center">
                  Received
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {selectedProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="text-sm p-3 text-neutral-500 text-center cursor-pointer flex flex-col lg:flex-row items-center gap-3">
                    <div>
                      <Image className='h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5' src={product?.imageUrl} alt='productIMG' height={600} width={600} />
                    </div>
                    <div className='flex flex-col items-start justify-start gap-1'>
                      <p className='font-bold text-blue-700 text-start'>{product?.productTitle}</p>
                      <p className='font-medium'>{product?.size}</p>
                      <span className='flex items-center gap-2'>
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
                    {transferOrderVariants[index]?.quantity}
                  </td>
                  <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
                    <div className='flex items-center gap-3'>
                      <input
                        type="number"
                        className="custom-number-input w-20 lg:w-full p-2 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                        value={transferOrderVariants[index]?.accept || ''} // Set value to empty string when 0
                        onChange={(e) => handleAcceptChange(index, e.target.value)}
                      />
                      <button
                        type="button" // Prevent form submission
                        onClick={() => handleAddAllAccept(index)}
                        className="bg-white drop-shadow text-black px-4 py-2 rounded hover:bg-black hover:text-white"
                      >
                        All
                      </button>
                    </div>
                    {acceptError && <p className='text-red-600 text-left'>This field is required</p>}
                  </td>
                  <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
                    <div className='flex items-center gap-3'>
                      <input
                        type="number"
                        className="custom-number-input w-20 lg:w-full p-2 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                        value={transferOrderVariants[index]?.reject || ''} // Set value to empty string when 0
                        onChange={(e) => handleRejectChange(index, e.target.value)}
                      />
                      <button
                        type="button" // Prevent form submission
                        onClick={() => handleAddAllReject(index)}
                        className="bg-white drop-shadow text-black px-4 py-2 rounded hover:bg-black hover:text-white"
                      >
                        All
                      </button>
                    </div>
                  </td>
                  <td className="text-sm p-3 text-neutral-500 text-center font-semibold">
                    <Progressbar
                      accepted={transferOrderVariants[index]?.accept || 0}
                      rejected={transferOrderVariants[index]?.reject || 0}
                      total={transferOrderVariants[index]?.quantity}
                    />
                    <div className="mt-1">
                      {transferOrderVariants[index]?.accept || 0} of {transferOrderVariants[index]?.quantity}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex justify-end items-center gap-6 w-full my-4 max-w-screen-xl mx-auto'>

          <button
            type='submit'
            className={`bg-neutral-950 hover:bg-neutral-800 text-white py-2 px-4 text-sm rounded-md cursor-pointer font-bold`}>
            Accept
          </button>

        </div>
      </form>

    </div>
  );
};

export default ReceiveTransferOrder;