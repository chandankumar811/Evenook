import React, { useContext, useRef } from "react";
import { Image, CalendarRange, SquarePen } from "lucide-react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const handleCreatePost = (fileType) => {
    navigate("/add-post", { state: fileType || "" });
  };

  const { user } = useContext(AppContext);

  return (
    <div className="w-full p-4 border-gray-100 rounded-md bg-white">
      <div className="flex w-full items-center border-b p-2">
        <img
          src={user.avatar}
          alt="User"
          className="w-10 h-10 rounded-full ring-1 ring-green-500"
        />
        <span className="ml-3 text-gray-500 text-sm ring-1 ring-gray-200 w-full px-4 py-2 rounded-full cursor-pointer">
          Start post in this group...
        </span>
      </div>
      <div className="flex w-full justify-between mt-4">
        <button
          onClick={() => handleCreatePost("image")}
          className="flex items-center text-gray-500 text-sm cursor-pointer"
        >
          <span className="mr-1">
            {" "}
            <Image size={20} className="text-blue-500" />
          </span>
          <span>Image</span>
        </button>
        <button className="flex items-center text-gray-500 text-sm cursor-pointer">
          <span className="mr-1">
            {" "}
            <CalendarRange size={20} className="text-orange-500" />
          </span>
          <span>Event</span>
        </button>
        <button className="flex items-center text-gray-500 text-sm cursor-pointer">
          <span className="mr-1">
            {" "}
            <SquarePen size={20} className="text-red-500" />
          </span>
          <span>Write up</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
