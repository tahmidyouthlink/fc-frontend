import React from "react";
import SideNavbar from "../components/layout/SideNavbar";
import DashboardNavbar from "../components/layout/DashboardNavbar";

const Layout = ({ children }) => {
  return (
    <>
      {/* for large devices */}
      <div className="inset-y-0 flex-col hidden md:flex">
        <SideNavbar />
      </div>
      {/* for all devices */}
      <div className="relative ml-0 md:ml-[220px] lg:ml-[250px] xl:ml-[280px] 2xl:ml-[300px]">
        <DashboardNavbar />
        {children}
      </div>
    </>
  );
};

export default Layout;