"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import PersonalInfo from "@/app/components/user/profile/PersonalInfo";
import DeliveryAddresses from "@/app/components/user/profile/DeliveryAddresses";

export default function Profile() {
  const { userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();

  useEffect(() => setIsPageLoading(!userData), [setIsPageLoading, userData]);

  return (
    <div className="user-info min-h-full grow space-y-4 rounded-md border-2 border-neutral-50/20 bg-white/40 p-3.5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl lg:p-5 [&_input]:text-sm [&_label]:text-sm [&_label]:text-neutral-500">
      <PersonalInfo
        userData={userData}
        setUserData={setUserData}
        personalInfo={userData?.userInfo?.personalInfo}
      />
      <DeliveryAddresses
        userData={userData}
        setUserData={setUserData}
        deliveryAddresses={userData?.userInfo?.deliveryAddresses}
      />
    </div>
  );
}
