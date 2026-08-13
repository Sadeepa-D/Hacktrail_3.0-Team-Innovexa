import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserManagement from "../components/admin/UserManagement";
import SkillManagement from "../components/admin/SkillManagement";
import OpportunityManagement from "../components/admin/OpportunityManagement";
import {
  Users,
  Sparkles,
  Briefcase,
  ShieldCheck,
  LogOut,
  Mail,
  ChevronRight,
  User,
  Activity,
  Layers,
  Sparkle
} from "lucide-react";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Active Main Navigation: "user" | "skill" | "opportunity"
  const [activeTab, setActiveTab] = useState("user");

  // Protect route (redirect if unauthenticated)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  const getAdminName = () => {
    if (user?.fname || user?.lname) {
      return `${user?.fname || ""} ${user?.lname || ""}`.trim();
    }
    return "Administrator";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex flex-col selection:bg-violet-500 selection:text-white">
      {/* Header Component */}
      <Header />

      {/* Ambient background lighting */}
      <div className="absolute top-24 left-[-10%] w-[35rem] h-[35rem] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[35rem] h-[35rem] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* ========================================================================= */}
        {/* TOP HEADER SECTION (Sketch: Left = Admin Details Box, Right = Admin Avatar) */}
        {/* ========================================================================= */}
        <div className="mb-8 bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500" />
          
          {/* Top Left: Admin's Basic Information Box */}
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-violet-950 text-violet-300 border border-violet-800/60 uppercase tracking-widest">
                  {user?.role || "ADMIN CONTROL CENTER"}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  System Live
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {getAdminName()}
              </h1>
              <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-violet-400" />
                {user?.email || "admin@skillora.dev"}
              </p>
            </div>
          </div>

          {/* Top Right: Large Admin Avatar Circle (Exact match to sketch circle 👤) */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-xl shadow-violet-600/30 ring-4 ring-slate-900 border-2 border-violet-400/40 overflow-hidden flex-shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.fname?.[0] || user?.email?.[0] || "A").toUpperCase()}</span>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800/50 text-slate-300 transition-all flex items-center justify-center cursor-pointer shadow-md"
              title="Sign Out Admin"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD LAYOUT: Left Sidebar (3 Main Buttons) + Right Content Area  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT NAVIGATION SIDEBAR (User mng, Skill mng, Opportunity mng buttons) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-4 shadow-xl flex flex-col gap-2 relative overflow-hidden">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 px-3 pt-2 pb-1">
                Admin Management Menu
              </span>

              {/* Main Button 1: User Management */}
              <button
                onClick={() => setActiveTab("user")}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "user"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === "user" ? "translate-x-0.5 text-white" : "text-slate-500"}`} />
              </button>

              {/* Main Button 2: Skills Management */}
              <button
                onClick={() => setActiveTab("skill")}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "skill"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Skills Management</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === "skill" ? "translate-x-0.5 text-white" : "text-slate-500"}`} />
              </button>

              {/* Main Button 3: Opportunity Management */}
              <button
                onClick={() => setActiveTab("opportunity")}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "opportunity"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4" />
                  <span>Opportunity Management</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === "opportunity" ? "translate-x-0.5 text-white" : "text-slate-500"}`} />
              </button>
            </div>
          </aside>

          {/* MIDDLE / RIGHT CONTENT AREA (Dynamically renders the active management component) */}
          <div className="lg:col-span-8">
            {activeTab === "user" && <UserManagement />}
            {activeTab === "skill" && <SkillManagement />}
            {activeTab === "opportunity" && <OpportunityManagement />}
          </div>

        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
