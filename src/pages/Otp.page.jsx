import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Otp = ({ email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalOTP = otp.join("");
      setIsVerifying(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/verify-otp",
        { email, otp: finalOTP }
      );
      if (response.status === 200) {
        setIsVerifying(false);
        setSuccess(true);

        console.log("Otp verified");
      }
    } catch (error) {
      console.error("Registration failed:", error.response.data.messgae);
      alert("Registration failed: " + error.response.data.messgae);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/user",
        { email: email }
      );
      if (response.status === 200) {
        const { user, message } = response.data;
        const userId = user.id
        navigate(`/update-profile/${userId}`);
      }
    } catch (error) {
      console.error("Registration failed:", error.response.data.messgae);
      alert("Registration failed: " + error.response.data.messgae);
    }
  };

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle OTP input changes
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle pasting OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  // Resend OTP
  const resendOtp = () => {
    setIsResending(true);

    // Simulate API call
    setTimeout(() => {
      setTimeLeft(30);
      setIsResending(false);
      setError("");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    }, 1500);
  };

  // Verify OTP
  const verifyOtp = () => {
    if (otp.some((digit) => digit === "")) {
      setError("Please enter all digits");
      return;
    }

    setIsVerifying(true);

    // Simulate API verification
    setTimeout(() => {
      setIsVerifying(false);

      // For demo: Consider 123456 as valid OTP
      if (otp.join("") === "123456") {
        setSuccess(true);
        setError("");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[rgba(0,0,0,0.5)] flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8">
      <div
        className={`sm:mx-auto sm:w-full sm:max-w-md bg-white shadow-md shadow-gray-500 rounded-md  box-popup`}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-500">
          Verification Required
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit code to your phone
        </p>
        {/* </div> */}

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" py-8 px-6 rounded-lg sm:px-10">
            {success ? (
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Verification Successful
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  You have been successfully verified.
                </p>
                <button
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter verification code
                  </label>
                  <div className="mt-2 flex gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="appearance-none block lg:w-12 lg:h-12 md:w-10 md:h-10 w-8 h-8 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm">
                    <span className="text-gray-500">
                      Time remaining:{" "}
                      <span className="font-medium">{timeLeft}s</span>
                    </span>
                  </div>
                  <div className="text-sm">
                    <button
                      onClick={resendOtp}
                      disabled={timeLeft > 0 || isResending}
                      className={`font-medium ${
                        timeLeft > 0 || isResending
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-indigo-600 hover:text-indigo-500"
                      }`}
                    >
                      {isResending ? "Resending..." : "Resend code"}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={isVerifying || otp.some((digit) => digit === "")}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isVerifying || otp.some((digit) => digit === "")
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    }`}
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
