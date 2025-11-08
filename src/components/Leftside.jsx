import React, { useContext, useEffect, useState } from "react";
import {
  Home,
  Compass,
  UserPlus,
  Settings,
  BookMarked,
  BadgeCheck,
  CalendarRange,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../App";
import { handleLogout } from "./function/Function.js";

const Leftside = () => {
  const [userStats, setUserStats] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: "Feed", icon: <Home size={20} />, path: "/" },
    { id: "Discover", icon: <Compass size={20} />, path: "/discover" },
    { id: "Friends", icon: <UserPlus size={20} />, path: "/friends" },
    { id: "Events", icon: <CalendarRange size={20} />, path: "/search"},
    { id: "Saved", icon: <BookMarked size={20} />, path: "/save" },
    { id: "Settings", icon: <Settings size={20} /> },
  ];

  const { user, setIsAuthenticated } = useContext(AppContext);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/dashboard/${user.id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          console.log(response.data);
          setUserStats(response.data.data);
        }
      } catch (error) {
        console.error(
          "failed to fetch userStats:",
          error.response.data.messgae
        );
      }
    };
    fetchUserStats();
  }, []);

  const handleClickProfile = () => {
    navigate(`/user-profile/${user.id}`);
  };

  // console.log(user);

  return (
    <div className="flex flex-col h-screen w-full bg-white p-4">
      <div className="p-4 border-b w-full">
        <div
          onClick={handleClickProfile}
          className="flex items-center w-full hover:bg-gray-100 p-2 rounded-md cursor-pointer"
        >
          <img
            src={user.avatar}
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <div className="flex items-center">
              <p className="font-semibold text-sm">{user.fullName}</p>
              <div className="ml-1 items-center justify-center">
                <BadgeCheck className="text-blue-500" size={15} />
              </div>
            </div>
            <p className="text-xs text-gray-500">{user.username}</p>
          </div>
        </div>
        <div className="flex justify-start gap-x-6 mt-3 text-sm">
          <div className="text-center">
            <p className="font-semibold">{userStats.totalFollowers}</p>
            <p className="text-gray-500 text-xs">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{userStats.totalFollowing}</p>
            <p className="text-gray-500 text-xs">Following</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{userStats.totalPosts}</p>
            <p className="text-gray-500 text-xs">Posts</p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <nav className="mt-2">
          {tabs.map((tab) => (
            <NavLink
              to={tab.path}
              key={tab.id}
              className={`flex items-center w-full p-3 text-left transition-colors ${
                location.pathname === tab.path
                  ? "bg-blue-500 text-white rounded-md mx-2"
                  : "text-gray-700 hover:bg-gray-100 rounded-md mx-2"
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              <span>{tab.id}</span>
            </NavLink>
          ))}
        </nav>
        <div>
          <button
            onClick={() => handleLogout(navigate, setIsAuthenticated)}
            className=" flex w-full bg-blue-500 text-white justify-start items-center p-3 rounded-md mt-4 mx-2 hover:bg-blue-600 transition-colors hover:cursor-pointer"
          >
            <span>
              <LogOut size={20} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leftside;
