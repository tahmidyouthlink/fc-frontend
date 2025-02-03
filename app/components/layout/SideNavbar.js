"use client";
import { FaBullhorn, FaGlobeAsia } from "react-icons/fa";
import { PiUsersThreeLight } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { IoMdHome } from "react-icons/io";
import { MdOutlineSettings, MdPayment, MdOutlineLocationOn, MdOutlineInventory2, MdOutlineCategory, MdOutlinePrivacyTip, MdOutlineLocalShipping } from "react-icons/md";
import { RiContractLine } from "react-icons/ri";
import { TbBrandGoogleAnalytics, TbMessageCircleQuestion, TbClipboardList, TbBuildingBank } from "react-icons/tb";
import Image from "next/image";
import logoWhiteImage from "../../../public/logos/fc-logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { LiaUserLockSolid } from "react-icons/lia";
import { IoColorPaletteOutline } from "react-icons/io5";
import { LuWarehouse } from "react-icons/lu";
import { BsTags } from "react-icons/bs";
import { CiMedal } from "react-icons/ci";
import { BsBoxSeam } from "react-icons/bs";
import { FiShoppingBag } from "react-icons/fi";
import { BiPurchaseTagAlt, BiTransferAlt } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { IoIosReturnLeft } from "react-icons/io";
import { LuNewspaper } from "react-icons/lu";
import { PiBookOpen } from "react-icons/pi";

