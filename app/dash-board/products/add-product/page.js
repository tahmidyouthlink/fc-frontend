"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import toast from 'react-hot-toast';
import ReactSelect from "react-select";
import ColorOption from '@/app/components/layout/ColorOption';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { CheckboxGroup, Select, SelectItem, Tabs, Tab, RadioGroup, Radio } from "@nextui-org/react";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { CustomCheckbox } from '@/app/components/layout/CustomCheckBox';
import { CustomCheckbox2 } from '@/app/components/layout/CustomCheckBox2';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa6';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import { MdOutlineFileUpload } from 'react-icons/md';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import useCategories from '@/app/hooks/useCategories';
import Loading from '@/app/components/shared/Loading/Loading';
import useSizeRanges from '@/app/hooks/useSizeRanges';
import { generateSizes } from '@/app/utils/GenerateSizes/GenerateSizes';
import useSubCategories from '@/app/hooks/useSubCategories';
import useTags from '@/app/hooks/useTags';
import useVendors from '@/app/hooks/useVendors';
import useColors from '@/app/hooks/useColors';

const Editor = dynamic(() => import('@/app/utils/Editor/Editor'), { ssr: false });
const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const FirstStepOfAddProduct = () => {

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [tagList, isTagPending] = useTags();
  const [vendorList, isVendorPending] = useVendors();
  const [colorList, isColorPending] = useColors();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [groupSelected, setGroupSelected] = React.useState();
  const [groupSelected2, setGroupSelected2] = React.useState();
  const [navigate, setNavigate] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [sizeError2, setSizeError2] = useState(false);
  const [sizeError3, setSizeError3] = useState(false);
  const [sizeError4, setSizeError4] = useState(false);
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedNewArrival, setSelectedNewArrival] = useState("");
  const [selectedAvailableColors, setSelectedAvailableColors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [unselectedGroupSelected2, setUnselectedGroupSelected2] = React.useState([]);
  const [productDetails, setProductDetails] = useState("");
  const [materialCare, setMaterialCare] = useState("");
  const [sizeFit, setSizeFit] = useState("");
  const [discountType, setDiscountType] = useState('Percentage');
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [categoryList, isCategoryPending] = useCategories();
  const [sizeRangeList, isSizeRangePending] = useSizeRanges();
  const [subCategoryList, isSubCategoryPending] = useSubCategories();

  const handleCategoryChange = (value) => {
    localStorage.setItem('category', value); // Save the selected category to local storage
    setValue('category', value, { shouldValidate: true });
    setSelectedCategory(value);
    setGroupSelected([]);
    setGroupSelected2([]);
    setSelectedSubCategories([]);
    setUnselectedGroupSelected2([]);
    localStorage.removeItem("groupOfSizes");
    localStorage.removeItem("allSizes");
    localStorage.removeItem("subCategories");
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

    localStorage.setItem('subCategories', JSON.stringify(selectedSubCategories));
  };

  const handleGroupSelectedChange = (sizes) => {
    if (sizes.length > 1) {
      return; // Prevent selecting more than one size
    }

    // Clear the sizeError2 if at least one size is selected
    if (sizes.length > 0) {
      setSizeError2(false);
    }

    localStorage.setItem('groupOfSizes', JSON.stringify(sizes));

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

      localStorage.setItem('allSizes', JSON.stringify(updatedGroupSelected2));

      return updatedGroupSelected2;
    });
  };

  const handleGroupSelected2Change = (sizes) => {
    localStorage.setItem('allSizes', JSON.stringify(sizes));
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
    localStorage.setItem('uploadedImageUrls', JSON.stringify(limitedUrls));

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
    localStorage.setItem('uploadedImageUrls', JSON.stringify(updatedUrls));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(uploadedImageUrls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUploadedImageUrls(items);
    localStorage.setItem('uploadedImageUrls', JSON.stringify(items));
  };

  const handleTabChange = (key) => {
    setDiscountType(key);
    localStorage.setItem('discountType', key);
  };

  useEffect(() => {
    // Function to clear the relevant parts of local storage
    const clearVariantStorage = () => {
      const storedVariants = JSON.parse(localStorage.getItem('productVariants') || '[]');
      const storedSizes = JSON.parse(localStorage.getItem('allSizes') || '[]');
      const storedColors = JSON.parse(localStorage.getItem('availableColors') || '[]');
      const updatedVariants = storedVariants.filter(variant =>
        storedSizes.includes(variant.size) && storedColors.some(color => color.value === variant.color.value)
      );
      localStorage.setItem('productVariants', JSON.stringify(updatedVariants));
    };

    // Call the clearVariantStorage function whenever allSizes or availableColors change
    clearVariantStorage();
  }, []);

  useEffect(() => {
    try {
      const safelyParseJSON = (json) => {
        try {
          return JSON.parse(json);
        } catch (e) {
          return null;
        }
      };

      const storedProductTitle = localStorage.getItem('productTitle');
      if (storedProductTitle) setValue('productTitle', storedProductTitle);

      const storedRegularPrice = localStorage.getItem('regularPrice');
      if (storedRegularPrice) setValue('regularPrice', storedRegularPrice);

      const storedUploadedImageUrls = JSON.parse(localStorage.getItem('uploadedImageUrls') || '[]');
      if (Array.isArray(storedUploadedImageUrls)) {
        setUploadedImageUrls(storedUploadedImageUrls);
      }

      const storedDiscountType = localStorage.getItem('discountType');
      if (storedDiscountType) {
        setDiscountType(storedDiscountType);
      }

      const storedDiscountValue = localStorage.getItem('discountValue');
      if (storedDiscountValue) {
        setValue('discountValue', storedDiscountValue || 0);
      }

      const storedProductDetails = localStorage.getItem('productDetails');
      if (storedProductDetails) {
        setProductDetails(storedProductDetails); // Initialize state
        setValue('productDetails', storedProductDetails); // Set form default value
      }

      const storedMaterialCare = localStorage.getItem('materialCare');
      if (storedMaterialCare) {
        setMaterialCare(storedMaterialCare);
        setValue('materialCare', storedMaterialCare);
      }

      const storedSizeFit = localStorage.getItem('sizeFit');
      if (storedSizeFit) {
        setSizeFit(storedSizeFit);
        setValue('sizeFit', storedSizeFit);
      }

      const storedCategory = localStorage.getItem('category');
      if (storedCategory) {
        setSelectedCategory(storedCategory);
        setValue('category', storedCategory);
      }

      const storedSubCategories = JSON.parse(localStorage.getItem('subCategories') || '[]');
      if (Array.isArray(storedSubCategories)) {
        setSelectedSubCategories(storedSubCategories);
        setValue('subCategories', storedSubCategories);
      }

      const storedGroupOfSizes = localStorage.getItem('groupOfSizes');
      if (storedGroupOfSizes) {
        setGroupSelected(JSON.parse(storedGroupOfSizes) || []);
      }

      const storedAllSizes = localStorage.getItem('allSizes');
      if (storedAllSizes) {
        setGroupSelected2(JSON.parse(storedAllSizes) || []);
      }

      const storedAvailableColors = JSON.parse(localStorage.getItem('availableColors') || '[]');
      if (Array.isArray(storedAvailableColors)) {
        setSelectedAvailableColors(storedAvailableColors);
        setValue('availableColors', storedAvailableColors);
      }

      const storedNewArrival = localStorage.getItem('newArrival');
      if (storedNewArrival) {
        setSelectedNewArrival(storedNewArrival);
        setValue('newArrival', storedNewArrival);
      }

      const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      if (Array.isArray(storedVendors)) {
        setSelectedVendors(storedVendors);
        setValue('vendors', storedVendors);
      }

      const storedTags = JSON.parse(localStorage.getItem('tags') || '[]');
      if (Array.isArray(storedTags)) {
        setSelectedTags(storedTags);
        setValue('tags', storedTags);
      }

      if (typeof document !== 'undefined') {
        setMenuPortalTarget(document.body);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }, [setValue]);

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

      const currentDate = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = currentDate.toLocaleDateString('en-US', options);

      localStorage.setItem('formattedDate', formattedDate);
      localStorage.setItem('productTitle', data.productTitle);
      localStorage.setItem('regularPrice', parseFloat(data.regularPrice) || 0);
      localStorage.setItem('discountType', discountType);
      localStorage.setItem('discountValue', parseFloat(data.discountValue || 0));

      localStorage.setItem('subCategories', JSON.stringify(selectedSubCategories));
      localStorage.setItem('availableColors', JSON.stringify(data.availableColors));
      localStorage.setItem('vendors', JSON.stringify(data.vendors));
      localStorage.setItem('tags', JSON.stringify(data.tags));
      localStorage.setItem('newArrival', data.newArrival);
      setNavigate(true);
    } catch (err) {
      toast.error("Failed to publish your work");
    }
  };

  useEffect(() => {
    if (navigate) {
      router.push("/dash-board/products/add-product-2");
      setNavigate(false); // Reset the state
    }
  }, [navigate, router]);

  if (isCategoryPending || isSizeRangePending || isSubCategoryPending || isTagPending || isVendorPending || isColorPending) {
    return <Loading />
  }

  return (
    <div className='bg-gray-50'>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Product Details</h3>
      <form className='2xl:max-w-screen-2xl 2xl:mx-auto' onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 lg:grid-cols-12'>

          <div className='grid grid-cols-1 lg:col-span-7 xl:col-span-7 gap-8 mt-6 px-6 py-3'>
            <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
              <label htmlFor='productTitle' className='flex justify-start font-medium text-[#9F5216]'>Product Title *</label>
              <input id='productTitle' {...register("productTitle", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" type="text" />
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
                    localStorage.setItem('productDetails', value); // Update local storage
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
              <Controller
                name="availableColors"
                control={control}
                defaultValue={selectedAvailableColors}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="parent-container">
                    <ReactSelect
                      {...field}
                      options={colorList}
                      isMulti
                      className="w-full border rounded-md creatable-select-container"
                      components={{ Option: ColorOption }}
                      menuPortalTarget={menuPortalTarget}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      menuPlacement="auto"
                      value={selectedAvailableColors}
                      onChange={(newValue) => {
                        setSelectedAvailableColors(newValue);
                        field.onChange(newValue);
                      }}
                    />
                  </div>
                )}
              />
              {errors.availableColors && (
                <p className="text-red-600 text-left">Colors are required</p>
              )}

              <Controller
                name="newArrival"
                control={control}
                defaultValue={selectedNewArrival}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <RadioGroup
                      {...field}
                      label="Is New Arrival?"
                      value={selectedNewArrival}
                      onValueChange={setSelectedNewArrival}
                      orientation="horizontal"
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </RadioGroup>
                    <p className="text-default-500 text-small">Selected: {selectedNewArrival}</p>
                    {errors.newArrival && (
                      <p className="text-red-600 text-left">New Arrival Selection is required</p>
                    )}
                  </div>
                )}
              />
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
                    localStorage.setItem('materialCare', value); // Update local storage
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
                    localStorage.setItem('sizeFit', value); // Update local storage
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
                  <input id='regularPrice' {...register("regularPrice", { required: true })} className="custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000" type="number" />
                  {errors.regularPrice?.type === "required" && (
                    <p className="text-red-600 text-left">Product Price is required</p>
                  )}
                </div>

                <div className="flex w-full flex-col">
                  <Tabs
                    aria-label="Discount Type"
                    selectedKey={discountType}
                    onSelectionChange={handleTabChange}
                  >
                    <Tab key="Percentage" title="Percentage">Percentage (%)</Tab>
                    <Tab key="Flat" title="Flat">Flat (Taka)</Tab>
                  </Tabs>

                  <input
                    type="number"
                    {...register('discountValue')}
                    className='custom-number-input w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000'
                    placeholder={`Enter ${discountType} Discount`} // Correct placeholder
                  />
                </div>
              </div>

              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
                <label htmlFor='vendors' className='flex justify-start font-medium text-[#9F5216]'>Select Vendor *</label>
                <Controller
                  name="vendors"
                  control={control}
                  defaultValue={selectedVendors}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="parent-container">
                      <ReactSelect
                        {...field}
                        options={vendorList}
                        isMulti
                        className="w-full border rounded-md creatable-select-container"
                        value={selectedVendors}
                        menuPortalTarget={menuPortalTarget}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        menuPlacement="auto"
                        onChange={(newValue) => {
                          setSelectedVendors(newValue);
                          field.onChange(newValue);
                        }}
                      />
                    </div>
                  )}
                />
                {errors.vendors && (
                  <p className="text-red-600 text-left">Vendors are required</p>
                )}

                <label htmlFor='tags' className='flex justify-start font-medium text-[#9F5216]'>Select Tag *</label>
                <Controller
                  name="tags"
                  control={control}
                  defaultValue={selectedTags}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="parent-container">
                      <ReactSelect
                        {...field}
                        options={tagList}
                        isMulti
                        className="w-full border rounded-md creatable-select-container"
                        value={selectedTags}
                        menuPortalTarget={menuPortalTarget}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        menuPlacement="auto"
                        onChange={(newValue) => {
                          setSelectedTags(newValue);
                          field.onChange(newValue);
                        }}
                      />
                    </div>
                  )}
                />
                {errors.tags && (
                  <p className="text-red-600 text-left">Tags are required</p>
                )}
              </div>

              <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
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
        <div className='px-6 flex justify-end items-center'>
          <button type='submit' className='mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2'>Next Step<FaArrowRight /></button>
        </div>
      </form>
    </div>
  );
};

export default FirstStepOfAddProduct;