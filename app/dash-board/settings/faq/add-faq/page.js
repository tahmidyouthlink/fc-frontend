"use client";
import Link from 'next/link';
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FaArrowLeft, FaPlus } from 'react-icons/fa6';
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import arrivals2 from "/public/card-images/arrivals2.svg";
import LegalPoliciesEditor from '@/app/utils/Editor/LegalPoliciesEditor';
import { FiSave } from 'react-icons/fi';
import { Button } from '@nextui-org/react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import useFAQ from '@/app/hooks/useFAQ';
import Loading from '@/app/components/shared/Loading/Loading';
import { useRouter } from 'next/navigation';

const AddFAQPage = () => {

  const { register, control, handleSubmit, reset, formState: { errors }, } = useForm({
    defaultValues: { faqs: [{ question: "", answer: "" }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "faqs" });
  const axiosPublic = useAxiosPublic();
  const [faqList, isFAQPending] = useFAQ();
  const router = useRouter();

  if (isFAQPending) return <Loading />;

  const onSubmit = async (data) => {

    try {

      // Filter out empty FAQs
      const validFaqs = data.faqs.filter(faq => faq.question.trim() !== "" && faq.answer.trim() !== "");

      if (validFaqs.length === 0) {
        toast.error("Please add at least one FAQ before submitting");
        return;
      }

      const faqData = {
        pageTitle: data?.pageTitle,
        faqDescription: data?.faqDescription,
        faqs: data?.faqs
      }

      if (faqList?.length > 0) {
        toast.error("You cannot add faqs, you can edit previous one.")
        return;
      }

      const res = await axiosPublic.post(`/add-faq`, faqData);
      if (res.data.insertedId) {
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
                    FAQ Added!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    FAQ has been added successfully!
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
        reset();
        router.push("/dash-board/settings/faq");
      }

    }
    catch (error) {
      toast.error('Failed to add faqs. Please try again!');
    }

  };

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

      <div className='max-w-screen-2xl mx-auto py-3 md:py-6 sticky top-0 z-10 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <h3 className='flex-1 font-semibold text-base md:text-xl lg:text-3xl text-neutral-700'>FAQ CONFIGURATION</h3>

          <Link // Trigger the modal on click
            className="flex items-center gap-2 text-[10px] md:text-base justify-end"
            href="/dash-board/settings/faq">
            <span className="border border-black hover:scale-105 duration-300 rounded-full p-1 md:p-2">
              <FaArrowLeft />
            </span>
            Go Back
          </Link>

        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="2xl:max-w-screen-2xl 2xl:mx-auto relative flex flex-col gap-8">

        <div className="relative w-full space-y-3">
          <label htmlFor="pageTitle" className="text-[#9F5216]">Page Title *</label>
          <input
            id="pageTitle"
            type="text"
            className="h-11 w-full font-semibold rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
            placeholder="Enter page title"
            {...register("pageTitle", {
              required: {
                value: true,
                message: "Page Title is required.",
              },
              minLength: {
                value: 6,
                message: "Page Title must be at least 6 characters.",
              },
              maxLength: {
                value: 70,
                message: "Page Title cannot exceed 70 characters.",
              },
            })}
          />
          {errors.pageTitle && (
            <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
              {errors.pageTitle?.message}
            </p>
          )}
        </div>

        <div className='flex flex-col gap-4 bg-gray-50 rounded-lg h-fit'>
          <label htmlFor='faqDescription' className='flex justify-start font-medium text-[#9F5216]'>
            Details About FAQ *
          </label>
          <Controller
            name="faqDescription"
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
          {errors.faqDescription?.type === "required" && (
            <p className="text-red-600 text-left pt-1">FAQ Description is required</ p>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 w-full'>
          {fields.map((faq, index) => (

            <div key={faq.id} className="bg-gray-50 p-4 lg:p-8 border rounded-lg space-y-5">

              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full border-b-2 border-neutral-300 bg-transparent py-2 text-neutral-800 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-neutral-400 text-sm"
                  placeholder="Enter question"
                  {...register(`faqs.${index}.question`, {
                    required: {
                      value: true,
                      message: "Question is required.",
                    },
                    minLength: {
                      value: 5,
                      message: "Question must have at least 5 characters.",
                    },
                  })}
                />
                {errors.faqs?.[index]?.question && (
                  <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
                    {errors.faqs[index].question.message}
                  </p>
                )}
              </div>

              <div className="relative w-full">
                <textarea
                  rows={3}
                  className="w-full resize-none border-b-2 border-neutral-300 bg-transparent py-2 text-neutral-800 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-neutral-400 font-medium text-sm"
                  placeholder="Enter answer"
                  {...register(`faqs.${index}.answer`, {
                    required: "Answer is required.",
                    minLength: {
                      value: 10,
                      message: "Answer must have at least 10 characters.",
                    },
                  })}
                />
                {errors.faqs?.[index]?.answer && (
                  <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
                    {errors.faqs[index].answer.message}
                  </p>
                )}
              </div>

              <Button type="button" color="danger" variant='light' onClick={() => remove(index)}>Remove</Button>

            </div>

          ))}
        </div>

        <div className='flex justify-start'>
          <button type="button" onClick={() => append({ question: "", answer: "" })} className='relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[14px] text-neutral-700'>
            Add FAQ<FaPlus size={16} />
          </button>
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

export default AddFAQPage;