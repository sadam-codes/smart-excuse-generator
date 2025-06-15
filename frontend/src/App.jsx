import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./components/PdfUploader";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Signup from "./components/Signup";
import OtpVerification from "./components/OtpVerification";
import Navbar from "./components/Navbar"; // adjust path if needed

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />a
        <Route path="/login" element={<Login />} />
        <Route path="/pdf" element={<Chat />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/otp" element={<OtpVerification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
