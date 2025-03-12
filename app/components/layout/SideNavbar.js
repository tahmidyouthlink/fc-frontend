"use client";
import { FaBullhorn, FaGlobeAsia } from "react-icons/fa";
import { PiUsersThreeLight, PiBookOpen } from "react-icons/pi";
import { BiCategory, BiPurchaseTagAlt, BiTransferAlt } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { MdPayment, MdOutlineLocationOn, MdOutlineInventory2, MdOutlinePrivacyTip, MdOutlineLocalShipping } from "react-icons/md";
import { RiContractLine } from "react-icons/ri";
import { TbBrandGoogleAnalytics, TbMessageCircleQuestion, TbClipboardList, TbBuildingBank } from "react-icons/tb";
import Image from "next/image";
import logoWhiteImage from "/public/logos/logo.png";
import { FaChevronRight, FaAngleDown } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LiaUsersCogSolid } from "react-icons/lia";
import { IoColorPaletteOutline, IoSettingsOutline } from "react-icons/io5";
import { LuWarehouse, LuNewspaper } from "react-icons/lu";
import { BsTags } from "react-icons/bs";
import { CiMedal, CiDeliveryTruck } from "react-icons/ci";
import { FiShoppingBag, FiBox } from "react-icons/fi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { IoIosReturnLeft } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useAuth } from "@/app/contexts/auth";
import Loading from "../shared/Loading/Loading";

