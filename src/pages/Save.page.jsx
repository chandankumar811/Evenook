import React, { useCallback, useEffect, useState } from "react";
import CreatePost from "../components/feed/CreatePost.jsx";
import axios from "axios";
import Post from "../components/feed/Post.feed.jsx";
import { useNavigate, useOutletContext } from "react-router-dom";
import saveNotFound from "../assets/no-save-post.svg";

const Save = () => {
  const { reload, setReload } = useOutletContext();
  const [savePost, setSavePost] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSavedPost = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/save/get-saved-post",
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSavePost(response.data.data);
          setReload(false);
        }
      } catch (error) {
        console.error("failed to fetch post:", error.response.data.messgae);
      }
    };
    fetchSavedPost();
  }, [reload]);

  // console.log(savePost);

  return (
    <div className="flex flex-col w-full justify-center gap-1">
      <CreatePost />
      {savePost.length > 0 ? (
        savePost.map((item) => <Post key={item.postId} post={item} />)
      ) : (
        <div className="bg-white flex flex-col justify-center items-center w-full h-[74vh] rounded-md">
          <p className="text-3xl text-gray-500 font-bold">No saved posts</p>
          <img src={saveNotFound} alt="" className="w-84" />
          <button onClick={() => {navigate("/")}} className="px-18 py-2 bg-blue-500 text-white text-xl font-semibold cursor-pointer rounded-md mt-4"> Explore Posts</button>
        </div>
      )}
    </div>
  );
};

export default Save;
