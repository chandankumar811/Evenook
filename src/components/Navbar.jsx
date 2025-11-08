import React, { use, useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarRange,
  Codepen,
  Compass,
  Flag,
  Home,
  Menu,
  Plus,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, isSidebarOpen}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSearchExpanded && !e.target.closest(".search-container")) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded]);

  // const debouncedNavigate = useRef();

  // useEffect(() => {
  //   debouncedNavigate.current = debounce((query) => {
  //     const trimmedQuery = query.trim();
  //     if (trimmedQuery) {
  //       if (
  //         location.pathname !== "/search" ||
  //         !location.search.includes(trimmedQuery)
  //       ) {
  //         navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
  //       } else {
  //         if (location.pathname !== "/") {
  //           navigate("/");
  //         }
  //       }
  //     }
  //   }, 300);
  // }, [navigate, location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/");
    }
  };

  const tabs = [
    { id: "Home", icon: <Home size={20} />, path: "/" },
    { id: "Discover", icon: <Compass size={20} />, path: "/discover" },
    { id: "Add Post", icon: <Plus size={20} />, path: "/add-post" },
    { id: "Friends", icon: <UserPlus size={20} />, path: "/friends" },
    { id: "Events", icon: <CalendarRange size={20} /> },
  ];

  console.log("Search term:", searchQuery);

  return (
    <div className={`flex justify-between w-full h-15`}>
      <div className={`flex w-full justify-between bg-white`}>
        <div className="flex gap-3 items-center justify-center ml-2">
          <button
            onClick={toggleSidebar}
            className="flex w-10 h-10 items-center justify-center text-gray-700 bg-white rounded-full shadow-md lg:hidden"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div
            className={`flex items-center h-full p-2 ${
              isSearchExpanded === true ? "hidden" : "flex"
            }`}
          >
            <Codepen className="text-blue-500" size={40} />
            <span className="text-black font-bold text-2xl">Evenook</span>
          </div>
        </div>

        <div className="flex gap-4 items-center mr-8">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Find friends, Events or pages here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-4 py-2 bg-gray-100 rounded-full text-sm w-64 focus:outline-none group-[focus]:"
            />
            <Search
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 cursor-pointer"
              size={16}
            />
          </div>

          <div className="flex md:hidden">
            {isSearchExpanded ? (
              <div className="relative search-container">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Find friends, Events or pages here"
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64 focus:outline-none "
                  value={searchTerm}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-700 bg-gray-100 rounded-full"
                aria-label="Open search"
              >
                <Search size={20} className="text-gray-500" />
              </button>
            )}
          </div>

          <div className="relative">
            <Bell size={22} className="flex text-blue-500" />
            <span className="text-[10px] text-red-500 font-bold bg-white absolute -top-1  -right-1">
              10
            </span>
          </div>
        </div>
      </div>

      <div className={`flex w-full fixed bottom-0 bg-white md:hidden`}>
        <div className="flex w-full justify-evenly">
          {tabs.map((tab) => (
            <NavLink
              to={tab.path}
              key={tab.id}
              className={`flex flex-col justify-center items-center p-2 text-[10px] ${
                location.pathname === tab.path
                  ? "text-blue-500"
                  : "text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.id}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
