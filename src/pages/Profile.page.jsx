import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  School,
  Users,
  Info,
  MapPin,
  Award,
} from "lucide-react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import CreatePost from "../components/feed/CreatePost";
import Post from "../components/feed/Post.feed";
import { AppContext } from "../App";

const ProfilePage = () => {
  const { reload, setReload } = useOutletContext();
  const [userData, setUserData] = useState([]);
  const [post, setPost] = useState([]);
  const { userId } = useParams();
  const { user } = useContext(AppContext);

  // console.log(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileRes = await axios.get(
          `http://localhost:8000/api/v1/users/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (profileRes.status === 200) {
          setUserData(profileRes.data.data);
        }

        const postRes = await axios.get(
          `http://localhost:8000/api/v1/post/user-post/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (postRes.status === 200) {
          setPost(postRes.data.data);
        }
        // console.log(postRes.data.data);

        // Check responses
        if (profileRes.status === 200) setUserData(profileRes.data.data);
        if (postRes.status === 200) setPost(postRes.data.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchUserData();
  }, [userId, reload]);

  // console.log(userData);
  // console.log(post);

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-50">
      {/* Cover Image Area */}
      <div className="relative h-64 overflow-hidden rounded-t-lg">
        <img
          src={userData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Top profile info */}
        <div className="absolute top-4 right-6 flex items-center bg-white/90 px-4 py-2 rounded-full shadow-md">
          <Mail className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium">{userData.email}</span>
        </div>
      </div>

      {/* Profile Main Section */}
      <div className="relative px-6 pb-8">
        {/* Avatar */}
        <div className="absolute -top-16 left-8 ring-4 ring-white rounded-full">
          <img
            src={userData.avatar}
            alt="user"
            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>

        {/* Action buttons */}
        {user.id === userId ? (
          <div className="flex justify-end pt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 font-medium shadow-sm hover:bg-blue-700 transition">
              Update
            </button>
          </div>
        ) : (
          <div className="flex justify-end pt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 font-medium shadow-sm hover:bg-blue-700 transition">
              Connect
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-300 transition">
              Message
            </button>
          </div>
        )}

        {/* Name and Basic Info */}
        <div className="mt-16">
          <h1 className="text-3xl font-bold text-gray-800">
            {userData.fullName}
          </h1>
          <div className="flex items-center mt-1 text-gray-600">
            <User className="h-4 w-4 mr-1" />
            <span className="text-sm mr-4">@{userData.username}</span>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {userData.accountType}
            </span>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed">{userData.bio}</p>
        </div>

        {/* Profile Details Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold text-xl text-gray-800 mb-4 border-b pb-2">
              Academic Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <School className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Institution</p>
                  <p className="font-medium text-gray-800">
                    {userData.instituteName}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Award className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-medium text-gray-800">
                    {userData.institutionLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium text-gray-800">
                    {userData.program}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">
                    {userData.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold text-xl text-gray-800 mb-4 border-b pb-2">
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Club Type</p>
                  <p className="font-medium text-gray-800">
                    {userData.clubType}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">{userData.gender}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium text-gray-800">
                    {userData.accountType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <CreatePost />
        </div>

        <div className="space-y-4">
          {post.length > 0 &&
            post.map((item) => (
              <div key={item.id} className=" bg-white rounded-xl shadow-sm">
                <Post key={item.id} post={item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
