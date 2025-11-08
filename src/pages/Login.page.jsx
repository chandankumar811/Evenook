import axios from "axios";
import React, { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App.jsx";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AppContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/");
        console.log("Login successfull", response.data);
        console.log(document.cookie, "cookies");
      }
    } catch (error) {
      console.error("Login failed:", error.response.data.messgae);
      alert("Login failed: " + error.response.data.messgae);
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center p-3 lg:p-0">
      <div className="flex flex-col w-full md:w-2/4 lg:w-1/4 rounded-xl bg-white shadow-md shadow-gray-300 p-4">
        <h1 className="text-center font-bold text-3xl text-blue-500">
          Sign in your account
        </h1>
        <form
          action=""
          className="flex flex-col mx-4 my-8 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-md font-semibold">
              Email
            </label>
            <input
              type="Email"
              placeholder="abc@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="flex h-9 ring-1 ring-black p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="password" className="font-semibold text-md">
                Password
              </label>
              <Link
                to="#"
                className="text-xs text-orange-700 decoration-0 font-semibold"
              >
                Forget password?
              </Link>
            </div>
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
            Sign in
          </button>
        </form>
        <div className="mx-4 flex justify-center items-center gap-x-2">
          <span className="">New User?</span>
          <Link
            to="/register-new-user"
            className="text-center decoration-0 text-sm text-blue-500 cursor-pointer"
          >
            Register a new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
