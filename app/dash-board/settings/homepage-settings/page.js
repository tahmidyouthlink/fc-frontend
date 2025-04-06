"use client";
import React, { useEffect, useState } from 'react';
import TabsForSettings from '@/app/components/layout/TabsForSettings';
import CustomSwitch from '@/app/components/layout/CustomSwitch';
import { useForm } from 'react-hook-form';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { FiSave } from 'react-icons/fi';

const HomepageSettings = () => {

  const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();
  const [activeTab, setActiveTab] = useState('Top Header Settings');
  const tabs = ["Top Header Settings", "Low Stock Settings"];
  const [isTopHeaderEnabled, setIsTopHeaderEnabled] = useState(false); // Or false by default
  const [slideEnabled, setSlideEnabled] = useState(false);
  const axiosPublic = useAxiosPublic();

  // Ensure the code runs only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTabHomepageSettings');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Save the activeTab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTabHomepageSettings', activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchRefundPolicyDetails = async () => {
      try {
        const { data } = await axiosPublic.get(`/get-all-header-collection`);

        setValue('pageTitle', data?.pageTitle);
        setValue('refundPolicy', data?.refundAndPolicy);

      } catch (error) {
        toast.error("Failed to load refund policy details.");
      }
    };

    fetchRefundPolicyDetails();
  }, [setValue, axiosPublic]);

  const onSubmit = async (data) => {

    try {

      const topHeaderInformation = {
        isTopHeaderEnable: isTopHeaderEnabled,

      }

      const response = await axiosPublic.post('/add-top-header', topHeaderInformation);

      if (response.data.insertedId) {

        // ✅ Show success toast if the invitation is successfully sent
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
                    Invitation Sent Successfully!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {response?.data?.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        });
        reset();

      } else {

        // ⚠️ Handle the case where email sending failed but user data was inserted
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
          >
            <div className="pl-6">
              <RxCross2 className="h-6 w-6 bg-yellow-500 text-white rounded-full" />
            </div>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-gray-900">
                    Email Sending Failed
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    The user was added, but the invitation email could not be sent.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        });
      }

    } catch (error) {

      // ❌ Show error toast when something goes wrong
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="pl-6">
            <RxCross2 className="h-6 w-6 bg-red-500 text-white rounded-full" />
          </div>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900">
                  Invitation Failed!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {error.response?.data?.message || error?.response?.data?.error}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
            >
              <RxCross2 />
            </button>
          </div>
        </div>
      ), {
        position: "bottom-right",
        duration: 5000
      });

    }
  };

  return (
    <div className='bg-gray-50 min-h-screen relative px-6 md:px-10'>

      <div className="bg-gray-50 sticky top-0 z-10">

        <h1 className="font-bold text-lg md:text-xl lg:text-3xl text-neutral-700 py-1 2xl:py-3 bg-gray-50">HOMEPAGE SETTINGS</h1>

        <TabsForSettings tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>

      {activeTab === "Top Header Settings" &&
        <div className='pt-4 max-w-screen-md mx-auto pb-6'>

          <div className='flex flex-col mt-3'>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>

              <div className='w-full font-semibold flex items-center gap-4 mt-8'>
                <label>Enable Header</label>
                <CustomSwitch
                  checked={isTopHeaderEnabled}
                  onChange={() => setIsTopHeaderEnabled(prev => !prev)}
                  size="md"
                  color="primary"
                />
              </div>

              {isTopHeaderEnabled && (
                <div className='space-y-4'>
                  {/* Top Header Color */}
                  <div className="w-full font-semibold flex items-center gap-4">
                    <label htmlFor="topHeaderColor">Slide Background Color</label>
                    <input
                      type="color"
                      {...register(`topHeaderColor`, {
                        required: 'Color code is required',
                      })}
                      className=" p-0 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Slide Enable/Disable */}
                  <div className='w-full font-semibold flex items-center gap-4'>
                    <label>Enable Slide</label>
                    <CustomSwitch
                      checked={slideEnabled}
                      onChange={() => setSlideEnabled(prev => !prev)}
                      size="md"
                      color="primary"
                    />
                  </div>

                  {slideEnabled && (
                    <div className='space-y-4'>

                      {/* Slide Duration */}
                      <div>
                        <label htmlFor={`slideDuration`} className='font-medium text-[#9F5216]'>Slide Duration (seconds) *</label>
                        <input
                          id={`slideDuration`}
                          {...register(`slideDuration`, { required: true })}
                          placeholder={`Enter slide duration (seconds)`}
                          className="custom-number-input w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md mt-2"
                          type="number"
                        />
                        {errors.slideDuration?.type === "required" && (
                          <p className="text-red-600 text-left pt-2">Slide Duration is required</p>
                        )}
                      </div>

                      {/* Slide Text */}
                      <div className='flex flex-col gap-2'>
                        <label htmlFor='slideText' className='flex justify-start font-medium text-[#9F5216]'>Slide Text *</label>
                        <input id='slideText' {...register("slideText", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" placeholder='Enter slide text...' type="text" />
                        {errors.slideText?.type === "required" && (
                          <p className="text-red-600 text-left">Slide text is required</p>
                        )}
                      </div>

                      {/* Slide link */}
                      <div className='flex flex-col gap-2'>
                        <label htmlFor='optionalLink' className='flex justify-start font-medium text-[#9F5216]'>Optional Link</label>
                        <input id='optionalLink' {...register("optionalLink", { required: true })} className="w-full p-3 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md" placeholder='https://example.com' type="text" />
                      </div>

                      {/* Slide Text Color Selection */}
                      <div className="w-full font-semibold flex items-center gap-4">
                        <label htmlFor="textColor">Slide Text Color</label>
                        <input
                          type="color"
                          {...register(`textColor`, {
                            required: 'Color code is required',
                          })}
                          className=" p-0 border border-gray-300 rounded-md"
                        />
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className='w-full flex justify-end'>
                <button
                  type='submit'
                  className="!mt-7 w-fit rounded-lg bg-[#d4ffce] px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out"
                >
                  Save <FiSave size={19} />
                </button>
              </div>

            </form>
          </div>

        </div>
      }

      {activeTab === "Low Stock Settings" &&
        <div className='pt-4'>

        </div>
      }

    </div >
  );
};

export default HomepageSettings;