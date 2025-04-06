"use client";
import { useAuth } from '@/app/contexts/auth';
import React, { useEffect, useState } from 'react';
import Loading from '../shared/Loading/Loading';

const TabsForOrderManagement = ({ tabs, selectedTab, onTabChange }) => {

  const { existingUserData, isUserLoading } = useAuth();

  const [permissions, setPermissions] = useState({
    'New Orders': false,
    'Active Orders': false,
    'Completed Orders': false,
    'Returns & Refunds': false,
  });

  useEffect(() => {
    if (existingUserData) {
      setPermissions({
        'New Orders': existingUserData?.permissions?.["Orders"]?.actions?.['New Orders'] ?? false,
        'Active Orders': existingUserData?.permissions?.["Orders"]?.actions?.['Active Orders'] ?? false,
        'Completed Orders': existingUserData?.permissions?.["Orders"]?.actions?.['Completed Orders'] ?? false,
        'Returns & Refunds': existingUserData?.permissions?.["Orders"]?.actions?.['Returns & Refunds'] ?? false,
      });
    }
  }, [existingUserData]);

  // ✅ **Filter tabs based on permissions**
  const filteredTabs = tabs?.filter((tabLabel) => {
    const tabName = tabLabel.split(" (")[0]; // Extract tab name
    return permissions[tabName]; // Show only if permission is `true`
  });

  if (isUserLoading) return <Loading />;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filteredTabs?.map((tab) => (
        <button
          key={tab}
          className={`relative text-sm py-1 transition-all duration-300
            ${selectedTab === tab ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-medium'}
            after:absolute after:left-0 after:right-0 after:bottom-0 
            after:h-[2px] after:bg-neutral-800 hover:text-neutral-800 after:transition-all after:duration-300
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

export default TabsForOrderManagement;