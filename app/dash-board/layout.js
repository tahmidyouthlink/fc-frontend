import React from "react";
import SideNavbar from "../components/layout/SideNavbar";
import DashboardNavbar from "../components/layout/DashboardNavbar";

const Layout = ({ children }) => {
  return (
    <>
      {/* Only render sidebar on large devices */}
      <div className="inset-y-0 flex-col hidden xl:flex">
        <SideNavbar />
      </div>

      {/* Main content */}
      <div className="relative ml-0 xl:ml-[262px]">
        <DashboardNavbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
