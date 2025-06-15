import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
    const location = useLocation();
    const isAuthPage = ["/login", "/"].includes(location.pathname);

    // 🔁 Custom backend login
    const localToken = localStorage.getItem("token");
    const localRole = localStorage.getItem("role");


    const localName = localStorage.getItem("name");
    const displayName = user?.name || user?.email || localName || localRole?.toUpperCase() || "Guest";


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        logout({ returnTo: window.location.origin });
    };

    const isLoggedIn = isAuthenticated || localToken;

    return (
        <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
            <div className="text-xl font-bold">🚀 MyApp</div>

            {!isAuthPage && (
                <>
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm sm:text-base">{displayName}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => loginWithRedirect()}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Login
                        </button>
                    )}
                </>
            )}
        </nav>
    );
};

export default Navbar;
