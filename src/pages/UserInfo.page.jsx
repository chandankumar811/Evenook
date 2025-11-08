import axios from "axios";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserInfo = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    accountType: "", // Default value
    gender: "",
    institutionLevel: "",
    program: "",
    department: "",
    clubType: "",
    instituteName: "",
    bio: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Account type options
  const accountTypes = ["personal", "club", "institution"];
  const genderOptions = ["male", "female", "other"];
  const institutionLevels = [
    "university",
    "college",
    "high school",
    "primary school",
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (!avatarFile) {
      setError("Avatar image is required");
      setLoading(false);
      return;
    }

    // Check if all text fields are filled
    const hasEmptyFields = Object.values(formData).some(
      (field) => !field || field.trim() === ""
    );
    if (hasEmptyFields) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Create form data for file upload
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // try {
      //   const response = await axios.post(
      //     `http://localhost:8000/api/v1/users/u/create-user-info/${userId}`,
      //     { formData, avatarFile, coverImageFile }
      //   );
      //   if(response.status === 200){
      //     if (response.status === 200) {
      //       console.log("Otp verified", response.data);
      //     }
      //   }
      // } catch (error) {
      //   console.error("Registration failed:", error.response.data.messgae);
      //   alert("Registration failed: " + error.response.data.messgae);
      // }
  

      // Add files
      formDataToSend.append("avatar", avatarFile);
      if (coverImageFile) {
        formDataToSend.append("coverImage", coverImageFile);
      }

      // Send API request
        const response = await axios.post(`http://localhost:8000/api/v1/users/u/create-user-info/${userId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      setSuccess("Profile updated successfully");
      setTimeout(() => {
        navigate("/login-user");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          <p className="text-blue-100">
            Please provide all the required information
          </p>
        </div>
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 m-4"
            role="alert"
          >
            <p>{success}</p>
          </div>
        )}

        <form action="" onSubmit={handleSubmit} className="p-6">
          <div className=" space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Profile Picture (Required)
                </label>
                <div className="flex items-center">
                  <div className="mr-4">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="h-24 w-24 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Select Image
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image (Optional)
                </label>
                <div className="flex items-center w-full">
                  <div className="flex lg:items-center  w-full flex-col lg:flex-row md:justify-start justify-center md:gap-y-0 gap-y-6">
                    <div className="mr-4 w-full max-w-xs">
                      {coverImagePreview ? (
                        <img
                          src={coverImagePreview}
                          alt="Cover Preview"
                          className="h-24 w-full object-cover rounded-md border-2 border-blue-500"
                        />
                      ) : (
                        <div className="h-24 w-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="coverImage"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="coverImage"
                        className="cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Select Image
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="accountType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select account type
                  </option>
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="institutionLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Institution Level
                </label>
                <select
                  id="institutionLevel"
                  name="institutionLevel"
                  value={formData.institutionLevel}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select institution level
                  </option>
                  {institutionLevels.map((level) => (
                    <option key={level} value={level}>
                      {level
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="program"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Program
                </label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your program of study"
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your department"
                />
              </div>

              <div>
                <label
                  htmlFor="clubType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Club Type
                </label>
                <input
                  type="text"
                  id="clubType"
                  name="clubType"
                  value={formData.clubType}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type of club"
                />
              </div>
              <div>
                <label
                  htmlFor="instituteName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Institute Name
                </label>
                <input
                  type="text"
                  id="instituteName"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                  focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Name of your institution"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300
                rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell us about yourself"
              ></textarea>
            </div>
            <div className="w-full flex">
              <button
                type="submit"
                disabled={loading}
                className={`py-2 w-full px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {" "}
                {loading ? <div>Loading...</div> : <div>Submit</div>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
