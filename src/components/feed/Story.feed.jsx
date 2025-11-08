import React, { useState, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const UserAvatarCarousel = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const [users] = useState([
    { id: 1, username: "x_ae-23b", avatar: "/api/placeholder/48/48" },
    { id: 2, username: "maisenpal", avatar: "/api/placeholder/48/48" },
    { id: 3, username: "saylortwift", avatar: "/api/placeholder/48/48" },
    { id: 4, username: "johndoe", avatar: "/api/placeholder/48/48" },
    { id: 5, username: "maryjane2", avatar: "/api/placeholder/48/48" },
    { id: 6, username: "obama", avatar: "/api/placeholder/48/48" },
    { id: 7, username: "x_ae-21", avatar: "/api/placeholder/48/48" },
    { id: 8, username: "x_ae-23b", avatar: "/api/placeholder/48/48" },
    { id: 9, username: "user9", avatar: "/api/placeholder/48/48" },
    { id: 10, username: "user10", avatar: "/api/placeholder/48/48" },
    { id: 11, username: "user11", avatar: "/api/placeholder/48/48" },
    { id: 12, username: "user12", avatar: "/api/placeholder/48/48" },
    { id: 13, username: "user13", avatar: "/api/placeholder/48/48" },
    { id: 14, username: "user14", avatar: "/api/placeholder/48/48" },
    { id: 15, username: "user15", avatar: "/api/placeholder/48/48" },
  ]);

  const getRandomColor = (index) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 relative">
      <div
        className="overflow-x-auto scrollbar-none"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
        }}
      >
        <div className="flex space-x-4 items-start py-2 min-w-max">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex flex-col items-center space-y-2 w-16"
            >
              <div
                className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center`}
              >
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <div
                    className={`w-10 h-10 rounded-full ${getRandomColor(
                      index
                    )} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <p className="text-xs text-center truncate w-full">
                {user.username}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showLeftButton && (
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center z-10"
          onClick={scrollLeft}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {showRightButton && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center z-10"
          onClick={scrollRight}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default UserAvatarCarousel;
