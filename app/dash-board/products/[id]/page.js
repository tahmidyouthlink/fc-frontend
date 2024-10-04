"use client";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import ColorOption from '@/app/components/layout/ColorOption';
import { CustomCheckbox } from '@/app/components/layout/CustomCheckBox';
import { CustomCheckbox2 } from '@/app/components/layout/CustomCheckBox2';
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useCategories from '@/app/hooks/useCategories';
import useColors from '@/app/hooks/useColors';
import useSizeRanges from '@/app/hooks/useSizeRanges';
import useSubCategories from '@/app/hooks/useSubCategories';
import useTags from '@/app/hooks/useTags';
import useVendors from '@/app/hooks/useVendors';
import { generateSizes } from '@/app/utils/GenerateSizes/GenerateSizes';
import { Button, CheckboxGroup, Radio, RadioGroup, Select, SelectItem, Tab, Tabs } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Controller, useForm } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import ReactSelect from 'react-select';
import toast from 'react-hot-toast';
import useShippingZones from '@/app/hooks/useShippingZones';
import useShipmentHandlers from '@/app/hooks/useShipmentHandlers';
import { HiOutlineArchive } from "react-icons/hi";

const Editor = dynamic(() => import('@/app/utils/Editor/Editor'), { ssr: false });
const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const EditProductPage = () => {

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();

  const isAdmin = false;
  const { id } = useParams();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [productDetails, setProductDetails] = useState("");
  const [materialCare, setMaterialCare] = useState("");
  const [sizeFit, setSizeFit] = useState("");
  const [discountType, setDiscountType] = useState('Percentage');
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [categoryList, isCategoryPending] = useCategories();
  const [sizeRangeList, isSizeRangePending] = useSizeRanges();
  const [subCategoryList, isSubCategoryPending] = useSubCategories();
  const [sizeError, setSizeError] = useState(false);
  const [sizeError2, setSizeError2] = useState(false);
  const [sizeError3, setSizeError3] = useState(false);
  const [sizeError4, setSizeError4] = useState(false);
  const [sizeError5, setSizeError5] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [tagError, setTagError] = useState(false);
  const [newArrivalError, setNewArrivalError] = useState(false);
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedNewArrival, setSelectedNewArrival] = useState("");
  const [selectedAvailableColors, setSelectedAvailableColors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [unselectedGroupSelected2, setUnselectedGroupSelected2] = useState([]);
  const [tagList, isTagPending] = useTags();
  const [vendorList, isVendorPending] = useVendors();
  const [colorList, isColorPending] = useColors();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [groupSelected, setGroupSelected] = React.useState();
  const [groupSelected2, setGroupSelected2] = React.useState();
  const [productVariants, setProductVariants] = useState([]);
  const [selectedShipmentHandler, setSelectedShipmentHandler] = useState([]);
  const [shippingList, isShippingPending] = useShippingZones();
  const [shipmentHandlerList, isShipmentHandlerPending] = useShipmentHandlers();
  const [productStatus, setProductStatus] = useState("");

  const toggleCardSelection = (shipping) => {
    const isSelected = selectedShipmentHandler.some(
      (handler) => handler.shippingZone === shipping.shippingZone
    );

    if (isSelected) {
      // If already selected, remove from selectedShipmentHandler
      const updatedSelection = selectedShipmentHandler.filter(
        (handler) => handler.shippingZone !== shipping.shippingZone
      );
      setSelectedShipmentHandler(updatedSelection);
    } else {
      // Add the full shipping object to the selectedShipmentHandler
      const updatedSelection = [...selectedShipmentHandler, shipping];
      setSelectedShipmentHandler(updatedSelection);

      if (sizeError5) {
        setSizeError5(false);
      }
    }
  };

  const handleCategoryChange = (value) => {
    setValue('category', value, { shouldValidate: true });
    setSelectedCategory(value);
    setGroupSelected([]);
    setGroupSelected2([]);
    setSelectedSubCategories([]);
    setUnselectedGroupSelected2([]);
  };

  const handleSubCategoryArray = (keys) => {
    const selectedArray = [...keys];
    if (selectedArray.length > 0) {
      setSizeError4(false);
    }
    else {
      setSizeError4(true);
    }
    setSelectedSubCategories(selectedArray);
  };

  const handleGroupSelectedChange = (sizes) => {
    if (sizes.length > 1) {
      return; // Prevent selecting more than one size
    }

    // Clear the sizeError2 if at least one size is selected
    if (sizes.length > 0) {
      setSizeError2(false);
    }

    // Generate related sizes based on the selected size range
    const newRelatedSizes = sizes.flatMap(size => generateSizes(size) || []);
    setGroupSelected(sizes);

    setGroupSelected2(prevSelected => {
      // Ensure prevSelected is an array
      const prevSelectedArray = Array.isArray(prevSelected) ? prevSelected : [];

      // Filter the sizes that are included in newRelatedSizes
      const filteredSizes = prevSelectedArray.filter(size => newRelatedSizes.includes(size));

      // Filter out sizes that are not already selected and not unselected
      const newSizes = newRelatedSizes.filter(size => !filteredSizes.includes(size) && !unselectedGroupSelected2.includes(size));

      // Combine the filtered sizes and new sizes
      const updatedGroupSelected2 = [...filteredSizes, ...newSizes];

      return updatedGroupSelected2;
    });
  };

  const handleGroupSelected2Change = (sizes) => {
    setGroupSelected2(sizes);

    if (sizes.length > 0) {
      setSizeError3(false);
    }

    setUnselectedGroupSelected2(prevUnselected => {
      // Ensure groupSelected2 and sizes are arrays
      const groupSelected2Array = Array.isArray(groupSelected2) ? groupSelected2 : [];
      const sizesArray = Array.isArray(sizes) ? sizes : [];

      const newlyUnselected = groupSelected2Array.filter(size => !sizesArray.includes(size));
      return [...prevUnselected, ...newlyUnselected];
    });
  };

  const handleImagesChange = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) {
      setSizeError(true);
      return;
    } else {
      setSizeError(false);
    }

    await processFiles(files);
  };

  const processFiles = async (files) => {
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) {
      toast.error("Please select valid image files (PNG, JPEG, JPG).");
      return;
    }

    const totalImages = validFiles.length + uploadedImageUrls.length;
    if (totalImages > 6) {
      toast.error("You can only upload a maximum of 6 images.");
      return;
    }

    const newImages = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    const imageUrls = await uploadImagesToImgbb(newImages);
    const updatedUrls = [...uploadedImageUrls, ...imageUrls];

    const limitedUrls = updatedUrls.slice(-6);
    setUploadedImageUrls(limitedUrls);

    // Clear size error if there are valid images
    if (limitedUrls.length > 0) {
      setSizeError(false);
    }
  };

  const validateFiles = (files) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    return files.filter(file => validTypes.includes(file.type));
  };

  const uploadImagesToImgbb = async (images) => {
    const imageUrls = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('key', apiKey);
      try {
        const response = await axiosPublic.post(apiURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data && response.data.data && response.data.data.url) {
          imageUrls.push(response.data.data.url);
        } else {
          toast.error("Failed to get image URL from response.");
        }
      } catch (error) {
        toast.error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
      }
    }
    return imageUrls;
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    await processFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageRemove = (index) => {
    const updatedUrls = uploadedImageUrls.filter((_, i) => i !== index);
    setUploadedImageUrls(updatedUrls);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(uploadedImageUrls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUploadedImageUrls(items);
  };

  const handleTabChange = (key) => {
    setDiscountType(key);
  };

  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      setProductVariants(prevVariants =>
        prevVariants.map(variant => ({
          ...variant,
          imageUrl: "", // Reset image URL for each variant
        }))
      );
    }
  }, [uploadedImageUrls]);

  const initializeVariants = useCallback((colors, sizes, savedVariants) => {
    // Filter saved variants based on available colors and sizes
    const variants = savedVariants?.filter(variant =>
      sizes.includes(variant.size) && colors.some(color => color.value === variant.color.value)
    );

    // Add new variants for new sizes or colors
    for (const color of colors) {
      for (const size of sizes) {
        if (!variants.some(variant => variant.color.value === color.value && variant.size === size)) {
          variants.push({ color, size, sku: "", imageUrl: "" });
        }
      }
    }

    // Avoid re-setting the productVariants if nothing has changed to prevent loops
    setProductVariants((prevVariants) => {
      if (JSON.stringify(prevVariants) !== JSON.stringify(variants)) {
        return variants;
      }
      return prevVariants; // No change
    });

    // Set form values for each variant
    variants.forEach((variant, index) => {
      setValue(`sku-${index}`, variant.sku);
      setValue(`imageUrl-${index}`, variant.imageUrl);
    });

  }, [setValue]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/singleProduct/${id}`);
        setValue('productTitle', data?.productTitle);
        setValue('batchCode', data?.batchCode);
        setValue('weight', data?.weight);
        setValue('regularPrice', data?.regularPrice);
        setValue('discountValue', data?.discountValue)
        setUploadedImageUrls(data?.imageUrls);
        setDiscountType(data?.discountType);
        setProductDetails(data?.productDetails);
        setMaterialCare(data?.materialCare);
        setSizeFit(data?.sizeFit);
        setSelectedCategory(data?.category);
        setValue('category', data?.category);
        setSelectedSubCategories(data?.subCategories);
        setGroupSelected(data?.groupOfSizes);
        setGroupSelected2(data?.allSizes);
        setSelectedAvailableColors(data?.availableColors);
        setSelectedNewArrival(data?.newArrival);
        setSelectedVendors(data?.vendors);
        setSelectedTags(data?.tags);
        initializeVariants(data?.availableColors || [], data?.allSizes || [], data?.productVariants || []);
        setProductStatus(data?.status);
        setSelectedShipmentHandler(data?.shippingDetails || []);

        if (typeof document !== 'undefined') {
          setMenuPortalTarget(document.body);
        }
      } catch (error) {
        toast.error("Failed to load shipping zone details.");
      }
    };

    fetchProductDetails();
  }, [id, setValue, axiosPublic, initializeVariants]);

  // Only reinitialize variants when colors or sizes change, not productVariants itself
  useEffect(() => {
    if (selectedAvailableColors.length > 0 && groupSelected2.length > 0) {
      initializeVariants(selectedAvailableColors, groupSelected2, productVariants);
    }
  }, [selectedAvailableColors, groupSelected2, initializeVariants, productVariants]);

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...productVariants];
    updatedVariants[index][field] = value;
    setProductVariants(updatedVariants);
  };

  const onImageClick = (variantIndex, imgUrl) => {
    setProductVariants(prevVariants =>
      prevVariants.map((variant, index) =>
        index === variantIndex ? { ...variant, imageUrl: imgUrl } : variant
      )
    );

    // Update form value for imageUrl
    setValue(`imageUrl-${variantIndex}`, imgUrl);
  };

  const handleColorChange = (newValue) => {
    setSelectedAvailableColors(newValue);
    if (newValue.length === 0) {
      setColorError(true);  // Show error if no color is selected
    } else {
      setColorError(false); // Hide error if at least one color is selected
    }
  };

  const handleVendorChange = (newValue) => {
    setSelectedVendors(newValue);
  };

  const handleTagChange = (newValue) => {
    setSelectedTags(newValue);
    if (newValue.length === 0) {
      setTagError(true);  // Show error if no color is selected
    } else {
      setTagError(false); // Hide error if at least one color is selected
    }
  };

  const handleNewArrivalChange = (newValue) => {
    setSelectedNewArrival(newValue);
    if (newValue) {
      setNewArrivalError(false);  // Show error if no color is selected
    } else {
      setNewArrivalError(true); // Hide error if at least one color is selected
    }
  };

  const onSubmit = async (data) => {
    try {
      if (uploadedImageUrls.length === 0) {
        setSizeError(true);
        return;
      }
      setSizeError(false);
      if (groupSelected.length === 0) {
        setSizeError2(true);
        return;
      }
      setSizeError2(false);
      if (groupSelected2.length === 0) {
        setSizeError3(true);
        return;
      }
      setSizeError3(false);
      if (selectedSubCategories.length === 0) {
        setSizeError4(true);
        return;
      }
      setSizeError4(false);

      if (selectedShipmentHandler.length === 0) {
        setSizeError5(true);
        return;
      }
      setSizeError5(false);

      if (selectedAvailableColors.length === 0) {
        setColorError(true);
        return;
      }
      setColorError(false);

      if (selectedTags.length === 0) {
        setTagError(true);
        return;
      }
      setTagError(false);

      if (selectedNewArrival === '') {
        setNewArrivalError(true);
        return;
      }
      setNewArrivalError(false);

      const formattedData = productVariants?.map((variant, index) => ({
        color: variant.color,
        size: variant.size,
        sku: parseFloat(data[`sku-${index}`]),
        imageUrl: data[`imageUrl-${index}`] || ""
      }));

      // Check if any variant is missing an image URL
      const missingImage = formattedData.some(variant => variant.imageUrl === "");
      if (missingImage) {
        toast.error("Please select an image for each variant.");
        return; // Stop submission if any image is missing
      }

      const updatedProductData = {
        productTitle: data?.productTitle,
        regularPrice: data?.regularPrice,
        weight: data?.weight,
        batchCode: data?.batchCode,
        imageUrls: uploadedImageUrls,
        discountType: discountType,
        discountValue: data?.discountValue,
        productDetails: productDetails,
        materialCare: materialCare,
        sizeFit: sizeFit,
        category: selectedCategory,
        subCategories: selectedSubCategories,
        groupOfSizes: groupSelected,
        allSizes: groupSelected2,
        availableColors: selectedAvailableColors,
        newArrival: selectedNewArrival,
        vendors: selectedVendors,
        tags: selectedTags,
        productVariants: formattedData,
        shippingDetails: selectedShipmentHandler,
        status: data?.status
      }

      const res = await axiosPublic.put(`/editProductDetails/${id}`, updatedProductData);
      if (res.data.modifiedCount > 0) {
        toast.success('Product Details updated successfully!');
        router.push(`/dash-board/products/existing-products/${selectedCategory}`);
      } else {
        toast.error('No changes detected!');
      }

    } catch (err) {
      toast.error("Failed to publish product details!");
    }
  };

  if (isCategoryPending || isSizeRangePending || isSubCategoryPending || isTagPending || isVendorPending || isColorPending || isShippingPending || isShipmentHandlerPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className='max-w-screen-2xl mx-auto flex justify-between px-6 items-center pt-2 xl:pt-4'>
          <h3 className='font-semibold text-xl md:text-2xl xl:text-3xl'>Update Product Details</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base' href={`/dash-board/products/existing-products/${selectedCategory}`}> <span className='border border-black rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>

        <div className='max-w-screen-2xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-12'>
            <div className='grid grid-cols-1 lg:col-span-7 xl:col-span-7 gap-8 md:mt-2 px-6 py-3'>
              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                <label htmlFor='productTitle' className='flex justify-start font-medium text-[#9F5216]'>Product Title *</label>
                <input id='productTitle' {...register("productTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" placeholder='Enter Product Title' type="text" />
                {errors.productTitle?.type === "required" && (
                  <p className="text-red-600 text-left">Product Title is required</p>
                )}
                <label htmlFor='productDetails' className='flex justify-start font-medium text-[#9F5216]'>
                  Details About This Product
                </label>
                <Controller
                  name="productDetails"
                  defaultValue=""
                  control={control}
                  render={() => <Editor
                    value={productDetails}
                    onChange={(value) => {
                      setProductDetails(value);
                    }}
                  />}
                />
              </div>

              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

                <div className='flex flex-col rounded-md relative'>
                  <label htmlFor="category" className='text-xs px-2'>Category</label>
                  <select
                    id="category"
                    className={`bg-gray-100 p-2 rounded-md ${errors.category ? 'border-red-600' : ''}`}
                    value={selectedCategory}
                    {...register('category', { required: 'Category is required' })}
                    onChange={(e) => {
                      handleCategoryChange(e.target.value);
                    }}
                  >
                    <option value="" disabled className='bg-white'>Select a category</option>
                    {categoryList?.map((category) => (
                      <option className='bg-white' key={category.key} value={category.label}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-600 text-left">{errors.category.message}</p>
                  )}
                </div>

                {selectedCategory && sizeRangeList[selectedCategory] && (
                  <div className="flex flex-col gap-1 w-full">
                    <CheckboxGroup
                      className="gap-1"
                      label="Select size"
                      orientation="horizontal"
                      value={groupSelected}
                      onChange={handleGroupSelectedChange}
                    >
                      {sizeRangeList[selectedCategory]?.map((size) => (
                        <CustomCheckbox
                          key={size}
                          value={size}
                          isDisabled={groupSelected?.length > 0 && !groupSelected?.includes(size)} // Disable other sizes if one is selected
                        >
                          {size}
                        </CustomCheckbox>
                      ))}
                    </CheckboxGroup>
                    {sizeError2 && (
                      <p className="text-red-600 text-left">Please select at least one size.</p>
                    )}
                  </div>
                )}

                {groupSelected?.length > 0 && (
                  <div className="flex flex-col gap-1 w-full">
                    <CheckboxGroup
                      className="gap-1"
                      label="Unselect sizes"
                      orientation="horizontal"
                      value={groupSelected2}
                      onChange={handleGroupSelected2Change}
                    >
                      {generateSizes(groupSelected[0] || '')?.map(size => (
                        <CustomCheckbox2 key={size} value={size}>{size}</CustomCheckbox2>
                      ))}
                    </CheckboxGroup>
                    <p className="mt-4 ml-1 text-default-500">
                      Selected: {groupSelected2?.join(", ")}
                    </p>
                    {sizeError3 && (
                      <p className="text-red-600 text-left">Please select at least one size.</p>
                    )}
                  </div>
                )}

                {groupSelected2?.length > 0 && (
                  <div className="flex w-full flex-col gap-2">
                    <Controller
                      name="subCategories"
                      control={control}
                      defaultValue={selectedSubCategories}
                      rules={{ required: 'Sub-Category is required' }}
                      render={({ field }) => (
                        <div>
                          <Select
                            label="Sub-categories"
                            selectionMode="multiple"
                            value={selectedSubCategories}
                            placeholder="Select Sub-categories"
                            selectedKeys={new Set(selectedSubCategories)}
                            onSelectionChange={(keys) => {
                              handleSubCategoryArray(keys);
                              field.onChange([...keys]);
                            }}
                          >
                            {subCategoryList[selectedCategory]?.map((subCategory) => (
                              <SelectItem key={subCategory.key}>
                                {subCategory.label}
                              </SelectItem>
                            ))}
                          </Select>

                          {/* Conditional Error Display */}
                          {errors.subCategories ? (
                            <p className="text-red-600 text-left">{errors.subCategories.message}</p>
                          ) : (
                            sizeError4 && <p className="text-red-600 text-left">Sub-Category is required.</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}

                <label htmlFor='availableColors' className='flex justify-start font-medium text-[#9F5216]'>Select Available Colors *</label>
                <div className="parent-container">
                  <ReactSelect
                    options={colorList}
                    isMulti
                    className="w-full border rounded-md creatable-select-container"
                    components={{ Option: ColorOption }}
                    menuPortalTarget={menuPortalTarget}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    menuPlacement="auto"
                    value={selectedAvailableColors}
                    onChange={handleColorChange}
                  />
                </div>
                {colorError && (
                  <p className="text-red-600 text-left">Colors are required</p>
                )}

                <div className="flex flex-col gap-3">
                  <RadioGroup
                    label="Is New Arrival?"
                    value={selectedNewArrival}
                    onValueChange={handleNewArrivalChange}
                    orientation="horizontal"
                  >
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </RadioGroup>
                  <p className="text-default-500 text-small">Selected: {selectedNewArrival}</p>
                  {newArrivalError && (
                    <p className="text-red-600 text-left">New Arrival Selection is required</p>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                <label htmlFor='materialCare' className='flex justify-start font-medium text-[#9F5216]'>Material Care</label>
                <Controller
                  name="materialCare"
                  defaultValue=""
                  control={control}
                  render={() => <Editor
                    value={materialCare}
                    onChange={(value) => {
                      setMaterialCare(value);
                    }}
                  />}
                />

                <label htmlFor='sizeFit' className='flex justify-start font-medium text-[#9F5216]'>Size Fit</label>
                <Controller
                  name="sizeFit"
                  defaultValue=""
                  control={control}
                  render={() => <Editor
                    value={sizeFit}
                    onChange={(value) => {
                      setSizeFit(value);
                    }}
                  />}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 lg:col-span-5 xl:col-span-5 gap-8 mt-6 px-6 py-3'>
              <div className='flex flex-col gap-4 h-fit'>
                <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                  <div>
                    <label htmlFor='regularPrice' className='flex justify-start font-medium text-[#9F5216] mt-4'>Regular Price ৳ *</label>
                    <input id='regularPrice' {...register("regularPrice", { required: true })} className="custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000" placeholder='Enter Product Price' type="number" />
                    {errors.regularPrice?.type === "required" && (
                      <p className="text-red-600 text-left">Product Price is required</p>
                    )}
                  </div>

                  <div className="flex w-full flex-col">
                    <Tabs isDisabled={!isAdmin}
                      aria-label="Discount Type"
                      selectedKey={discountType}
                      onSelectionChange={handleTabChange}
                    >
                      <Tab key="Percentage" title="Percentage">Discount (%)</Tab>
                      <Tab key="Flat" title="Flat">Flat Discount (taka)</Tab>
                    </Tabs>

                    <input
                      type="number"
                      disabled={!isAdmin}
                      {...register('discountValue')}
                      className='custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000'
                      placeholder={`Enter ${discountType} Discount`} // Correct placeholder
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                  <div>
                    <label htmlFor={`batchCode`} className='font-medium text-[#9F5216]'>Batch Code *</label>
                    <input
                      id={`batchCode`}
                      autoComplete="off"
                      {...register(`batchCode`, {
                        required: 'Batch Code is required',
                        pattern: {
                          value: /^[A-Z0-9]*$/,
                          message: 'Batch Code must be alphanumeric and uppercase',
                        },
                      })}
                      placeholder={`Enter Batch Code`}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md mt-2"
                      type="text"
                      onChange={(e) => {
                        // Convert input to uppercase and remove non-alphanumeric characters
                        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      }}
                    />
                    {errors.batchCode && (
                      <p className="text-red-600 text-left">{errors.batchCode.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`weight`} className='font-medium text-[#9F5216]'>Weight</label>
                    <input
                      id={`weight`}
                      {...register(`weight`)}
                      placeholder={`Enter Weight`}
                      className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md mt-2"
                      type="number"
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

                  <label htmlFor='tags' className='flex justify-start font-medium text-[#9F5216]'>Select Tag *</label>
                  <div className="parent-container">
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
                  {tagError && (
                    <p className="text-red-600 text-left">Tags are required</p>
                  )}

                  <label htmlFor='vendors' className='flex justify-start font-medium text-[#9F5216]'>Select Vendor *</label>
                  <div className="parent-container">
                    <ReactSelect
                      options={vendorList}
                      isMulti
                      className="w-full border rounded-md creatable-select-container"
                      value={selectedVendors}
                      menuPortalTarget={menuPortalTarget}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      menuPlacement="auto"
                      onChange={handleVendorChange}
                    />
                  </div>

                </div>

                <div className={`flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg`}>
                  <div className='flex flex-col gap-4'>
                    <input
                      id='imageUpload'
                      type='file'
                      className='hidden'
                      multiple
                      onChange={handleImagesChange}
                    />
                    <label
                      htmlFor='imageUpload'
                      className='mx-auto flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-gray-400 p-6 bg-white'
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <MdOutlineFileUpload size={60} />
                      <div className='space-y-1.5 text-center'>
                        <h5 className='whitespace-nowrap text-lg font-medium tracking-tight'>
                          Upload or Drag Media
                        </h5>
                        <p className='text-sm text-gray-500'>
                          Photos Should be in PNG, JPEG or JPG format
                        </p>
                      </div>
                    </label>
                    {sizeError && (
                      <p className="text-red-600 text-left">Please select at least one image</p>
                    )}

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <ul
                            className="list-none p-0"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                              {uploadedImageUrls.map((url, index) => (
                                <Draggable key={url} draggableId={url} index={index}>
                                  {(provided) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center mb-2 p-2 bg-white border border-gray-300 rounded-md relative"
                                    >
                                      <Image
                                        src={url}
                                        alt={`Uploaded image ${index + 1}`}
                                        height={100}
                                        width={200}
                                        className='w-full h-auto rounded-md'
                                      />
                                      <button
                                        onClick={() => handleImageRemove(index)}
                                        className='absolute top-1 right-1 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white font-bold'
                                      >
                                        <RxCross2 size={24} />
                                      </button>
                                    </li>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div className='bg-white pb-4 xl:pb-8'>
          <div className='2xl:max-w-screen-2xl 2xl:mx-auto mt-4 xl:mt-8'>
            <h3 className='font-semibold text-xl md:text-2xl xl:text-3xl px-6 pt-2 md:pt-6'>Update Inventory Variants</h3>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 px-6 py-6'>
              {productVariants?.map((variant, index) => (
                <div key={index} className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                  <div className='flex items-center gap-2 md:gap-4'>
                    <div className='w-1/3'>
                      <label className='font-medium text-[#9F5216]'>Color</label>
                      <input
                        type="text"
                        value={variant.color.label}
                        className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                        disabled
                      />
                    </div>
                    <div className='w-1/3'>
                      <label className='font-medium text-[#9F5216]'>Size</label>
                      <input
                        type="text"
                        value={variant.size}
                        className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                        disabled
                      />
                    </div>
                    <div className='md:w-1/3'>
                      <label htmlFor={`sku-${index}`} className='font-medium text-[#9F5216]'>SKU</label>
                      <input
                        id={`sku-${index}`}
                        {...register(`sku-${index}`, { required: true })}
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                        type="number"
                      />
                      {errors[`sku-${index}`] && (
                        <p className="text-red-600 text-left">SKU is required</p>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col gap-4'>
                    <label className='font-medium text-[#9F5216]'>Select Media</label>
                    <div className={`grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-2`}>
                      {uploadedImageUrls.map((url, imgIndex) => (
                        <div
                          key={imgIndex}
                          className={`image-container ${variant.imageUrl === url ? 'selected' : ''}`}
                          onClick={() => onImageClick(index, url)}
                        >
                          <Image src={url} alt={`image-${imgIndex}`} width={800} height={800} className="rounded-md" />
                        </div>
                      ))}
                    </div>
                    {errors[`imageUrl-${index}`] && (
                      <p className="text-red-600 text-left">Image selection is required</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='2xl:max-w-screen-2xl 2xl:mx-auto'>
          <h3 className='font-semibold text-xl md:text-2xl xl:text-3xl px-6 pt-2 md:pt-6'>Update Shipping Details</h3>
          <div>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-6 pt-6'>
              {shippingList?.map((shipping, index) => {
                const isSelected = selectedShipmentHandler.some(
                  (handler) => handler.shippingZone === shipping?.shippingZone
                );
                return (
                  <div
                    key={index}
                    onClick={() => toggleCardSelection(shipping)}
                    className={`cursor-pointer flex flex-col gap-4 p-5 md:p-7 rounded-lg transition-all duration-300 ${isSelected ? 'border-2 border-blue-500 bg-white duration-300' : 'border border-gray-200 bg-gray-100'
                      }`}
                  >
                    <h1 className="text-2xl font-bold text-gray-900 text-center">{shipping?.shippingZone}</h1>
                    <div className='flex items-center justify-center gap-4'>
                      {shipmentHandlerList?.map((handler, handlerIndex) => (
                        shipping?.selectedShipmentHandler?.shipmentHandlerName === handler?.shipmentHandlerName && (
                          <div key={handlerIndex} className="p-4 rounded-lg flex flex-col items-center justify-center h-40 w-40">
                            {handler?.imageUrl && (
                              <Image
                                src={handler.imageUrl}
                                alt="shipping"
                                width={100}
                                height={100}
                                className="mb-2 object-contain h-32 w-32"
                              />
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {sizeError5 && (
              <p className='text-red-600 text-left mt-4 max-w-screen-xl px-6'>Please select at least one shipping handler.</p>
            )}
          </div>
        </div>

        <div className='2xl:max-w-screen-2xl 2xl:mx-auto flex justify-between px-6 pt-8 pb-16'>
          {productStatus === "active" ?
            <Button color="danger" size='sm' className='flex items-center gap-1' onClick={handleSubmit((formData) => {
              setProductStatus("archive"); // Set status to archive
              onSubmit({ ...formData, status: "archive" }); // Pass the updated status directly
            })}
            >
              Archive <HiOutlineArchive size={18} /></Button>
            :
            <Button
              className="flex items-center gap-1" size='sm'
              color="secondary"
              onClick={handleSubmit((formData) => {
                setProductStatus("active"); // Set status to active
                onSubmit({ ...formData, status: "active" }); // Pass the updated status directly
              })}
            >
              Publish <MdOutlineFileUpload size={18} />
            </Button>
          }

          <button type='submit' className='bg-[#9F5216] hover:bg-[#804010] text-white px-4 py-1.5 rounded-md flex items-center gap-2 text-sm'>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;