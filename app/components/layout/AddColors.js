"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';

const AddColors = () => {
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      colors: [{ colorName: '', colorCode: '#FFFFFF', colorFormat: 'Hex' }]
    }
  });

  // UseFieldArray for handling multiple colors
  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: 'colors'
  });

  const onSubmit = async (data) => {
    const colorData = data.colors.map(color => ({
      value: color.colorName,
      label: color.colorName,
      color: color.colorCode
    }));


    try {
      const response = await axiosPublic.post('/addColor', colorData);
      if (response.status === 201) {
        toast.success('Colors added successfully!');
        reset();
      }
    } catch (error) {
      toast.error('Failed to add colors. Please try again!');
    }
  };

  return (
    <div>
      <h3 className='text-center font-semibold text-xl md:text-2xl px-6 pt-6'>Add Colors</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="color-field w-full">
          <label className="flex justify-start font-medium text-[#9F5216]">Colors</label>
          {colorFields.map((item, index) => (
            <div key={item.id} className="flex flex-col mb-4">
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  {...register(`colors.${index}.colorCode`, {
                    required: 'Color code is required',
                    validate: value => value !== '#FFFFFF' || 'Please select a color other than the default white'
                  })}
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
              {errors.colors?.[index]?.colorCode && (
                <p className="text-red-600 text-left">{errors.colors[index].colorCode.message}</p>
              )}
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
        <div className='px-6 flex justify-end items-center'>
          <button type='submit' className='mt-4 mb-8 bg-[#9F5216] hover:bg-[#9f5116c9] text-white py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium flex items-center gap-2'>Submit Colors</button>
        </div>
      </form>
    </div>
  );
};

export default AddColors;
