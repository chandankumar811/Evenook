import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import axios from "axios";

const Comment = ({ comment }) => {
  return (
    <div className="flex space-x-1 py-1 justify-start">
      <img src="/vite.svg" alt="user" className="w-5 h-5 rounded-full" />
      <div className="group flex flex-col justify-center items-center">
        <div className="bg-gray-100 rounded-xl px-4 py-2 group">
          <p className="font-semibold text-sm">{comment.username}</p>
          <p className="text-sm text-gray-700">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
          <button className="font-medium hover:text-gray-700">Like</button>
          <button className="font-medium hover:text-gray-700">Reply</button>
          <span>12:15</span>
          <span>10 likes</span>
        </div>
      </div>
      <button className=" text-gray-500 items-center justify-center cursor-pointer mb-5 hidden group-hover:block">
        <MoreVertical size={16} />
      </button>
    </div>
  );
};

export default Comment;
