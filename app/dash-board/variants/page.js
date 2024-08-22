"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { Button } from '@nextui-org/react';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Variants = () => {

  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      vendor: [],
      tag: [],
      colors: [{ colorName: '', colorCode: '#FFFFFF', colorFormat: 'Hex' }]
    }
  });

  // Separate useFieldArray for vendors
  const { fields: vendorFields, append: appendVendor, remove: removeVendor } = useFieldArray({
    control,
    name: 'vendor'
  });

  // Separate useFieldArray for tags
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tag'
  });

  // UseFieldArray for handling multiple colors
  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: 'colors'
  });

  const onSubmit = async (data) => {
    const { vendor, tag, colors } = data;

    const vendorData = vendor.map(vn => ({
      value: vn.vendor,
      label: vn.vendor
    }));

    const tagData = tag.map(tg => ({
      value: tg.tag,
      label: tg.tag
    }));

    // Transform data into the required format
    const colorData = colors.map(color => ({
      value: color.colorName,
      label: color.colorName,
      color: color.colorCode
    }));

    try {
      const response = await axiosPublic.post('/addVendor', vendorData, tagData, colorData);

      if (response.status === 201) {
        toast.success('Vendor added successfully!');
        reset(); // Reset the form after successful submission
      }
    } catch (error) {
      toast.error('Failed to add vendor. Please try again.');
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Colors, Vendor, and Tags</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='max-w-screen-lg mx-auto p-6 flex flex-col gap-4'>

          <div className="color-field w-full">
            <label className="flex justify-start font-medium text-[#9F5216]">Colors</label>
            {colorFields.map((item, index) => (
              <div key={item.id} className="flex flex-col mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    {...register(`colors.${index}.colorCode`, { required: 'Color code is required' })}
                    className="w-16 h-16 p-0 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter color name"
                    {...register(`colors.${index}.colorName`, { required: 'Color name is required' })}
                    className="p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md w-full"
                  />
                  <Button type="button" color="danger" onClick={() => removeColor(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.colors?.[index]?.colorName && (
                  <p className="text-red-600 text-left">{errors.colors[index].colorName.message}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendColor({ colorName: '', colorCode: '#FFFFFF' })}
              className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2"
            >
              Add Color
            </button>
          </div>

          <div className="vendor-field w-full">
            <label className="flex justify-start font-medium text-[#9F5216]">Vendor</label>
            {vendorFields?.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                <div className='w-full flex items-center gap-2'>
                  <input
                    type="text"
                    placeholder="Add Vendor"
                    {...register(`vendor.${index}.vendor`, { required: 'Vendor is required' })}
                    className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                  />
                  <Button type='button' color="danger" onClick={() => removeVendor(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.vendor?.[index]?.vendor && (
                  <p className="text-red-600 text-left">{errors.vendor[index].vendor.message}</p>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendVendor({ vendor: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
              Add Vendor
            </button>
          </div>

          <div className="tag-field w-full">
            <label className="flex justify-start font-medium text-[#9F5216]">Tag</label>
            {tagFields?.map((item, index) => (
              <div key={item.id} className="flex flex-col">
                <div className='w-full flex items-center gap-2'>
                  <input
                    type="text"
                    placeholder="Add Tag"
                    {...register(`tag.${index}.tag`, { required: 'Tag is required' })}
                    className="w-full my-2 p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md"
                  />
                  <Button type='button' color="danger" onClick={() => removeTag(index)} variant="light">
                    Remove
                  </Button>
                </div>
                {errors.tag?.[index]?.tag && (
                  <p className="text-red-600 text-left">{errors.tag[index].tag.message}</p>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendTag({ tag: '' })} className="mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2">
              Add Tag
            </button>
          </div>

          <div className='px-6 flex justify-end items-center'>
            <button type='submit' className='mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2'>Submit</button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Variants;