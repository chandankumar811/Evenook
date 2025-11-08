import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Otp from "./Otp.page";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isOtpBoxOpen, setIsOtpBoxOpen] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/session",
        formData
      );
      if (response.status === 200) {
        setIsOtpBoxOpen(true);
      }
      console.log("user registered:", response.data);
    } catch (error) {
      console.error("Registration failed:", error.response.data.messgae);
      alert("Registration failed: " + error.response.data.messgae);
    }
  };

  return (
    <div className="flex relative w-full h-screen justify-center items-center">
      <div className="flex flex-col lg:w-1/3 md:w-2/4 w-full rounded-xl bg-white shadow-md shadow-gray-300 md:p-4">
        <h1 className="text-center font-bold text-3xl text-blue-500">
          Register in your account
        </h1>
        <form className="flex flex-col mx-4 my-8 gap-6" onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-md font-semibold">
              User Name
            </label>
            <input
              type="text"
              placeholder="evenook"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="flex h-9 ring-1 ring-black p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-md font-semibold">
              Email
            </label>
            <input
              type="Email"
              placeholder="evenook@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="flex h-9 ring-1 ring-black p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-md">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="flex h-9 ring-1 ring-black p-2"
            />
          </div>
          <button
            type="submit"
            className="h-10 w-full border-0 rounded-md text-white text-md font-semibold mx-auto bg-blue-500 cursor-pointer"
          >
            Register
          </button>
        </form>
        <div className="mx-4 flex justify-center items-center gap-x-2">
          <span className="">Already have Account?</span>
          <Link
            to="/login-user"
            className="text-center decoration-0 text-sm text-blue-500 cursor-pointer"
          >
            Sign in account
          </Link>
        </div>
      </div>
      {isOtpBoxOpen && (
        <div className="absolute w-full h-screen ">
          <Otp email={formData.email} />
        </div>
      )}
    </div>
  );
};

export default Register;
