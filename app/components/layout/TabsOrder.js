import React from 'react';

const TabsOrder = ({ tabs, selectedTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-3">
      {tabs?.map((tab) => (
        <button
          key={tab}
          className={`relative text-sm py-1 transition-all duration-300
            ${selectedTab === tab ? 'text-[#D2016E] font-semibold' : 'text-neutral-400 font-medium'}
            after:absolute after:left-0 after:right-0 after:bottom-0 
            after:h-[2px] after:bg-[#D2016E] hover:text-[#D2016E] after:transition-all after:duration-300
            ${selectedTab === tab ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
          `}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabsOrder;