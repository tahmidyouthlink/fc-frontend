"use client";
import LocationSelect from '@/app/components/layout/LocationSelect';
import VendorSelect from '@/app/components/layout/VendorSelect';
import Loading from '@/app/components/shared/Loading/Loading';
import { useAuth } from '@/app/contexts/auth';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useProductsInformation from '@/app/hooks/useProductsInformation';
import usePurchaseOrders from '@/app/hooks/usePurchaseOrders';
import { Button, Checkbox, DatePicker, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';

const currentModule = "Product Hub";

const CreatePurchaseOrder = () => {

	const axiosPublic = useAxiosPublic();
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
	const [purchaseOrderVariants, setPurchaseOrderVariants] = useState([]);
	const [shipping, setShipping] = useState(0);  // Initial value for shipping
	const [discount, setDiscount] = useState(0);  // Initial value for discount
	const [purchaseOrderList, isPurchaseOrderPending] = usePurchaseOrders();
	const [file, setFile] = useState(null);
	const { existingUserData, isUserLoading } = useAuth();
	const permissions = existingUserData?.permissions || [];
	const role = permissions?.find(
		(group) => group.modules?.[currentModule]?.access === true
	)?.role;
	const isOwner = role === "Owner";

	// Update handleVariantChange to initialize values if not set
	const handleVariantChange = (index, field, value, productTitle, size, colorName, colorCode) => {
		setPurchaseOrderVariants((prevVariants) => {
			const updatedVariants = [...prevVariants];

			// Initialize the variant object if it does not exist
			if (!updatedVariants[index]) {
				updatedVariants[index] = {};
			}

			// Set product title, size, and color properties
			if (!updatedVariants[index].productTitle) {
				updatedVariants[index].productTitle = productTitle;
				updatedVariants[index].size = size;

				// Assuming color is an object with code and name properties
				updatedVariants[index].color = {
					code: colorCode,
					name: colorName,
				};
			}

			// Update the specific field (in this case, quantity)
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

	const handlePaymentTerms = (value) => {
		setPaymentTerms(value);
	}

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		if (e.target.value) {
			onOpen(); // Open modal when there's input
		}
	};

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
	const calculateSkuBySizeAndColorAndLocation = (productList, selectedLocation) => {
		if (!productList || !selectedLocation) return [];

		const skuByProduct = [];

		productList?.forEach((product) => {
			const skuEntries = [];

			product?.productVariants.forEach((variant) => {
				const size = variant?.size;
				const colorCode = variant?.color?.color; // Hex code for the color
				const colorName = variant?.color?.value; // Name of the color
				const sku = variant?.sku || 0;

				// Find an existing entry for this size and color
				let entry = skuEntries?.find(
					(e) => e?.size === size && e?.color?.code === colorCode
				);

				if (!entry) {
					// If not found, initialize a new entry for this size and color
					entry = { size, color: { code: colorCode, name: colorName }, locationSku: 0, totalSku: 0 };
					skuEntries.push(entry);
				}

				// Add to total SKU for this size and color
				entry.totalSku += sku;

				// If the variant matches the selected location, add its SKU to locationSku
				if (variant?.location === selectedLocation) {
					entry.locationSku += sku;
				}
			});

			// Find the first image URL from a variant matching the selected location
			// const variantWithLocation = product.productVariants.find(
			// 	(variant) => variant.location === selectedLocation
			// );
			// const imageUrl = variantWithLocation?.imageUrls?.[0] || null;

			skuByProduct.push({
				productTitle: product?.productTitle,
				skuBySizeAndColor: skuEntries,
				imageUrl: product?.thumbnailImageUrl,
				// imageUrl,
			});
		});

		return skuByProduct;
	};

	// Function to toggle selection for a specific product size
	const toggleProductSizeColorSelection = (product, size, colorCode, colorName) => {
		setSelectedProducts((prevSelectedProducts) => {
			const isSelected = prevSelectedProducts.some(
				(item) =>
					item?.productTitle === product?.productTitle &&
					item?.size === size &&
					item?.color === colorCode &&
					item?.name === colorName
			);

			if (isSelected) {
				// Deselect the specific entry
				setPurchaseOrderVariants((prevVariants) =>
					prevVariants.filter(
						(variant) =>
							!(
								variant?.productTitle === product?.productTitle &&
								variant?.size === size &&
								variant?.color?.code === colorCode &&
								variant?.color?.name === colorName
							)
					)
				);
				return prevSelectedProducts.filter(
					(item) =>
						!(
							item?.productTitle === product?.productTitle &&
							item?.size === size &&
							item?.color === colorCode &&
							item?.name === colorName
						)
				);
			} else {
				// Select the specific entry
				setPurchaseOrderVariants((prevVariants) => [
					...prevVariants,
					{
						productTitle: product?.productTitle,
						size,
						color: {
							code: colorCode,
							name: colorName,
						},
						quantity: 0, // Initialize quantity to 0 or any default value
						cost: 0, // Initialize cost to 0
						tax: 0, // Initialize tax to 0
					},
				]);
				return [
					...prevSelectedProducts,
					{
						productTitle: product?.productTitle,
						imageUrl: product?.imageUrl,
						size,
						color: colorCode,
						name: colorName,
					},
				];
			}
		});
	};

	// Function to toggle selection for all sizes of a product
	const toggleAllSizesAndColorsForProduct = (product) => {
		setSelectedProducts((prevSelectedProducts) => {
			const allSelected = product?.skuBySizeAndColor.every((entry) =>
				prevSelectedProducts.some(
					(item) =>
						item?.productTitle === product?.productTitle &&
						item?.size === entry?.size &&
						item?.color === entry?.color?.code &&
						item?.name === entry?.color?.name
				)
			);

			if (allSelected) {
				// Deselect all sizes and colors for this product
				setPurchaseOrderVariants((prevVariants) =>
					prevVariants.filter((variant) => variant.productTitle !== product.productTitle)
				);
				return prevSelectedProducts.filter((item) => item.productTitle !== product.productTitle);
			} else {
				// Select all sizes and colors for this product
				const newSelections = product.skuBySizeAndColor.map((entry) => ({
					productTitle: product?.productTitle,
					imageUrl: product?.imageUrl,
					size: entry?.size,
					color: entry?.color?.code,
					name: entry?.color?.name,
				}));

				setPurchaseOrderVariants((prevVariants) => [
					...prevVariants.filter((variant) => variant.productTitle !== product.productTitle),
					...product.skuBySizeAndColor.map((entry) => ({
						productTitle: product?.productTitle,
						size: entry?.size,
						color: {
							code: entry?.color?.code,
							name: entry?.color?.name,
						},
						quantity: 0, // Initialize quantity to 0
						cost: 0, // Initialize cost to 0
						tax: 0, // Initialize tax to 0
					})),
				]);

				return [
					...prevSelectedProducts.filter((item) => item.productTitle !== product.productTitle),
					...newSelections,
				];
			}
		});
	};

	// Function to remove a selected product
	const removeSelectedProduct = (product, size, color) => {

		setSelectedProducts((prevSelectedProducts) => {
			const updatedSelectedProducts = prevSelectedProducts.filter(
				(item) => !(
					item?.productTitle === product?.productTitle &&
					item?.size === size &&
					item?.color === color
				)
			);
			return updatedSelectedProducts;
		});

		setPurchaseOrderVariants((prevVariants) => {
			const updatedVariants = prevVariants.filter((variant) => {
				const titleMatches = variant?.productTitle === product?.productTitle;
				const sizeMatches = variant?.size === size;
				const colorMatches = variant?.color?.code === color;

				return !(titleMatches && sizeMatches && colorMatches);
			});
			return updatedVariants;
		});
	};

	// Update filtered products whenever productList or searchQuery changes
	useEffect(() => {
		const totalSku = calculateSkuBySizeAndColorAndLocation(productList, selectedLocation?.locationName);

		const filtered = totalSku?.filter(product => {
			// Check if productTitle matches the search query
			const titleMatches = product?.productTitle?.toLowerCase().includes(searchQuery.toLowerCase());

			// Check if sizes, colors, locationSku, or totalSku match the search query
			const sizeOrColorMatches = product.skuBySizeAndColor.some(entry => {
				// Check if entry.size matches the search query
				const sizeMatches = entry.size.toString().toLowerCase().includes(searchQuery.toLowerCase());

				// Assuming entry.color is an object with a 'name' property
				const colorNameMatches = entry.color && typeof entry.color.name === 'string' && entry.color.name.toLowerCase().includes(searchQuery.toLowerCase());

				return sizeMatches || colorNameMatches;
			});

			// Check if locationSku matches the search query
			const locationSkuMatches = product.skuBySizeAndColor.some(entry => {
				return entry.locationSku.toString().includes(searchQuery);
			});

			// Check if totalSku matches the search query
			const totalSkuMatches = product.skuBySizeAndColor.some(entry => {
				return entry.totalSku.toString().includes(searchQuery);
			});

			// Return true if title, size/color, locationSku, or totalSku matches the search query
			return titleMatches || sizeOrColorMatches || locationSkuMatches || totalSkuMatches;
		});

		setFilteredProducts(filtered);
	}, [productList, searchQuery, selectedLocation]);

	// Assuming purchaseOrderVariants is your array of variants
	const calculateTotals = () => {
		return purchaseOrderVariants.reduce(
			(acc, variant) => {
				const quantity = parseFloat(variant?.quantity) || 0; // Default to 0 if undefined or NaN
				const cost = parseFloat(variant?.cost) || 0; // Default to 0 if undefined or NaN
				const taxPercentage = parseFloat(variant?.tax) || 0; // Default to 0 if undefined or NaN

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

	const getNextOrderNumber = () => {
		if (!purchaseOrderList || purchaseOrderList.length === 0) {
			return 1; // Start from 1 if no orders exist
		}

		// Extract existing order numbers and find the maximum
		const existingOrderNumbers = purchaseOrderList.map(order =>
			parseInt(order.purchaseOrderNumber.replace('P', '')) // Adjusted to use purchaseOrderNumber
		);
		return Math.max(...existingOrderNumbers) + 1; // Increment the maximum order number
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const uploadFile = async (file) => {
		try {
			const formData = new FormData();
			formData.append('attachment', file); // Append the file to FormData

			const response = await axiosPublic.post('/uploadFile', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response?.data?.fileUrl) {
				return response.data.fileUrl; // Return the file URL or path from the response
			}
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const onSubmit = async (data) => {

		const { shipping, discount, referenceNumber, supplierNote, estimatedArrival, paymentTerms } = data;

		let fileUrl = '';
		if (file) {
			fileUrl = await uploadFile(file);
			if (!fileUrl) {
				toast.error('Upload failed, cannot proceed.');
				return;
			}
		}

		// Check if expiryDate is selected
		if (!estimatedArrival) {
			setDateError(true);
			return;  // Do not show toast here, just prevent submission
		}

		// If date is valid, reset the date error
		setDateError(false);

		const formattedEstimatedArrival = formatDate(estimatedArrival);

		if (selectedProducts.length === 0) {
			toast.error("Please add product.");
			return;
		}

		// Ensure required fields are filled
		for (const variant of purchaseOrderVariants) {
			if (!variant.quantity || variant.quantity <= 0) {
				toast.error("Quantity must be greater than 0 for all products.");
				return; // Prevent form submission
			}
			if (!variant.cost || variant.cost <= 0) {
				toast.error("Cost must be greater than 0 for all products.");
				return; // Prevent form submission
			}
		}

		const nextOrderNumber = getNextOrderNumber();
		const purchaseOrderNumber = `P${nextOrderNumber.toString().padStart(3, '0')}`; // Create the new purchase order number

		const orderStatus = isOwner === true ? "ordered" : "pending";

		const purchaseOrderData = {
			estimatedArrival: formattedEstimatedArrival,
			paymentTerms,
			supplier: selectedVendor,
			destination: selectedLocation,
			purchaseOrderVariants: purchaseOrderVariants?.map(variant => ({
				productTitle: variant.productTitle,
				quantity: parseFloat(variant.quantity),
				cost: parseFloat(variant.cost),
				tax: parseFloat(variant.tax) || 0,
				size: variant?.size,
				colorCode: variant.color?.code,  // Include the color code
				colorName: variant.color?.name,   // Include the color name
			})),
			referenceNumber,
			supplierNote,
			shippingCharge: parseFloat(shipping) || 0,
			discountCharge: parseFloat(discount) || 0,
			totalPrice: parseFloat(total),
			purchaseOrderNumber,
			status: orderStatus,
			selectedProducts,
			attachment: fileUrl,
		}

		try {
			const response = await axiosPublic.post('/addPurchaseOrder', purchaseOrderData);
			if (response?.data?.insertedId) {
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
										Purchase order added!
									</p>
									<p className="mt-1 text-sm text-gray-500">
										Purchase order has been added successfully!
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
				router.push("/dash-board/product-hub/purchase-orders")
			}
		} catch (error) {
			toast.error('Failed to add purchase order. Please try again!');
		}

	};

	if (isProductPending || isPurchaseOrderPending || isUserLoading) {
		return <Loading />
	}

	return (
		<div className='bg-gray-50 min-h-screen px-6'>

			<div className='max-w-screen-xl mx-auto pt-3 md:pt-6'>
				<div className='flex items-center justify-between w-full'>
					<h3 className='w-full font-semibold text-lg md:text-xl lg:text-3xl text-neutral-700'>Create purchase order</h3>
					<Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/product-hub/purchase-orders"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
				</div>
			</div>

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
									<p className="text-red-600 text-left">Please select estimated arrival date.</p>
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
															<Image className='h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5' src={product?.imageUrl} alt={product?.productTitle} height={600} width={600} />
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
														<input
															id={`quantity-${index}`}
															{...register(`quantity-${index}`, { required: true })}
															value={purchaseOrderVariants[index]?.quantity || ''}
															onChange={(e) => handleVariantChange(index, 'quantity', e.target.value, product?.productTitle, product?.size, product?.name, product.color)}
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
																onChange={(e) => handleVariantChange(index, 'cost', e.target.value, product?.productTitle, product?.size, product?.name, product.color)}
																className="pl-7 custom-number-input w-full pr-3 py-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
																type="number"
																min="0" // Prevents negative values in the input
															/>
														</div>
														{errors[`cost-${index}`] && (
															<p className="text-red-600 text-left">Cost is required.</p>
														)}
													</td>
													<td className="text-sm p-3 text-neutral-500 text-center font-semibold">
														<div className="input-wrapper">
															<input
																id={`tax-${index}`}
																{...register(`tax-${index}`)} // No required validation here
																value={purchaseOrderVariants[index]?.tax || ''}
																onChange={(e) => handleVariantChange(index, 'tax', e.target.value, product?.productTitle, product?.size, product?.name, product.color)}
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
																type="button"  // Set type to "button" to prevent form submission
																onClick={() => removeSelectedProduct(product, product.size, product.color)}
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

						<div className='w-full flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
							<h1 className='font-semibold'>Additional Details</h1>
							<div>
								<label htmlFor='referenceNumber' className='flex justify-start font-medium text-neutral-500 pb-2'>Reference Number</label>
								<input
									id={`referenceNumber`}
									{...register(`referenceNumber`)}
									className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
									type="text"
								/>
							</div>
							<div>
								<label htmlFor='supplierNote' className='flex justify-start font-medium text-neutral-500 pb-2 pt-[4px]'>Note to supplier</label>
								<input
									id={`supplierNote`}
									{...register(`supplierNote`)}
									className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
									type="text"
								/>
							</div>
							<div>
								<label className='flex justify-start font-medium text-neutral-500 pb-2 pt-[6px]'>Attachment</label>

								<div className="flex items-center w-full p-1 border border-gray-300 rounded-md bg-white shadow-sm cursor-pointer" onClick={() => document.getElementById("attachment").click()}>
									<label
										htmlFor="attachment"
										className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md cursor-pointer hover:bg-gray-950 transition duration-200"
									>
										Choose File
									</label>
									<span className="ml-4 text-gray-600 truncate">
										{file?.name || "No file chosen"}
									</span>
									<input
										id="attachment"
										{...register("attachment")}
										className="hidden"
										type="file"
										accept=".jpg, .jpeg, .png, .gif, .pdf"
										onChange={handleFileChange}
									/>
								</div>

							</div>
						</div>

						<div className='w-full flex flex-col justify-between gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
							<h1 className='font-semibold'>Cost summary</h1>
							<div className='flex flex-col gap-2'>
								<div className='flex justify-between items-center gap-6'>
									<h2 className='font-medium text-neutral-500'>Taxes</h2>
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
									<label htmlFor='shipping' className='flex w-full justify-start font-medium text-neutral-600'>+ Shipping</label>
									<input
										id='shipping'
										{...register('shipping')}
										className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
										type="number"
										onChange={handleShippingChange}  // Step 3: Update shipping state on change
									/>
								</div>
								<div className='flex justify-between items-center gap-6'>
									<label htmlFor='discount' className='flex w-full justify-start font-medium text-neutral-600'>- Discount</label>
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
					<div className='flex justify-end items-center'>
						<Button
							type='submit'
							className={`mt-4 mb-8 bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer font-bold`}
						>
							Create order
						</Button>
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
											<th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b">Products</th>
											<th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">Available at destination</th>
											<th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b text-center">Total available</th>
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
																	product.skuBySizeAndColor.every((entry) =>
																		selectedProducts.some(
																			(p) => p.productTitle === product.productTitle &&
																				p.size === entry.size &&
																				p.color === entry.color?.code && // Ensure color is correctly accessed 
																				p.name === entry.color?.name
																		)
																	)
																}
																onValueChange={() => toggleAllSizesAndColorsForProduct(product)}
															/>

															<div>
																<Image
																	className="h-8 w-8 md:h-12 md:w-12 object-contain bg-white rounded-lg border py-0.5"
																	src={product.imageUrl}
																	alt={product?.productTitle}
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

													{/* Show sizes and colors */}
													{product?.skuBySizeAndColor?.map((entry) => (
														<tr key={`${index}-${entry.size}-${entry.color.code}`} className="hover:bg-gray-50 transition-colors">
															<td className="pl-12 text-xs p-3 text-gray-600 flex items-center">
																<Checkbox
																	key={`${product.productTitle}-${entry.size}-${entry.color?.code}`} // Unique key for each checkbox
																	isSelected={selectedProducts.some(
																		(p) => p.productTitle === product.productTitle &&
																			p.size === entry.size &&
																			p.color === entry.color?.code && // Ensure color is correctly accessed
																			p.name === entry.color?.name
																	)}
																	onValueChange={() => toggleProductSizeColorSelection(product, entry.size, entry.color?.code, entry.color?.name)}
																/>
																<span className="font-semibold ml-2">
																	{entry.size}
																	<span className='flex items-center gap-2'>
																		{entry.color.name}
																	</span>
																</span>
															</td>
															<td className="text-center">{entry.locationSku}</td>
															<td className="text-center">{entry.totalSku}</td>
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

export default CreatePurchaseOrder;