const SideNavbar = ({ onClose }) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);  // State for submenu

  const handleItemClick = (name) => {
    setActiveItem(activeItem === name ? null : name);
  };

  const handleSubItemClick = (subName) => {
    setActiveSubItem(activeSubItem === subName ? null : subName);
  };

  const adminList = [
    {
      name: "Home",
      icon: <IoMdHome />,
      path: "/dash-board",
    },
    {
      name: "Orders",
      icon: <TbClipboardList />,
      path: "/dash-board/orders",
    },
    {
      name: "Product Hub",
      icon: <MdOutlineCategory />,
      links: [
        { label: 'Products', link: '/dash-board/products', icon: <FiShoppingBag /> },
        { label: 'Inventory', link: '/dash-board/inventory', icon: <MdOutlineInventory2 /> },
        { label: 'Purchase Orders', link: '/dash-board/purchase-orders', icon: <BiPurchaseTagAlt /> },
        { label: 'Transfers', link: '/dash-board/transfers', icon: <BiTransferAlt /> }
      ]
    },
    {
      name: "Customers",
      icon: <PiUsersThreeLight />,
      path: "/dash-board/customers"
    },
    {
      name: "Finances",
      icon: <TbBuildingBank />,
      path: "/dash-board/finances"
    },
    {
      name: "Analytics",
      icon: <TbBrandGoogleAnalytics />,
      path: "/dash-board/analytics"
    },
    {
      name: "Marketing",
      icon: <FaBullhorn />,
      path: "/dash-board/marketing"
    },
    {
      name: "Settings",
      icon: <MdOutlineSettings />,
      links: [
        { label: 'Permissions', link: '/dash-board/permissions', icon: <LiaUserLockSolid /> },
        { label: 'Reward Level', link: '/dash-board/reward-level', icon: <CiMedal /> },
        { label: 'Payment Methods', link: '/dash-board/payment-methods', icon: <MdPayment /> },

        // Product Configuration nested within Settings
        {
          name: "Product Settings",  // New section for product configuration
          icon: <MdOutlineSettings />,   // You can change this to any other icon you prefer
          links: [
            { label: 'Categories', link: '/dash-board/categories', icon: <BiCategory /> },
            { label: 'Seasons', link: '/dash-board/seasons', icon: <FaGlobeAsia /> },
            { label: 'Colors', link: '/dash-board/colors', icon: <IoColorPaletteOutline /> },
            { label: 'Vendors', link: '/dash-board/vendors', icon: <LuWarehouse /> },
            { label: 'Tags', link: '/dash-board/tags', icon: <BsTags /> },
            { label: 'Shipment', link: '/dash-board/zone', icon: <BsBoxSeam /> },
            { label: 'Locations', link: '/dash-board/locations', icon: <MdOutlineLocationOn /> },
          ]
        },

        // legal policies 
        {
          name: "Legal Policies",
          icon: <LuNewspaper />,
          links: [
            { label: 'Terms & Conditions', link: '/dash-board/terms-condition', icon: <RiContractLine /> },
            { label: 'Privacy Policy', link: '/dash-board/privacy-policy', icon: <MdOutlinePrivacyTip /> },
            { label: 'Refund Policy', link: '/dash-board/refund-policy', icon: <HiOutlineReceiptRefund /> },
            { label: 'Shipping Policy', link: '/dash-board/shipping-policy', icon: <MdOutlineLocalShipping /> },
            { label: 'Return Policy', link: '/dash-board/return-policy', icon: <IoIosReturnLeft /> },
            { label: 'Our Story', link: '/dash-board/our-story', icon: <PiBookOpen /> },
            { label: 'FAQ', link: '/dash-board/faq', icon: <TbMessageCircleQuestion /> },
          ]
        },
      ]
    },
  ];

  return (
    <div className="h-screen w-full md:w-[220px] lg:w-[250px] xl:w-[280px] 2xl:w-[300px] fixed z-50 overflow-y-auto custom-scrollbar bg-gradient-to-t from-[#9f511655] to-[#9f511616]">

      <button onClick={onClose} className="md:hidden p-2 absolute right-2 top-2">
        <ImCross size={20} />
      </button>

      <div className="px-6 xl:px-8 2xl:px-10 pt-6 md:pt-4">
        <Link href="/" legacyBehavior>
          <a className="flex items-center gap-2">
            <Image
              className="h-[14px] md:h-6 w-auto"
              src={logoWhiteImage}
              alt="Fashion Commerce logo"
            />
            <h1 className="text-xs md:text-lg">Fashion Commerce</h1>
          </a>
        </Link>
      </div>

      <div className="flex flex-col text-sm lg:text-base mt-4 md:mt-8 gap-2">
        {
          adminList.map((item, index) => (
            <div key={index}>
              <div
                onClick={(e) => {
                  if (item?.links) {
                    e.preventDefault(); // Prevent navigation
                    handleItemClick(item?.name);
                  }
                }}
                className={`${(pathname === item?.path || (item?.path !== '/dash-board' && pathname.startsWith(item?.path))) ||
                  (item.name === 'Settings' && (pathname === '/dash-board/zone' || pathname.startsWith('/dash-board/zone/add-shipping-zone')))
                  ? "text-black bg-[#F9FBFA]" : "text-black"} mx-4 rounded-lg cursor-pointer`}>
                {!item.links ? (
                  <Link href={item?.path} legacyBehavior>
                    <a className="flex items-center gap-2 w-full hover:bg-[#F9FBFA] hover:text-black px-4 py-2 rounded-md" onClick={onClose}>
                      <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl">{item?.icon}</h2>
                      <h2 className="font-semibold text-neutral-950">{item?.name}</h2>
                    </a>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 w-full hover:bg-[#F9FBFA] hover:text-black px-4 py-2 rounded-md">
                    <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl">{item?.icon}</h2>
                    <h2 className={`font-semibold text-neutral-950`}>{item?.name}</h2>
                    <span className="ml-auto">
                      {activeItem === item?.name ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </div>
                )}
              </div>

              {/* Render links under Settings or Product Configuration */}
              {item?.links && activeItem === item?.name && (
                <div className="px-6 py-2 flex flex-col items-center gap-2 w-full">
                  {item?.links?.map((linkItem, linkIndex) => (
                    linkItem?.links ? (
                      // Render nested Product Configuration
                      <div key={linkIndex} className="w-full">
                        <div onClick={() => handleSubItemClick(linkItem?.name)}
                          className="flex items-center gap-6 w-full hover:bg-[#F9FBFA] hover:text-black rounded-md cursor-pointer px-4 py-2 justify-between ml-1">
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl">{linkItem?.icon}</h2>
                            <h2 className="font-semibold text-neutral-950">{linkItem?.name}</h2>
                          </div>
                          <div>
                            {activeSubItem === linkItem?.name ? <FaAngleUp /> : <FaAngleDown />}
                          </div>
                        </div>

                        {/* Render links under Product Configuration */}
                        {linkItem?.links && activeSubItem === linkItem?.name && (
                          <div className="px-2 py-2 flex flex-col items-center gap-2 w-full">
                            {linkItem?.links?.map((subLink, subIndex) => (
                              <Link href={subLink.link} key={subIndex} legacyBehavior>
                                <a
                                  className={`flex items-center ml-2 gap-2 w-full hover:bg-[#F9FBFA] hover:text-black px-4 py-2 rounded-md ${pathname === subLink.link ? "text-black bg-[#F9FBFA]" : ""}`}
                                  onClick={onClose}
                                >
                                  <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl">{subLink.icon}</h2>
                                  <h2 className="font-semibold text-neutral-950">{subLink.label}</h2>
                                </a>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Render regular links in Settings
                      <Link href={linkItem.link} key={linkIndex} legacyBehavior>
                        <a className={`flex items-center gap-2 w-full hover:bg-[#F9FBFA] ml-2 hover:text-black px-4 py-2 rounded-md ${pathname === linkItem.link ? "text-black bg-[#F9FBFA]" : ""}`}
                          onClick={onClose}
                        >
                          <h2 className="p-1 text-base xl:text-lg 2xl:text-xl rounded-xl">{linkItem.icon}</h2>
                          <h2 className="font-semibold text-neutral-950">{linkItem.label}</h2>
                        </a>
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default SideNavbar;