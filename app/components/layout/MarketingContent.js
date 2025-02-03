import React, { useEffect, useState } from 'react';
import MarketingBanner from './MarketingBanner';
import LoginRegisterSlides from './LoginRegisterSlides';

const MarketingContent = () => {

  const [activeTab, setActiveTab] = useState('marketing banner');

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

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 bg-white">

        <button
          className={`relative text-sm py-1 transition-all duration-300
${activeTab === 'marketing banner' ? 'text-green-600 font-semibold' : 'text-neutral-400 font-medium'}
after:absolute after:left-0 after:right-0 hover:text-green-600 after:bottom-0 
after:h-[2px] after:bg-green-600 after:transition-all after:duration-300
${activeTab === 'marketing banner' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
`}
          onClick={() => setActiveTab('marketing banner')}
        >
          Marketing banner
        </button>

        <button
          className={`relative text-sm py-1 transition-all duration-300
${activeTab === 'login/register slides' ? 'text-green-600 font-semibold' : 'text-neutral-400 font-medium'}
after:absolute after:left-0 after:right-0 after:bottom-0 
after:h-[2px] after:bg-green-600 hover:text-green-600 after:transition-all after:duration-300
${activeTab === 'login/register slides' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
`}
          onClick={() => setActiveTab('login/register slides')}
        >
          Login/Register slides
        </button>

      </div>

      {activeTab === "marketing banner" && <div>
        <MarketingBanner />
      </div>}

      {activeTab === "login/register slides" && <div>
        <LoginRegisterSlides />
      </div>}

    </div>
  );
};

export default MarketingContent;