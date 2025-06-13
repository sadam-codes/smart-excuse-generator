
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    toast.error("Token not found, please login");
    navigate("/login");
    return;
  }

  if (role !== "admin") {
    toast.error("Access denied: You are not an admin");
    navigate("/login");
    return;
  }

  axios
    .get("http://localhost:4000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setUsers(res.data))
    .catch((err) => {
      console.error("Failed to fetch users:", err);
      toast.error("Session expired. Login again.");
      navigate("/login");
    });
}, []);


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel - User Details</h2>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No users found or loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
