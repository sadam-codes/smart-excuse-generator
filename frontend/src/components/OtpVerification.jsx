import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { name, email, password, role, isSignup } = location.state || {};

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/verify-otp", {
        email,
        otp,
        name,
        password,
        role,
        isSignup,
      });

      const { token } = response.data;

      toast.success("OTP verified and login/signup successful!");

      localStorage.setItem("token", token);

      if (role === "admin" || email === "admin@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/pdf");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">OTP Verification</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <button
          onClick={handleVerifyOtp}
          className="w-full bg-black text-white py-3 rounded-md font-semibold"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
