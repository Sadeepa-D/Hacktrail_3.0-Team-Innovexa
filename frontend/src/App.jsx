import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Skills from "./pages/skills";

import Register from "./pages/register";
import Home from "./pages/home";
import ProtectedRoute from "./components/ProtectedRoute";
import SkillForm from "./components/SkillForm";
import OpportunityForm from "./components/OpportunityForm";

import SavedOpportunity from "./components/SavedOpportunity";


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
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/home" element={<Home />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />

        <Route path="/skillform" element={<SkillForm />} />
              <Route path="/opportunities" element={<OpportunityForm />} />
              <Route path="/saved-opportunities" element={<SavedOpportunity />} />


      </Routes>
    </>
  );
};

export default App;