const SideNavbar = ({ onClose }) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);  // State for submenu
  const { data: session } = useSession();
  const { existingUserData, isUserLoading } = useAuth();
  const permissions = existingUserData?.permissions;

  // Show loading state if data is not loaded yet
  if (isUserLoading || !existingUserData) {
    return <Loading />; // Or you can use any other custom loading spinner
  }

  const handleItemClick = (name) => {
    setActiveItem(activeItem === name ? null : name);
  };

  const handleSubItemClick = (subName) => {
    setActiveSubItem(activeSubItem === subName ? null : subName);
  };

  const allList = [
    {
      name: "Dashboard",
      icon: <RxDashboard />,
      path: "/dash-board",
      permission: permissions["Dashboard"]?.access,
    },
    {
      name: "Orders",
      icon: <TbClipboardList />,
      path: "/dash-board/orders",
      permission: permissions["Orders"]?.access
    },
    {
      name: "Product Hub",
      icon: <FiBox />,
      permission: permissions["Products"]?.access ||
        permissions["Manage Inventory"]?.access ||
        permissions["Purchase Orders"]?.access ||
        permissions["Transfers"]?.access ||
        permissions["Categories"]?.access ||
        permissions["Seasons"]?.access ||
        permissions["Colors"]?.access ||
        permissions["Vendors"]?.access ||
        permissions["Tags"]?.access, // If any child has access, show "Product Hub",
      links: [
        {
          label: "Products",
          link: "/dash-board/products",
          icon: <FiShoppingBag />,
          permission: permissions["Products"]?.access,
        },
        {
          label: "Manage Inventory",
          link: "/dash-board/inventory",
          icon: <MdOutlineInventory2 />,
          permission: permissions["Manage Inventory"]?.access,
        },
        {
          label: "Purchase Orders",
          link: "/dash-board/purchase-orders",
          icon: <BiPurchaseTagAlt />,
          permission: permissions["Purchase Orders"]?.access,
        },
        {
          label: "Transfers",
          link: "/dash-board/transfers",
          icon: <BiTransferAlt />,
          permission: permissions["Transfers"]?.access,
        },
        {
          name: "Product Settings",
          icon: <IoSettingsOutline />,
          permission: permissions["Categories"]?.access ||
            permissions["Seasons"]?.access ||
            permissions["Colors"]?.access ||
            permissions["Vendors"]?.access ||
            permissions["Tags"]?.access, // If any sub-item has access, show "Product Settings"
          links: [
            {
              label: "Categories",
              link: "/dash-board/categories",
              icon: <BiCategory />,
              permission: permissions["Categories"]?.access,
            },
            {
              label: "Seasons",
              link: "/dash-board/seasons",
              icon: <FaGlobeAsia />,
              permission: permissions["Seasons"]?.access,
            },
            {
              label: "Colors",
              link: "/dash-board/colors",
              icon: <IoColorPaletteOutline />,
              permission: permissions["Colors"]?.access,
            },
            {
              label: "Vendors",
              link: "/dash-board/vendors",
              icon: <LuWarehouse />,
              permission: permissions["Vendors"]?.access,
            },
            {
              label: "Tags",
              link: "/dash-board/tags",
              icon: <BsTags />,
              permission: permissions["Tags"]?.access,
            },
          ],
        },
      ],
    },
    {
      name: "Customers",
      icon: <PiUsersThreeLight />,
      path: "/dash-board/customers",
      permission: permissions["Customers"]?.access
    },
    {
      name: "Finances",
      icon: <TbBuildingBank />,
      path: "/dash-board/finances",
      permission: permissions["Finances"]?.access
    },
    {
      name: "Analytics",
      icon: <TbBrandGoogleAnalytics />,
      path: "/dash-board/analytics",
      permission: permissions["Analytics"]?.access,
    },
    {
      name: "Marketing",
      icon: <FaBullhorn />,
      path: "/dash-board/marketing",
      permission: permissions["Marketing"]?.access
    },
    {
      name: "Settings",
      icon: <IoSettingsOutline />,
      permission: permissions["Settings"]?.access,
      links: [
        { label: "User Management", link: "/dash-board/enrollment", icon: <LiaUsersCogSolid /> },
        { label: "Reward Level", link: "/dash-board/reward-level", icon: <CiMedal /> },
        { label: "Payment Methods", link: "/dash-board/payment-methods", icon: <MdPayment /> },
        { label: "Shipment", link: "/dash-board/zone", icon: <CiDeliveryTruck /> },
        { label: "Locations", link: "/dash-board/locations", icon: <MdOutlineLocationOn /> },
        {
          name: "Legal Policies",
          icon: <LuNewspaper />,
          links: [
            { label: "Terms & Conditions", link: "/dash-board/terms-condition", icon: <RiContractLine /> },
            { label: "Privacy Policy", link: "/dash-board/privacy-policy", icon: <MdOutlinePrivacyTip /> },
            { label: "Refund Policy", link: "/dash-board/refund-policy", icon: <HiOutlineReceiptRefund /> },
            { label: "Shipping Policy", link: "/dash-board/shipping-policy", icon: <MdOutlineLocalShipping /> },
            { label: "Return Policy", link: "/dash-board/return-policy", icon: <IoIosReturnLeft /> },
            { label: "Our Story", link: "/dash-board/our-story", icon: <PiBookOpen /> },
            { label: "FAQ", link: "/dash-board/faq", icon: <TbMessageCircleQuestion /> },
          ],
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "-100%" }} // Starts off-screen (left side)
        animate={{ x: 0 }} // Moves in
        exit={{ x: "-100%", transition: { duration: 0.3 } }} // Moves out on close
        transition={{ duration: 0.3, ease: "easeInOut" }} className="h-screen w-[262px] fixed z-50 overflow-y-auto custom-scrollbar bg-white">

        <div className="px-4 transition-colors duration-1000 sticky top-0 pt-1.5 z-10 bg-white">
          <Link href="/" legacyBehavior>
            <a target="_blank" className="flex items-center justify-center gap-2">
              <Image
                className="h-9 md:h-10 w-auto"
                src={logoWhiteImage}
                alt="Fashion Commerce logo"
              />
            </a>
          </Link>
          <hr style={{ border: "0.5px solid #ccc", margin: "8px 0" }} />
        </div>

        <div className={`flex flex-col mt-6 ${session ? "" : "mb-8"}`}>
          <h1 className="px-4 text-neutral-500 mb-4 font-medium">MAIN MENU</h1>
          {
            allList?.map((item, index) => {

              return item?.permission ? (

                <div key={index}>
                  {item?.name === "Settings" && <h1 className="px-4 text-neutral-500 mt-8 mb-4  font-medium">OTHERS</h1>}
                  <div
                    onClick={(e) => {
                      if (item?.links) {
                        e.preventDefault(); // Prevent navigation
                        handleItemClick(item?.name);
                      }
                    }}
                    className={`${(pathname === item?.path || (item?.path !== '/dash-board' && pathname.startsWith(item?.path))) ||
                      (item.name === 'Settings' && (pathname === '/dash-board/zone' || pathname.startsWith('/dash-board/zone/add-shipping-zone')))
                      ? "text-[#00B795] bg-[#E5F7F4] border-l-5 border-[#00B795]" : "text-black"} cursor-pointer`}>
                    {!item.links ? (
                      <Link href={item?.path} legacyBehavior>
                        <a className="flex items-center gap-2 w-full hover:bg-[#E5F7F4] px-4 py-3 group"
                          onClick={onClose}>
                          {/* Icon (Now also changes color on hover & active state) */}
                          <h2 className={`p-1 text-base xl:text-lg 2xl:text-xl rounded-xl
                  ${pathname === item?.path || (item?.path !== "/dash-board" && pathname.startsWith(item?.path)) ? "text-[#00B795]" : "text-black group-hover:text-[#00B795]"}`}>
                            {item?.icon}
                          </h2>

                          {/* Name (Also changes color on hover & active state) */}
                          <h2
                            className={`font-semibold text-neutral-600
                  ${pathname === item?.path ||
                                (item?.path !== "/dash-board" && pathname.startsWith(item?.path))
                                ? "!text-[#00B795]"
                                : "text-black group-hover:text-[#00B795]"
                              }`}
                          >
                            {item?.name}
                          </h2>
                        </a>
                      </Link>

                    ) : (
                      <div className={`flex items-center gap-2 w-full hover:bg-[#E5F7F4] hover:text-[#00B795] px-4 py-3 group`}>
                        <h2 className={`p-1 text-base xl:text-lg 2xl:text-xl rounded-xl ${pathname === item?.path || (item?.path !== "/dash-board" && pathname.startsWith(item?.path))
                          ? "text-[#00B795]" : "text-black group-hover:text-[#00B795]"}`}>
                          {item?.icon}
                        </h2>

                        {/* Name (Also changes color on hover & active state) */}
                        <h2 className={`font-semibold text-neutral-600 ${pathname === item?.path ||
                          (item?.path !== "/dash-board" && pathname.startsWith(item?.path))
                          ? "text-[#00B795]" : "text-black group-hover:text-[#00B795]"}`}>
                          {item?.name}
                        </h2>
                        <span className="ml-auto">
                          {activeItem === item?.name ? <FaAngleDown /> : <FaChevronRight />}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Render links under Settings or Product Configuration */}
                  {item?.links && activeItem === item?.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: activeItem === item.name ? "auto" : 0, opacity: activeItem === item.name ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }} className="flex flex-col items-center w-full">
                      {item?.links?.map((linkItem, linkIndex) => {

                        if (!linkItem.permission) return null;

                        return (
                          linkItem?.links ? (
                            // Render nested Product Configuration
                            <div key={linkIndex} className="w-full">
                              <div
                                onClick={() => handleSubItemClick(linkItem?.name)}
                                className="flex items-center gap-6 w-full hover:bg-[#E5F7F4] cursor-pointer px-4 py-3 justify-between group"
                              >
                                <div className="flex pl-2 items-center justify-between gap-2">
                                  <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl group-hover:text-[#00B795]">{linkItem?.icon}</h2>
                                  <h2 className={`font-semibold text-neutral-600 group-hover:text-[#00B795]`}>{linkItem?.name}</h2>
                                </div>
                                <div className="group-hover:text-[#00B795]">
                                  {activeSubItem === linkItem?.name ? <FaAngleDown /> : <FaChevronRight />}
                                </div>
                              </div>

                              {/* Render links under Product Configuration */}
                              {linkItem?.links && activeSubItem === linkItem?.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: activeSubItem === linkItem.name ? "auto" : 0, opacity: activeSubItem === linkItem.name ? 1 : 0 }}
                                  transition={{ duration: 0.5, ease: "easeInOut" }} className="flex flex-col items-center w-full">
                                  {linkItem?.links?.map((subLink, subIndex) => {
                                    if (!subLink.permission) return null;
                                    return (
                                      <Link href={subLink.link} key={subIndex} legacyBehavior>
                                        <a
                                          className={`flex items-center gap-2 w-full hover:bg-[#E5F7F4] pl-8 py-3 group ${pathname === subLink.link ? "text-[#00B795] bg-[#E5F7F4] border-l-5 border-[#00B795]" : "hover:text-[#00B795]"}`}
                                          onClick={onClose}
                                        >
                                          <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl">{subLink.icon}</h2>
                                          <h2 className={`font-semibold text-neutral-600 group-hover:text-[#00B795] ${pathname === subLink.link ? "!text-[#00B795]" : ""}`}>
                                            {subLink.label}
                                          </h2>
                                        </a>
                                      </Link>
                                    )
                                  })}
                                </motion.div>
                              )}
                            </div>
                          ) : (
                            // Render regular links in Product Hub or Settings
                            <Link href={linkItem.link} key={linkIndex} legacyBehavior>
                              <a
                                className={`flex pl-6 items-center gap-2 w-full hover:bg-[#E5F7F4] group py-3 ${pathname === linkItem.link ? "text-[#00B795] bg-[#E5F7F4] border-l-5 border-[#00B795]" : "hover:text-[#00B795]"}`} onClick={onClose}>
                                <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl">{linkItem.icon}</h2>
                                <h2 className={`font-semibold text-neutral-600 group-hover:text-[#00B795] ${pathname === linkItem.link ? "!text-[#00B795]" : ""}`}>{linkItem.label}</h2>
                              </a>
                            </Link>
                          )
                        )
                      }
                      )}
                    </motion.div>
                  )}

                </div>

              ) : null
            }
            )
          }
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

export default SideNavbar;