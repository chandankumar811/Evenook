import React, { useContext, useEffect } from "react";
import { AppContext } from "../../App";
import axios from "axios";

const FriendRequest = ({isFollower}) => {
  const [requests, setRequests] = React.useState([]);
  const { user } = useContext(AppContext);
  // console.log(user);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/connection/get-follower/${user.id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setRequests(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching friend requests", error.message);
      }
    };
    fetchRequests();
  },[isFollower, user.id]);

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/connection/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Followed user successfully");
        setRequests((prevRequests) =>
          prevRequests.filter((user) => user.id !== userId)
        );
      }
    } catch (error) {
      console.log("Error following user", error.message);
    }
  }
  console.log(requests.length);
  return (
    <div className="w-full bg-white p-4">
      <h3 className="font-semibold text-gray-700 mb-2">Follower ({requests.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="border max-h-32 flex-1 rounded-lg px-4 py-2 flex min-w-fit md:max-w-[50%] max-w-full">
              <img src={req.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div className="ml-3 flex-1">
                <p className="font-semibold">{req.username}</p>
                <p className="text-xs text-gray-500 mb-2">5 mutual friends</p>
                <div className="flex space-x-2 ">
                  <button onClick={() => handleFollow(req.id)} className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs">
                    Follow back
                  </button>
                  <button className="bg-gray-200 text-gray-700 rounded-md px-3 py-1 text-xs">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No friend requests</div>
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
