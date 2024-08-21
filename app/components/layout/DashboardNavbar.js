"use client";
import { useEffect, useState } from "react";
import { CgMenuRight } from "react-icons/cg";
import logoWhiteImage from "@/public/logos/fc-logo.png";
import SideNavbar from "./SideNavbar";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DashboardNavbar = () => {
  const [isToggle, setIsToggle] = useState(false);
  const router = useRouter();

  const handleClose = () => setIsToggle(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsToggle(false);
    };

    router?.events?.on("routeChangeStart", handleRouteChange);
    return () => {
      router?.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router?.events]);

  return (
    <div>
      {/* Sidebar - hide from medium devices */}
      <div className="flex items-center justify-between px-4">
        <div className="md:hidden">
          <Link href="/" legacyBehavior>
            <a className="flex items-center gap-2">
              <Image
                className="h-[14px] md:h-6 w-auto"
                src={logoWhiteImage}
                alt="F-Commerce logo"
              />
              <h1 className="text-xs md:text-lg">F-Commerce</h1>
            </a>
          </Link>
        </div>
        <button className="md:hidden duration-300 p-2" onClick={() => setIsToggle(!isToggle)}>
          {isToggle ? null : <CgMenuRight size={20} />}
        </button>
        {/* Overlay */}
        {isToggle && (
          <div className="fixed inset-0 z-40 bg-white opacity-100 md:hidden" onClick={handleClose}></div>
        )}
      </div>
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ${isToggle ? "block" : "hidden"} flex-col w-full h-full md:hidden bg-gradient-to-t from-[#9f511655] to-[#9f511616]`}>
        <SideNavbar onClose={handleClose} />
      </div>
    </div>
  );
};

export default DashboardNavbar;