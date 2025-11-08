import React, { useEffect, useState } from "react";
import Leftside from "./components/Leftside.jsx";
import Navbar from "./components/Navbar.jsx";
import { Outlet, useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Close sidebar when route changes
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-200">
      <div className="fixed top-0 w-full z-30">
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      <div className="flex w-full pt-16">
        <div
          className={`fixed left-0 h-full z-20 bg-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out
            lg:w-1/4 lg:translate-x-0 lg:block
            ${isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"}`}
        >
          <Leftside toggleSidebar={toggleSidebar} />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        <div className="w-full lg:w-3/4 lg:ml-[25%] px-2 overflow-y-auto lg:mb-2 mb-12">
          <Outlet context={{ reload, setReload }} />
        </div>
      </div>
    </div>
  );
};

export default Index;
