import React, { useEffect, useState } from "react";
import CreatePost from "../components/feed/CreatePost";
import Post from "../components/feed/Post.feed";
import Story from "../components/feed/Story.feed";
import AddPost from "../components/createPost/AddPost";
import Friends from "./Friends.page";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const Feed = () => {
  const [post, setPost] = useState([]);
  const { reload, setReload, } = useOutletContext();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/post/all",
          { withCredentials: true }
        );
        if (response.status === 200) {
          // console.log(response.data.data);
          setPost(response.data.data);
          setReload(false);
        }
      } catch (error) {
        console.error("failed to fetch post:", error.response.data.messgae);
      }
    };
    fetchPost();
  }, [reload]);

  // console.log("Reload is ", reload);

  return (
    <div className={` relative flex w-full justify-center`}>
      <div className="flex w-full flex-col gap-y-2">
        <Story />
        <CreatePost />
        {post.length > 0 &&
          post.map((item) => <Post key={item.id} post={item} />)}
        {/* <Friends /> */}
      </div>
    </div>
  );
};

export default Feed;
