"use client";
import { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import logoWhiteImage from "@/public/logos/logo.png";
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

  useEffect(() => {
    if (isToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isToggle]);

  return (
    <div>
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4">
        <button className="lg:hidden duration-300 p-2" onClick={() => setIsToggle(!isToggle)}>
          {!isToggle && <CgMenuLeft size={20} />}
        </button>
        <div className="w-full flex justify-center lg:hidden">
          <Link href="/" legacyBehavior>
            <a className="flex items-center gap-2 py-3">
              <Image className="h-7 lg:h-10 w-auto" src={logoWhiteImage} alt="F-Commerce logo" />
            </a>
          </Link>
        </div>
      </div>

      {/* Sidebar - only visible when toggled on small screens */}
      {isToggle && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 bg-black opacity-30 lg:hidden" onClick={handleClose}></div>

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 h-full bg-white shadow-lg transition-transform transform lg:hidden"
            style={{ transform: isToggle ? "translateX(0)" : "translateX(-100%)" }}>
            <SideNavbar onClose={handleClose} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardNavbar;