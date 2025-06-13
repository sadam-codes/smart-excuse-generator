
// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import EyeSlashIcon from '@heroicons/react/24/outline/EyeSlashIcon';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const loginHandler = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Login successful!");

      if (role === "admin") navigate("/admin");
      else navigate("/pdf");
    } catch {
      toast.error("Invalid credentials");
    }
  };



  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </span>
        </div>
        <button
          onClick={loginHandler}
          className="w-full bg-black text-white py-3 rounded-md font-semibold"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4">
          Don't have an account?
          <Link to="/" className="text-blue-600 hover:underline">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
