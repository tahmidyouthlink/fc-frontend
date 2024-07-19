"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import toast from 'react-hot-toast';
import CreatableSelect from "react-select/creatable";
import ColorOption from '@/app/components/layout/ColorOption';
import colorOptions from '@/app/components/layout/colorOptions';
import sizeOptions from '@/app/components/layout/sizeOptions';
import productCategoriesOptions from '@/app/components/layout/productCategoriesOptions';
import { CheckboxGroup, Select, SelectItem } from "@nextui-org/react";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { CustomCheckbox } from '@/app/components/layout/CustomCheckBox';
import { Tabs, Tab } from "@nextui-org/react";
import { subCategories } from '@/app/components/layout/subCategories';
import sizeOptions2 from '@/app/components/layout/sizeOptions2';
import { CustomCheckbox2 } from '@/app/components/layout/CustomCheckBox2';

const Editor = dynamic(() => import('@/app/utils/Markdown/Editor'), { ssr: false });
const apiKey = "bcc91618311b97a1be1dd7020d5af85f";
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

const AddProduct = () => {

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [groupSelected, setGroupSelected] = React.useState([]);
  const [groupSelected2, setGroupSelected2] = React.useState([]);
  const [sizeError, setSizeError] = useState(false);
  const [selected, setSelected] = React.useState("Percent");
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [values, setValues] = React.useState(new Set([]));

  console.log(groupSelected);

  useEffect(() => {
    setGroupSelected([]);
    setGroupSelected2([]);
    if (typeof document !== 'undefined') {
      setMenuPortalTarget(document?.body);
    }
  }, [selectedCategory]);

  useEffect(() => {
    reset({ percentage: '', flat: '' });
  }, [selected, reset]);

  const onSubmit = async (data) => {
    try {
      if (groupSelected.length === 0) {
        setSizeError(true);
        return;
      }
      setSizeError(false);
      const productTitle = data.productTitle;
      const discountType = selected;
      const regularPrice = parseFloat(data.regularPrice) || 0;
      const flatDiscount = parseFloat(data.flat) || 0;
      const discountPercentage = parseFloat(data.percentage) || 0;

      const photos = data.photos;
      const imageUrls = [];
      for (let i = 0; i < photos.length; i++) {
        const formData = new FormData();
        formData.append('image', photos[i]);
        const uploadImage = await axiosPublic.post(apiURL, formData, {
          headers: {
            "content-type": "multipart/form-data",
          }
        });
        const imageURL = uploadImage?.data?.data?.display_url;
        imageUrls.push(imageURL);
      }


      const availableColors = data?.availableColors?.map(color => ({
        value: color.value,
        color: color.color
      }));
      const category = data.category;
      const currentDate = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = currentDate.toLocaleDateString('en-US', options);
      const newArrival = data.newArrival;
      const productDetails = data.productDetails;
      const materialCare = data.materialCare;
      const sizeFit = data.sizeFit;
      const productInfo = { productTitle, discountType, regularPrice, flatDiscount, discountPercentage, availableColors, formattedDate, newArrival, sizes: groupSelected, formattedDate, category, productDetails, materialCare, sizeFit, imageUrls };
      // const res = await axiosPublic.post("/addProduct", productInfo);
      console.log(productInfo);
      // if (res?.data?.insertedId) {
      //   reset();
      //   toast.success("Your product successfully published");
      // }
    } catch (err) {
      toast.error("Failed to publish your work");
    }
  };

  return (
    <div className='bg-gray-50'>
      <div className='pt-20 lg:pt-[60px] xl:pt-20 max-w-screen-md mx-auto'>
        <h3 className='font-semibold text-2xl md:text-3xl px-6 pt-6'>Add Product</h3>
        <form className='flex flex-col gap-8 mx-auto mt-6 px-6 py-3' onSubmit={handleSubmit(onSubmit)}>
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
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <Editor value={field.value} onChange={field.onChange} />}
            />
          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            <label htmlFor='photos' className='flex justify-start font-medium text-[#9F5216]'>Upload Media *</label>
            <input {...register("photos", { required: true })} className="file-input file-input-bordered w-full" id='photos' type="file" multiple />
            {errors.photos?.type === "required" && (
              <p className="text-red-600 text-left pt-1">Photos are required.</p>
            )}
          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            <label htmlFor='regularPrice' className='flex justify-start font-medium text-[#9F5216] mt-4'>Regular Price ৳ *</label>
            <input id='regularPrice' {...register("regularPrice", { required: true })} className="w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000" type="number" />
            {errors.regularPrice?.type === "required" && (
              <p className="text-red-600 text-left">Product Price is required</p>
            )}

            <div className="flex w-full flex-col">
              <Tabs
                aria-label="Options"
                selectedKey={selected}
                onSelectionChange={setSelected}
              >
                <Tab key="percentage" title="Percent">
                  <input id='percentage' {...register("percentage")} className="w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000" type="number" />
                </Tab>
                <Tab key="flat" title="Flat">
                  <input id='flat' {...register("flat")} className="w-full p-3 border rounded-md border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000" type="number" />
                </Tab>
              </Tabs>
            </div>
          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>

            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <div>
                  <Select
                    label="Category"
                    placeholder="Select a category"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedCategory(e.target.value);
                    }}
                  >
                    {productCategoriesOptions?.map((category) => (
                      <SelectItem key={category.key} value={category.label}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <p className="text-red-600 text-left">Category is required</p>
                  )}
                </div>
              )}
            />

            {selectedCategory && (
              <div className="flex flex-col gap-1 w-full">
                <CheckboxGroup
                  className="gap-1"
                  label="Select size"
                  orientation="horizontal"
                  value={groupSelected}
                  onChange={(sizes) => {
                    setGroupSelected(sizes);
                    if (sizes.length > 0) {
                      setSizeError(false);
                    }
                  }}
                >
                  {sizeOptions[selectedCategory]?.map((size) => (
                    <CustomCheckbox key={size} value={size}>{size}</CustomCheckbox>
                  ))}
                </CheckboxGroup>
                {sizeError && (
                  <p className="text-red-600 text-left">Please select at least one size.</p>
                )}
              </div>
            )}

            {groupSelected.length > 0 && (
              <div className="flex flex-col gap-1 w-full">
                <CheckboxGroup
                  className="gap-1"
                  label="Unselect sizes"
                  orientation="horizontal"
                  value={groupSelected2}
                  onChange={(sizes) => {
                    setGroupSelected2(sizes);
                    if (sizes.length > 0) {
                      setSizeError(false);
                    }
                  }}
                >
                  {sizeOptions2[groupSelected]?.map((size) => (
                    <CustomCheckbox2 key={size} value={size}>{size}</CustomCheckbox2>
                  ))}
                </CheckboxGroup>
                <p className="mt-4 ml-1 text-default-500">
                  Selected: {groupSelected2.join(", ")}
                </p>
                {sizeError && (
                  <p className="text-red-600 text-left">Please select at least one size.</p>
                )}
              </div>
            )}

            {groupSelected2.length > 0 && (
              <div className="flex w-full flex-col gap-2">
                <Select
                  label="Sub-Categories"
                  selectionMode="multiple"
                  placeholder="Select Sub-Categories"
                  selectedKeys={values}
                  className=""
                  onSelectionChange={setValues}
                >
                  {subCategories.map((animal) => (
                    <SelectItem key={animal.key}>
                      {animal.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}

            <label htmlFor='availableColors' className='flex justify-start font-medium text-[#9F5216]'>Select Available Colors *</label>
            <Controller
              name="availableColors"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="parent-container">
                  <CreatableSelect
                    {...field}
                    options={colorOptions}
                    isMulti
                    className="w-full border rounded-md creatable-select-container"
                    components={{ Option: ColorOption }}
                    menuPortalTarget={menuPortalTarget}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    menuPlacement="auto"
                  />
                </div>
              )}
            />

            {errors.availableColors && (
              <p className="text-red-600 text-left">Colors are required</p>
            )}

            <div className="my-4">
              <label className="flex justify-start font-medium text-[#9F5216] py-1">New Arrival *</label>
              <div className="flex">
                <label className="mr-4">
                  <input type="radio" value="yes" {...register("newArrival", { required: true })} className="mr-2" />Yes
                </label>
                <label>
                  <input type="radio" value="no" {...register("newArrival", { required: true })} className="mr-2" /> No
                </label>
              </div>
              {errors.newArrival && (
                <p className="text-red-600 text-left">New Arrival Selection is required</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-4 bg-[#ffffff] drop-shadow p-5 md:p-7 rounded-lg'>
            <label htmlFor='materialCare' className='flex justify-start font-medium text-[#9F5216]'>Material Care</label>
            <Controller
              name="materialCare"
              control={control}
              defaultValue=""
              render={({ field }) => <Editor value={field.value} onChange={field.onChange} />}
            />

            <label htmlFor='sizeFit' className='flex justify-start font-medium text-[#9F5216]'>Size Fit</label>
            <Controller
              name="sizeFit"
              control={control}
              defaultValue=""
              render={({ field }) => <Editor value={field.value} onChange={field.onChange} />}
            />
          </div>

          <input type='submit' className='mt-4 mb-8 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer' value='Submit' />
        </form>
      </div>
    </div>
  );
};

export default AddProduct;