import React, { useState } from "react";
import FriendRequest from "../components/friends/FriendRequest";
import YourFriends from "../components/friends/YourFriends";
import SuggestionUser from "../components/friends/SuggestionUser";

const Friends = () => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [isFollower, setIsFollower] = useState(false);
  const [isPeopleYouMayKnow, setIsPeopleYouMayKnow] = useState(false);
  const handleFollowing = () => {
    setIsFollowing(true);
    setIsFollower(false);
    setIsPeopleYouMayKnow(false);
  };
  const handleFollower = () => {
    setIsFollowing(false);
    setIsFollower(true);
    setIsPeopleYouMayKnow(false);
  };
  const handlePeopleYouMayKnow = () => {
    setIsFollowing(false);
    setIsFollower(false);
    setIsPeopleYouMayKnow(true);
  };
  return (
    <div className="flex flex-col bg-gray-200 gap-y-1">
      <div className="flex items-center gap-x-5 gap-y-2 bg-white p-4 flex-wrap">
        <button
          onClick={handleFollowing}
          className={`px-3 py-2  rounded-md cursor-pointer ${
            isFollowing ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          } `}
        >
          Following
        </button>
        <button
          onClick={handleFollower}
          className={`px-3 py-2 rounded-md cursor-pointer ${
            isFollower ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          Followers
        </button>
        <button
          onClick={handlePeopleYouMayKnow}
          className={`px-3 py-2  rounded-md cursor-pointer ${
            isPeopleYouMayKnow
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          People You May Know
        </button>
      </div>
      <div className={`${isFollower ? "block" : "hidden"}`}>
        <FriendRequest isFollower={isFollower}/>
      </div>
      <div className={`${isFollowing ? "block" : "hidden"}`}>
        <YourFriends
          setIsPeopleYouMayKnow={setIsPeopleYouMayKnow}
          setIsFollower={setIsFollower}
          setIsFollowing={setIsFollowing}
          isFollowing={isFollowing}
        />
      </div>
      <div
        className={`${
          isPeopleYouMayKnow ? "block" : "hidden"
        } min-h-screen bg-white`}
      >
        <SuggestionUser isPeopleYouMayKnow={isPeopleYouMayKnow}/>
      </div>
    </div>
  );
};

export default Friends;
