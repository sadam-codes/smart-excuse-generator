import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

const loginHandler = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:4000/api/auth/login", {
      email,
      password,
    });
    const { token, role, name } = res.data;  // <-- get name here
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name || "Guest"); // store name from backend
    toast.success("Login successful!");
    navigate(role === "admin" ? "/admin" : "/pdf");
  } catch {
    toast.error("Invalid credentials");
  }
};


  const handleGoogleLogin = async () => {
    await loginWithRedirect({ connection: "google-oauth2" });
  };

  useEffect(() => {
    const authenticateWithYourBackend = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          const { name, email } = user;

          const res = await axios.post("http://localhost:4000/api/auth/google-auth", {
            name,
            email,
          });

          const { token: myToken, role } = res.data;
          localStorage.setItem("token", myToken);
          localStorage.setItem("role", role);
          navigate(role === "admin" ? "/admin" : "/pdf");
        } catch (err) {
          toast.error("Google login failed");
          console.error(err);
        }
      }
    };
    authenticateWithYourBackend();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={loginHandler}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border rounded-md"
            required
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md pr-10"
              required
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
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold mb-4"
          >
            Login
          </button>
        </form>

        <div className="text-center mb-4 text-gray-500">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-black text-white py-3 rounded-md font-semibold"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6">
          Don't have an account?
          <Link to="/" className="text-blue-600 hover:underline ml-1">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
