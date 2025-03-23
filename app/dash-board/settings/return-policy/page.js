"use client";
import useReturnPolicy from '@/app/hooks/useReturnPolicy';
import MarkdownRenderer from '@/app/utils/Markdown/MarkdownRenderer';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';

const ReturnPolicyPage = () => {

  const router = useRouter();
  const [returnPolicyList] = useReturnPolicy();

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div className='px-6 max-w-screen-2xl mx-auto'>

        <div className='sticky top-0 z-10 bg-gray-50 flex items-center justify-between py-6'>

          <h1 className='font-semibold text-center text-lg md:text-xl lg:text-3xl text-neutral-700'>RETURN POLICY MANAGEMENT</h1>

          {returnPolicyList?.length > 0 ? (
            returnPolicyList.map((item) => (
              <button key={item._id} onClick={() => router.push(`/dash-board/settings/return-policy/${item._id}`)}>
                <span className='flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-md:[&_p]:hidden max-md:[&_svg]:size-4'>
                  <AiOutlineEdit size={16} /> Edit
                </span>
              </button>
            ))
          ) : (
            <button onClick={() => router.push('/dash-board/settings/return-policy/add-return-policy')} className="relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[14px] text-neutral-700">
              <FaPlus size={15} className='text-neutral-700' /> Add
            </button>
          )}

        </div>

        <div>
          {returnPolicyList?.map((policy) => (
            <div key={policy?._id}>
              <p className="py-6">
                <h1 className='text-2xl pb-2'>{policy?.pageTitle}</h1>
                <MarkdownRenderer content={policy?.returnAndPolicy} />
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default ReturnPolicyPage;