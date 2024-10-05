"use client";
import { FaBullhorn } from "react-icons/fa";
import { PiUsersThreeLight } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { IoMdHome } from "react-icons/io";
import { MdOutlineSettings, MdPayment } from "react-icons/md";
import { TbClipboardList } from "react-icons/tb";
import { LiaBoxOpenSolid } from "react-icons/lia";
import { TbBuildingBank } from "react-icons/tb";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
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

const SideNavbar = ({ onClose }) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (name) => {
    setActiveItem(activeItem === name ? null : name);
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
      name: "Products",
      icon: <LiaBoxOpenSolid />,
      path: "/dash-board/products",
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
        { label: 'Shipment', link: '/dash-board/zone', icon: <BsBoxSeam /> },
        { label: 'Payment Methods', link: '/dash-board/payment-methods', icon: <MdPayment /> },
        { label: 'Categories', link: '/dash-board/categories', icon: <BiCategory /> },
        { label: 'Colors', link: '/dash-board/colors', icon: <IoColorPaletteOutline /> },
        { label: 'Vendors', link: '/dash-board/vendors', icon: <LuWarehouse /> },
        { label: 'Tags', link: '/dash-board/tags', icon: <BsTags /> },
      ]
    },
  ];

  return (
    <div className="h-screen w-full md:w-[220px] lg:w-[250px] xl:w-[280px] 2xl:w-[300px] fixed z-50 overflow-y-auto custom-scrollbar bg-gradient-to-t from-[#9f511655] to-[#9f511616]">
      <button onClick={onClose} className="md:hidden p-2 absolute right-2 top-2">
        <ImCross size={20} />
      </button>
      <div className="px-10 pt-6 md:pt-4">
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
                  ? "text-black bg-[#F9FBFA]" : "text-black"} mx-4 rounded-lg cursor-pointer`}
              >
                {!item.links ? (
                  <Link href={item?.path} legacyBehavior>
                    <a
                      className="flex items-center gap-2 w-full hover:bg-[#F9FBFA] hover:text-black px-4 py-2 rounded-md"
                      onClick={onClose}
                    >
                      <h2 className="p-1 text-2xl rounded-xl">{item?.icon}</h2>
                      <h2 className="font-semibold">{item?.name}</h2>
                    </a>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 w-full hover:bg-[#F9FBFA] hover:text-black px-4 py-2 rounded-md">
                    <h2 className="p-1 text-2xl rounded-xl">{item?.icon}</h2>
                    <h2 className="font-semibold">{item?.name}</h2>
                    <span className="ml-auto">
                      {activeItem === item?.name ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </div>
                )}
              </div>
              {item?.links && activeItem === item?.name && (
                <div className="px-4 py-2 flex flex-col items-center gap-2">
                  {item?.links?.map((linkItem, linkIndex) => (
                    <Link href={linkItem?.link} key={linkIndex} legacyBehavior>
                      <a
                        className={`flex items-center gap-2 w-full hover:bg-[#F9FBFA] hover:text-black px-4 ml-12 py-2 rounded-md ${pathname === linkItem.link || (linkItem.link === '/dash-board/zone' && pathname.startsWith('/dash-board/zone/add-shipping-zone')) || (linkItem.link === "/dash-board/variants" && pathname.startsWith("/dash-board/variants/add-color")) || (linkItem.link === "/dash-board/variants" && pathname.startsWith("/dash-board/variants/add-tag")) || (linkItem.link === "/dash-board/variants" && pathname.startsWith("/dash-board/variants/add-vendor")) || (linkItem.link === "/dash-board/categories" && pathname.startsWith("/dash-board/categories/add-category")) || (linkItem.link === "/dash-board/vendors" && pathname.startsWith("/dash-board/vendors/add-vendor")) || (linkItem.link === "/dash-board/tags" && pathname.startsWith("/dash-board/tags/add-tag")) || (linkItem.link === "/dash-board/colors" && pathname.startsWith("/dash-board/colors/add-color")) || (linkItem.link === "/dash-board/zone" && pathname.startsWith("/dash-board/zone/existing-zones")) ? "text-black bg-[#F9FBFA]" : ""}`}
                        onClick={onClose}
                      >
                        <h2 className="p-1 text-2xl rounded-xl">{linkItem?.icon}</h2>
                        <h2 className="font-semibold">{linkItem?.label}</h2>
                      </a>
                    </Link>
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