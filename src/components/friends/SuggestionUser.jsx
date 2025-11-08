import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import axios from "axios";
import { handleFollow } from "../function/Function";

const SuggestionUser = ({ isPeopleYouMayKnow, users }) => {
  const { user } = useContext(AppContext);
  const [suggestionUsers, setSuggestionUsers] = useState([]);
  const [isFollow, setIsFollow] = useState("false");

  console.log("suggest user", users);

  useEffect(() => {
    const fetchSuggestionUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/connection/get-suggest/${
            user.id || users.id
          }`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSuggestionUsers(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching suggestion users", error.message);
      }
    };
    fetchSuggestionUsers();
  }, [isPeopleYouMayKnow, user.id, users]);

  return (
    <div className="w-full bg-white p-4">
      <h3 className="font-semibold text-gray-700 mb-2">Suggestion Friends</h3>
      <div className="flex flex-wrap gap-4">
        {suggestionUsers.length > 0 ? (
          suggestionUsers.map((req) => (
            <div
              key={req.id}
              className="border max-h-32 flex-1 rounded-lg px-4 py-2 flex min-w-fit md:max-w-[50%] max-w-full"
            >
              <img src={req.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div className="ml-3 flex-col">
                <p className="font-semibold whitespace-nowrap">
                  {req.username}
                </p>
                <p className="text-xs text-gray-500 mb-2">5 mutual friends</p>
                <p className="text-xs text-gray-500 mb-2">
                  {req.instituteName || "Padhta hi nhi hai madharchod"}
                </p>
                <div className="flex space-x-2 ">
                  <button
                    onClick={() => handleFollow(req.id, setSuggestionUsers)}
                    className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs"
                  >
                    Follow
                  </button>
                  <button className="bg-gray-200 text-gray-700 rounded-md px-3 py-1 text-xs">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No suggestion users</div>
        )}
      </div>
    </div>
  );
};

export default SuggestionUser;
