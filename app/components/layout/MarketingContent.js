import React, { useEffect, useState } from 'react';
import MarketingBanner from './MarketingBanner';
import LoginRegisterSlides from './LoginRegisterSlides';
import { useAuth } from '@/app/contexts/auth';
import Loading from '../shared/Loading/Loading';

const MarketingContent = () => {

  const [activeTab, setActiveTab] = useState('marketing banner');
  const { existingUserData, isUserLoading } = useAuth();
  const [isMarketingContentAllowed, setIsMarketingContentAllowed] = useState(false);

  useEffect(() => {
    // Fetch user data if needed or check the permission dynamically
    if (existingUserData) {

      // Check if the user has permission to add a product
      setIsMarketingContentAllowed(existingUserData?.permissions?.["Marketing"]?.actions?.['Marketing Content'] ?? false);

    }
  }, [existingUserData]);

  // Ensure the code runs only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeMarketingContentTab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Save the activeTab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMarketingContentTab', activeTab);
    }
  }, [activeTab]);

  if (isUserLoading) return <Loading />

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 bg-gray-50">

        {isMarketingContentAllowed ? (
          <button
            className={`relative text-sm py-1 transition-all duration-300
${activeTab === 'marketing banner' ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-medium'}
after:absolute after:left-0 after:right-0 hover:text-neutral-800 after:bottom-0 
after:h-[2px] after:bg-neutral-800 after:transition-all after:duration-300
${activeTab === 'marketing banner' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
`}
            onClick={() => setActiveTab('marketing banner')}
          >
            Marketing banner
          </button>
        ) : (
          <></>
        )}

        {isMarketingContentAllowed ? (
          <button
            className={`relative text-sm py-1 transition-all duration-300
${activeTab === 'login/register slides' ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-medium'}
after:absolute after:left-0 after:right-0 after:bottom-0 
after:h-[2px] after:bg-neutral-800 hover:text-neutral-800 after:transition-all after:duration-300
${activeTab === 'login/register slides' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
`}
            onClick={() => setActiveTab('login/register slides')}
          >
            Login/Register slides
          </button>
        ) : (
          <></>
        )}

      </div>

      {isMarketingContentAllowed && activeTab === "marketing banner" && <div>
        <MarketingBanner />
      </div>}

      {isMarketingContentAllowed && activeTab === "login/register slides" && <div>
        <LoginRegisterSlides />
      </div>}

    </div>
  );
};

export default MarketingContent;