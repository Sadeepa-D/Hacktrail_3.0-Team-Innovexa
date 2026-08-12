import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Skills from "./pages/skills";
import Opportunities from "./pages/opportunities";
import PostSkillPage from "./pages/PostSkillPage";
import PostOpportunityPage from "./pages/PostOpportunityPage";
import Profile from "./pages/profile";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #334155",
            borderRadius: "0.75rem",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />

        {/* User management routes (Protected) */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/post-skill" element={<ProtectedRoute><PostSkillPage /></ProtectedRoute>} />
        <Route path="/post-opportunity" element={<ProtectedRoute><PostOpportunityPage /></ProtectedRoute>} />

        {/* Fallback & default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
};

export default App;
