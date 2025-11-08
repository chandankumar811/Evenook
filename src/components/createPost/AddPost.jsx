import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Image,
  MapPin,
  Tag,
  Smile,
  Calendar,
  Clock,
  ChevronDown,
  Send,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    postFile: "",
  });

  const [postFile, setPostFile] = useState(null);
  const [postFilePreview, setPostFilePreview] = useState(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  let state = location.state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const postFile = e.target.files[0];
    if (postFile) {
      setPostFile(postFile);
      setPostFilePreview(URL.createObjectURL(postFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataTosend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataTosend.append(key, formData[key]);
      });

      if (postFile) {
        formDataTosend.append("postFile", postFile);
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/post/create-post",
        formDataTosend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Clicked");

      console.log(response.status);

      if (response.status === 200) {
        setSuccess("Post created successfully");
        handleCloseAddPost();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  // console.log(success)

  // This function opens the file selection dialog
  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (state === "image") {
      if (fileInputRef.current) {
        fileInputRef.current.click();
        state = "";
      }
    }
    console.log("run 2");
  }, []);

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseAddPost = () => {
    navigate(-1);
  };

  

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPrivacyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" mx-auto rounded-lg shadow-md p-4 justify-center items-center">
      <div className="bg-white rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Create Post</h2>
          <button
            onClick={handleCloseAddPost}
            className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center mb-4">
          <img
            src="/vite.svg"
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex gap-10">
            <p className="font-semibold">X_AE_A-13</p>

            {/* Privacy Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1"
                onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
              >
                <span>Public</span>
                <ChevronDown size={16} className="ml-1" />
              </button>

              {isPrivacyOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium">
                      Public
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Only me
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full h-9 outline-none text-lg font-semibold border-b"
            placeholder="Title"
          />
          <textarea
            className="w-full border-none outline-none resize-none text-lg"
            rows={5}
            placeholder="What's on your mind?"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="image-upload"
        />

        {/* Image Preview (if selected) */}
        {postFilePreview && (
          <div className="relative mb-4">
            <img
              src={postFilePreview}
              alt="Post preview"
              className="w-full rounded-lg object-contain max-h-64"
            />
            <button
              className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 text-white rounded-full p-1"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Add to Post */}
        <div className="border rounded-lg p-3 mb-4">
          <div className="font-medium text-gray-700 mb-2">Add to your post</div>
          <div className="flex">
            {/* This button triggers the file input dialog */}
            <button
              className="p-2 text-green-500 hover:bg-gray-100 rounded-full mr-1"
              onClick={handleSelectFileClick}
              aria-label="Add image"
            >
              <Image size={24} />
            </button>
            <button className="p-2 text-yellow-500 hover:bg-gray-100 rounded-full mr-1">
              <Tag size={24} />
            </button>
            <button className="p-2 text-orange-500 hover:bg-gray-100 rounded-full mr-1">
              <Smile size={24} />
            </button>
            <button className="p-2 text-red-500 hover:bg-gray-100 rounded-full mr-1">
              <MapPin size={24} />
            </button>
            <button className="p-2 text-purple-500 hover:bg-gray-100 rounded-full mr-1">
              <Calendar size={24} />
            </button>
            <button className="p-2 text-blue-500 hover:bg-gray-100 rounded-full">
              <Clock size={24} />
            </button>
          </div>
        </div>

        {/* Hashtags Suggestions */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">Suggested hashtags</div>
          <div className="flex flex-wrap gap-2">
            <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-sm cursor-pointer">
              #ux
            </span>
            <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-sm cursor-pointer">
              #design
            </span>
            <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-sm cursor-pointer">
              #product
            </span>
            <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-sm cursor-pointer">
              #machinelearning
            </span>
          </div>
        </div>

        {/* Post Button */}
        <button
          className={`w-full py-2 rounded-lg flex items-center justify-center ${
            formData.title || formData.description || postFilePreview
              ? "bg-blue-500 text-white cursor-pointer"
              : "bg-gray-200 text-gray-500"
          }`}
          // disabled={!formData.title && !formData.postFile && !formData.description}
          onClick={handleSubmit}
        >
          <Send size={18} className="mr-2" />
          Post
        </button>
      </div>
    </div>
  );
};

export default AddPost;
