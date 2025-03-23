"use client";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import LegalPoliciesEditor from '@/app/utils/Editor/LegalPoliciesEditor';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import arrivals2 from "/public/card-images/arrivals2.svg";

const EditPrivacyPolicyPage = () => {

  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  const { handleSubmit, register, setValue, control, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchPrivacyPolicyDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/get-single-privacy-policy/${id}`);

        setValue('pageTitle', data?.pageTitle);
        setValue('privacyPolicy', data?.privacyAndPolicy);

      } catch (error) {
        toast.error("Failed to load privacy policy details.");
      }
    };

    fetchPrivacyPolicyDetails();
  }, [id, setValue, axiosPublic]);

  const onSubmit = async (data) => {

    try {
      const privacyPolicyData = {
        pageTitle: data?.pageTitle,
        privacyAndPolicy: data?.privacyPolicy,
      }

      const res = await axiosPublic.put(`/update-privacy-policies/${id}`, privacyPolicyData);

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
                    Privacy Policy updated!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Privacy Policy has been updated successfully!
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
        router.push("/dash-board/settings/privacy-policy");
      }

    } catch (error) {
      toast.error('Failed to update privacy policy. Please try again!');
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen relative px-6'>

      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat xl:left-[15%] 2xl:left-[30%] bg-[length:1600px_900px]'
      />

      <div
        style={{
          backgroundImage: `url(${arrivals2.src})`,
        }}
        className='absolute inset-0 z-0 bg-contain bg-center xl:-top-28 w-full bg-no-repeat'
      />

      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-16 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[50%] bg-no-repeat'
      />

      <div className='max-w-screen-2xl mx-auto py-3 md:py-6 relative'>
        <div className='flex items-center justify-between'>
          <h3 className='w-full font-semibold text-xl lg:text-2xl'>Edit Privacy Policy</h3>
          <Link className='flex items-center gap-2 text-[10px] md:text-base justify-end w-full' href={"/dash-board/settings/privacy-policy"}> <span className='border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2'><FaArrowLeft /></span> Go Back</Link>
        </div>
      </div>

      <form className='2xl:max-w-screen-2xl 2xl:mx-auto relative flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>

        <div className="w-full space-y-2 bg-gray-50">
          <label htmlFor="pageTitle" className='text-[#9F5216]'>Page Title *</label>
          <input
            id="pageTitle"
            type="text"
            placeholder="Enter page title"
            {...register("pageTitle", {
              required: {
                value: true,
                message: "Page Title is required.",
              },
            })}
            className="h-11 w-full font-semibold rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
            required
          />
          {/* Email Error Message */}
          {errors.pageTitle && (
            <p className="text-xs font-semibold text-red-500">
              {errors.pageTitle?.message}
            </p>
          )}
        </div>

        <div className='flex flex-col gap-4 bg-gray-50 rounded-lg h-fit'>
          <label htmlFor='privacyPolicy' className='flex justify-start font-medium text-[#9F5216]'>
            Details About Privacy Policy *
          </label>
          <Controller
            name="privacyPolicy"
            defaultValue=""
            rules={{ required: true }}
            control={control}
            render={({ field }) => <LegalPoliciesEditor
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
            />}
          />
          {errors.privacyPolicy?.type === "required" && (
            <p className="text-red-600 text-left pt-1">Privacy Policy is required</ p>
          )}
        </div>

        <div className='flex justify-end w-full py-8'>
          <button type="submit" className='relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#d4ffce] px-[16px] py-3 transition-[background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] font-bold text-[14px] text-neutral-700'>
            Submit <FiSave size={19} />
          </button>
        </div>

      </form>

    </div>
  );
};

export default EditPrivacyPolicyPage;