import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import axios from "axios";
import { UserSearch } from "lucide-react";
import FriendsNotFound from "../../assets/add-user-cuate.svg";

const YourFriends = ({
  setIsPeopleYouMayKnow,
  setIsFollower,
  setIsFollowing,
  isFollowing,
}) => {
  const { user } = useContext(AppContext);
  const [friends, setFriends] = useState([]);

  const handleFindFriendsBtn = () => {
    setIsPeopleYouMayKnow(true);
    setIsFollower(false);
    setIsFollowing(false);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/connection/get-following/${user.id}`,
          { withCredentials: true }
        );
        setFriends(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log("Error fetching friends", error.message);
      }
    };
    fetchFriends();
  }, [user.id, isFollowing]);

  const handleUnfollow = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/connection/unfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Unfollowed user successfully");
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend.id !== userId)
        );
      }
    } catch (error) {
      console.log("Error unfollowing user", error.message);
    }
  };

  return (
    <div className="w-full bg-white p-4">
      <h3 className="font-semibold text-gray-700 mb-2">
        Following ({friends.length})
      </h3>
      <div className="flex flex-wrap gap-4">
        {friends.length > 0 ? (
          friends.map((req) => (
            <div
              key={req.id}
              className="border max-h-32 flex-1 rounded-lg px-4 py-2 flex min-w-fit md:max-w-[50%] max-w-full"
            >
              <img src={req.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div className="ml-3">
                <p className="font-semibold">{req.username}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {req.instituteName}
                </p>
                <div className="text-xs text-gray-500 mb-2 space-x-6">
                  <button
                    onClick={() => handleUnfollow(req.id)}
                    className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs cursor-pointer"
                  >
                    unfollow
                  </button>
                  <button className="text-blue-500 text-xs">Profile</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-[73vh]">
            <p className="text-3xl text-gray-500 font-bold">No friend</p>
            <img src={FriendsNotFound} className="w-84" alt="" />
            <button
              onClick={handleFindFriendsBtn}
              className="px-18 py-2 bg-blue-500 text-white text-xl font-semibold cursor-pointer rounded-md mt-4"
            >
              Find friends
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourFriends;
