import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import EyeSlashIcon from '@heroicons/react/24/outline/EyeSlashIcon';
import { useAuth0 } from "@auth0/auth0-react";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    // 🔁 Google Auth Flow Handler
    useEffect(() => {
        const handleGoogleSignup = async () => {
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
                    toast.error("Google signup failed");
                    console.error(err);
                }
            }
        };
        handleGoogleSignup();
    }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

    const handleSignup = async () => {
        try {
            await axios.post("http://localhost:4000/api/auth/send-otp", { email });
            toast.success("OTP sent to your email!");
            navigate("/otp", {
                state: { name, email, password, role, isSignup: true },
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleGoogleSignup = async () => {
        await loginWithRedirect({ connection: "google-oauth2" });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Toaster />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4 p-3 border rounded-md"
                />
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
                    onClick={handleSignup}
                    className="w-full bg-black text-white py-3 rounded-md font-semibold"
                >
                    Signup
                </button>

                <div className="text-center my-4 text-gray-500">or</div>

                <button
                    onClick={handleGoogleSignup}
                    className="w-full bg-black text-white py-3 rounded-md font-semibold"
                >
                    Continue with Google
                </button>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
