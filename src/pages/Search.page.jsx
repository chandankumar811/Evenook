import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Post from "../components/feed/Post.feed.jsx";
import SearchNotFound from "../assets/search-not-found.svg";
import SuggestionUser from "../components/friends/SuggestionUser";

const SearchPage = () => {
  const [users, setUsers] = useState([]);
  const [post, setPost] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          axios.get(
            `http://localhost:8000/api/v1/users/search?query=${query}`,
            { withCredentials: true }
          ),
          axios.get(`http://localhost:8000/api/v1/post/search?query=${query}`, {
            withCredentials: true,
          }),
        ]);
        setUsers(userRes.data.data);
        setPost(postRes.data.data);
      } catch (err) {
        console.error("Search failed", err);
      }
    };
    if (query) fetchData();
  }, [query]);

  console.log("search user", users);
  // console.log("search post", post);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex gap-4 p-4 flex-wrap">
        {users.length > 0 ? (
          users.map((users) => (
            <div
              key={users.id}
              className="border max-h-32 flex-1 rounded-lg px-4 py-2 flex min-w-fit md:max-w-[50%] max-w-full"
            >
              <img
                src={users.avatar}
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3 flex-col">
                <p className="font-semibold whitespace-nowrap">
                  {users.username}
                </p>
                <p className="text-xs text-gray-500 mb-2">5 mutual friends</p>
                <p className="text-xs text-gray-500 mb-2">
                  {users.instituteName || "Padhta hi nhi hai madharchod"}
                </p>
                <div className="flex space-x-2 ">
                  <button className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs">
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
          <div className="flex flex-col justify-center items-center w-full h-[73vh]">
            <p className="text-3xl text-gray-500 font-bold">Post Not Found</p>
          </div>
        )}
      </div>
      {post.length > 0 ? (
        post.map((item) => <Post key={item.id} post={item} />)
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-[73vh]">
          <p className="text-3xl text-gray-500 font-bold">Post Not Found</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
