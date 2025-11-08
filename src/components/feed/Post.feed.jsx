import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  ThumbsUp,
  Paperclip,
  SmileIcon,
} from "lucide-react";
import Comment from "./Comment.feed";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import Share from "./Share.feed.jsx";

const Post = ({ post }) => {
  const { reload, setReload } = useOutletContext();
  const [isLiked, setIsLiked] = useState(false);
  const [isShareBoxOpen, setIsShareBoxOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [postUrl, setPostUrl] = useState();
  const [comment, setComment] = useState("");
  const [showMoreComment, setShowMoreComment] = useState(false);

  const navigate = useNavigate();

  // console.log(post);

  useEffect(() => {
    const fetchLikeBYCurrentUSer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/like/get-like-by-current-user/${
            post.id || post.postId
          }`,
          { withCredentials: true }
        );
        // console.log(response.data.data);
        if (response.status === 200 && response.data.data.length > 0) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error(
          "Error to fetch like by current user:",
          error.response.data.message
        );
      }
    };
    fetchLikeBYCurrentUSer();
  }, [reload]);

  useEffect(() => {
    const fetchSavedByCurrentUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/save/get-save-post-by-current-user/${
            post.id || post.postId
          } `,
          { withCredentials: true }
        );
        if ((response.status === 200) & (response.data.data.length > 0)) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error(
          "Error to fetch save by current user:",
          error.response.data.message
        );
      }
    };
    fetchSavedByCurrentUser();
  }, []);

  console.log(post, "SEarch post")

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/comment/c/${post.id || post.postId}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          // console.log("comments:", response);
          setComments(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchComments();
  }, [post.id, reload]);

  const handleLikeBtn = async () => {
    try {
      console.log(post);
      if (isLiked) {
        const response = await axios.delete(
          `http://localhost:8000/api/v1/like/${post.id || post.postId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setIsLiked(false);
        }
      } else {
        const response = await axios.post(
          `http://localhost:8000/api/v1/like/${post.id || post.postId}`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setIsLiked(true);
        }
      }
      setReload(!reload);
    } catch (error) {
      console.error("Error to handle like:", error.response.message);
    }
  };

  const handleShowMoreComment = () => {
    setShowMoreComment(!showMoreComment);
  };

  const handleClickProfile = () => {
    navigate(`/user-profile/${post.owner}`);
  };

  const handleShareBtn = () => {
    // setPostTitle(post.title);
    setPostUrl(`${window.location.origin}/post/p/${post.id}`);
    setIsShareBoxOpen(true);
  };

  const handleOnSubmitComment = async (e) => {
    e.preventDefault();
    console.log(comment);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/comment/c/${post.id}`,
        { content: comment },
        {
          withCredentials: true, // Ensure cookies are included
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("✅ Comment submitted:", response.data);
        setComment("");
      }
      setReload(!reload);
      setShowMoreComment(true);
    } catch (error) {
      console.error(
        "❌ Error submitting comment:",
        error.response?.data?.message || error.message
      );
    }
  };

  const onCloseShareBox = () => {
    setIsShareBoxOpen(false);
  };

  const handleSavePost = async () => {
    try {
      if (isSaved) {
        const response = await axios.delete(
          `http://localhost:8000/api/v1/save/remove-post/${
            post.id || post.postId
          }`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.status);
        if (response.status === 200) {
          // console.log("Remove save post successfully");
          setIsSaved(false);
          // refreshPost();
        }
      } else {
        const response = await axios.post(
          `http://localhost:8000/api/v1/save/save-post/${
            post.id || post.postId
          }`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          // console.log("Save post successfully");
          setIsSaved(true);
          // refreshPost();
        }
      }
      setReload(!reload);
    } catch (error) {
      console.error("failed to fetch post:", error.message);
    }
  };

  // console.log(isSaved);

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div
        onClick={handleClickProfile}
        className="flex items-center p-4 hover:underline cursor-pointer"
      >
        <img
          src={post.avatar}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <p className="font-semibold">{post.username}</p>
          {/* <p className="text-xs text-gray-500">{post.program}</p> */}
          <p className="text-xs text-gray-500">{post.instituteName}</p>
        </div>
        <button className="text-gray-500 cursor-pointer">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Post content */}
      <div className="px-4 pb-2">
        <p className="text-gray-700 text-md font-semibold mb-1">{post.title}</p>
        <p className="text-gray-700 text-sm mb-1">{post.description} </p>
      </div>

      {/* Image */}
      <div className="w-full">
        <img
          src={post.postFile}
          alt="Building with modern architecture"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Engagement stats */}
      <div className="px-4 py-2 flex text-sm text-gray-500">
        <div className="flex items-center mr-4">
          <span>
            {post.totalLikes} {post.totalLikes > 1 ? "Likes" : "Like"}
          </span>
        </div>
        <div className="flex items-center mr-4">
          <span>
            {post.totalComments}{" "}
            {post.totalComments > 1 ? "Comments" : "Comment"}
          </span>
        </div>
        <div className="flex items-center mr-4">
          <span>187 Share</span>
        </div>
        <div className="flex items-center ml-auto">
          <span>{post.totalSaves}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-gray-200">
        <div className="flex gap-x-5">
          <button
            onClick={handleLikeBtn}
            className="flex-1 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-100 "
          >
            <ThumbsUp
              fill={isLiked ? "#3B82F6" : "none"}
              size={20}
              className={`mr-1 ${isLiked ? "text-blue-500" : "text-gray-500"}`}
            />
          </button>
          <button
            onClick={handleShowMoreComment}
            className="flex-1 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            <MessageCircle size={20} className="text-gray-500 mr-1" />
          </button>
          <button
            onClick={handleShareBtn}
            className="flex-1 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            <Share2 size={20} className="text-gray-500 mr-1" />
          </button>
          <button
            onClick={handleSavePost}
            className="flex-1 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            <Bookmark
              fill={isSaved ? "#F97316" : "none"}
              size={20}
              className={`mr-1 ${
                isSaved ? "text-orange-500" : "text-gray-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Comment input */}
      <div className="flex items-center px-4 py-3 border-t border-gray-200">
        <img src="/vite.svg" alt="User" className="w-8 h-8 rounded-full mr-2" />
        <input
          type="text"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          placeholder="Write your comment..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
        />
        <button className="mx-2 text-gray-500 cursor-pointer">
          <Paperclip size={20} />
        </button>
        <button className="mr-2 text-gray-500 cursor-pointer">
          <SmileIcon size={20} />
        </button>
        <button
          onClick={handleOnSubmitComment}
          className="flex justify-center items-center bg-blue-500 rounded-full p-1 cursor-pointer"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
      {showMoreComment && (
        <div
          className={`px-4 ml-5 items-start justify-start mt-2 mb-2 flex flex-col text-sm text-gray-500 max-h-84 overflow-y-auto`}
        >
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet</p>
          )}
        </div>
      )}
      {isShareBoxOpen && (
        <div className="absolute w-full h-screen ">
          <Share
            post={post}
            postUrl={postUrl}
            onCloseShareBox={onCloseShareBox}
          />
        </div>
      )}
    </div>
  );
};

export default Post;
