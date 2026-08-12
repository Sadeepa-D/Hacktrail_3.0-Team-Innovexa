import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import api from "../context/apiinstance";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  User,
  Briefcase,
  Sparkles,
  Lock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShieldCheck,
  KeyRound,
  Trash2,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle2,
  LogOut,
  Building2,
  ChevronRight,
  Compass,
  Layers
} from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, fetchProfile, signOut } = useAuth();
  const navigate = useNavigate();

  // Active tab state: "profile" | "skills" | "opportunities"
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    fname: "",
    lname: "",
    phone: "",
    gender: "",
    city: "",
    dob: "",
    avatarUrl: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Posted Skills State
  const [mySkills, setMySkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Posted Opportunities State
  const [myOpportunities, setMyOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Populate profile fields when user context loads
  useEffect(() => {
    if (user) {
      setProfileData({
        fname: user.fname || "",
        lname: user.lname || "",
        phone: user.phone || "",
        gender: user.gender || "",
        city: user.city || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  // Load My Skills & Opportunities
  useEffect(() => {
    fetchMySkills();
    fetchMyOpportunities();
  }, []);

  useEffect(() => {
    if (activeTab === "skills") {
      fetchMySkills();
    } else if (activeTab === "opportunities") {
      fetchMyOpportunities();
    }
  }, [activeTab]);

  const fetchMySkills = async () => {
    try {
      setLoadingSkills(true);
      const res = await api.get("/skill/my");
      setMySkills(res.data?.skills || res.data || []);
    } catch (err) {
      console.error("Failed to load user skills:", err);
      setMySkills([]);
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchMyOpportunities = async () => {
    try {
      setLoadingOpportunities(true);
      const res = await api.get("/opportunity/my");
      setMyOpportunities(res.data?.opportunities || res.data || []);
    } catch (err) {
      console.error("Failed to load user opportunities:", err);
      setMyOpportunities([]);
    } finally {
      setLoadingOpportunities(false);
    }
  };

  // Handle Profile Update Submit
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      await api.put("/user/profile", {
        fname: profileData.fname.trim() || null,
        lname: profileData.lname.trim() || null,
        phone: profileData.phone.trim() || null,
        gender: profileData.gender || null,
        city: profileData.city.trim() || null,
        dob: profileData.dob ? new Date(profileData.dob).toISOString() : null,
        avatarUrl: profileData.avatarUrl.trim() || null,
      });

      toast.success("Profile updated successfully! 🎉");
      if (fetchProfile) await fetchProfile();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.error || err.message || "Failed to update profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Update Submit
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await api.put("/user/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password update error:", err);
      toast.error(err.response?.data?.error || err.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle Skill Status Toggle
  const handleToggleSkill = async (skillId) => {
    try {
      await api.patch(`/skill/${skillId}/toggle`);
      toast.success("Skill status updated!");
      fetchMySkills();
    } catch (err) {
      console.error("Failed to toggle skill status:", err);
      toast.error("Could not update skill status.");
    }
  };

  // Handle Skill Delete
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.delete(`/skill/${skillId}`);
      toast.success("Skill deleted.");
      setMySkills((prev) => prev.filter((s) => s.id !== skillId));
    } catch (err) {
      console.error("Failed to delete skill:", err);
      toast.error("Failed to delete skill.");
    }
  };

  // Handle Opportunity Delete
  const handleDeleteOpportunity = async (oppId) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      await api.delete(`/opportunity/${oppId}`);
      toast.success("Opportunity deleted.");
      setMyOpportunities((prev) => prev.filter((o) => o.id !== oppId));
    } catch (err) {
      console.error("Failed to delete opportunity:", err);
      toast.error("Failed to delete opportunity.");
    }
  };

  // Handle Opportunity Status Change
  const handleOpportunityStatusChange = async (oppId, newStatus) => {
    try {
      await api.patch(`/opportunity/${oppId}/status`, { status: newStatus });
      toast.success("Opportunity status updated!");
      fetchMyOpportunities();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status.");
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  const getFullName = () => {
    if (user?.fname || user?.lname) {
      return `${user?.fname || ""} ${user?.lname || ""}`.trim();
    }
    return "User Account";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex flex-col selection:bg-violet-500 selection:text-white">
      {/* Header */}
      <Header />

      {/* Ambient Background Glows */}
      <div className="absolute top-24 left-[-10%] w-[35rem] h-[35rem] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[35rem] h-[35rem] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Layout Grid matching user sketch: Full Height Left Navigation + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR (Full height vertical container matching sketch) */}
          {/* ============================================================ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start flex flex-col gap-5">
            
            {/* Navigation & Dashboard Tabs Card */}
            <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-500" />
              
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 px-3 pt-2 pb-1">
                Account Navigation
              </span>

              {/* Tab 1: Profile & Account */}
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Profile & Account</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === "profile" ? "translate-x-0.5 text-white" : "text-slate-500"}`} />
              </button>

              {/* Tab 2: My Posted Skills */}
              <button
                onClick={() => setActiveTab("skills")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "skills"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  <span>My Posted Skills</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "skills" ? "bg-white/20 text-white" : "bg-slate-800 text-violet-400"}`}>
                  {mySkills.length}
                </span>
              </button>

              {/* Tab 3: My Posted Opportunities */}
              <button
                onClick={() => setActiveTab("opportunities")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "opportunities"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4" />
                  <span>My Opportunities</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "opportunities" ? "bg-white/20 text-white" : "bg-slate-800 text-indigo-400"}`}>
                  {myOpportunities.length}
                </span>
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Post & Share
              </span>
              <Link
                to="/post-skill"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-violet-600/20 border border-slate-700/60 hover:border-violet-500/50 text-white text-xs font-semibold transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Post New Skill
                </span>
                <PlusCircle className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                to="/post-opportunity"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-indigo-600/20 border border-slate-700/60 hover:border-indigo-500/50 text-white text-xs font-semibold transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Post Opportunity
                </span>
                <PlusCircle className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Platform Feeds Link Card */}
            <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Explore Feeds
              </span>
              <Link
                to="/skills"
                className="flex items-center justify-between text-xs text-slate-300 hover:text-violet-400 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-violet-400" />
                  Skill Feeds
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <Link
                to="/opportunities"
                className="flex items-center justify-between text-xs text-slate-300 hover:text-indigo-400 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Opportunity Feeds
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>

            {/* Sign Out Button Card at bottom */}
            <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 shadow-xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Account Protected</span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-2xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </aside>

          {/* ============================================================ */}
          {/* RIGHT CONTENT AREA (Matching user sketch: Avatar top, Form card below) */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* TOP CENTER: Large Centered Avatar & Profile Info (Exact match to sketch circle 👤) */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl relative overflow-hidden">
              {/* Large Centered Avatar Circle */}
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-2xl shadow-violet-600/40 ring-4 ring-slate-900 border-2 border-violet-400/40 overflow-hidden mb-4 relative group">
                {profileData.avatarUrl ? (
                  <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user?.fname?.[0] || user?.email?.[0] || "U").toUpperCase()}</span>
                )}
              </div>

              {/* User Name, Email & Role Badges */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                {getFullName()}
              </h1>
              
              <p className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5 justify-center">
                <Mail className="w-3.5 h-3.5 text-violet-400" />
                <span>{user?.email}</span>
              </p>

              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-violet-950 text-violet-300 border border-violet-800/60 uppercase tracking-wider">
                  {user?.role || "USER"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Profile
                </span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* TAB 1: Profile & Account Form Card (Form lines + "up" button at bottom right) */}
            {/* ============================================================ */}
            {activeTab === "profile" && (
              <div className="flex flex-col gap-8">
                
                {/* User Details Form Card (sketch: rounded box with input lines & bottom right 'up' button) */}
                <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                  
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                    <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Personal Information</h2>
                      <p className="text-slate-400 text-xs">Update your personal account details</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="flex flex-col gap-5">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">First Name</label>
                        <input
                          type="text"
                          value={profileData.fname}
                          onChange={(e) => setProfileData({ ...profileData, fname: e.target.value })}
                          placeholder="John"
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lname}
                          onChange={(e) => setProfileData({ ...profileData, lname: e.target.value })}
                          placeholder="Doe"
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70"
                        />
                      </div>
                    </div>

                    {/* Email (Read only) & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full px-4 py-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-400 text-sm cursor-not-allowed"
                          />
                          <span className="absolute right-3 top-3 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium">Verified</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70"
                        />
                      </div>
                    </div>

                    {/* Date of Birth, Gender, City */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Date of Birth</label>
                        <input
                          type="date"
                          value={profileData.dob}
                          onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Gender</label>
                        <select
                          value={profileData.gender}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 cursor-pointer"
                        >
                          <option value="" className="bg-slate-900">Select gender</option>
                          <option value="Male" className="bg-slate-900">Male</option>
                          <option value="Female" className="bg-slate-900">Female</option>
                          <option value="Other" className="bg-slate-900">Other</option>
                          <option value="Prefer not to say" className="bg-slate-900">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">City / Location</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70"
                        />
                      </div>
                    </div>

                    {/* Avatar URL */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Avatar Image URL</label>
                      <input
                        type="url"
                        value={profileData.avatarUrl}
                        onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70"
                      />
                    </div>

                    {/* Update ('up') Button at Bottom Right (Exact sketch match) */}
                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Update Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Change Card */}
                <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Security & Password</h2>
                      <p className="text-slate-400 text-xs">Update your account password</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Minimum 6 characters"
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                        />
                      </div>
                    </div>

                    {/* Update Password Button at Bottom Right */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer border border-slate-700 disabled:opacity-60"
                      >
                        {isUpdatingPassword ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Update Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 2: My Posted Skills */}
            {activeTab === "skills" && (
              <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">My Posted Skills</h2>
                      <p className="text-slate-400 text-xs">Manage skills & services you are offering</p>
                    </div>
                  </div>

                  <Link
                    to="/post-skill"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 hover:from-violet-500 hover:to-indigo-500 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post New Skill</span>
                  </Link>
                </div>

                {loadingSkills ? (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    <span className="text-sm">Loading your posted skills...</span>
                  </div>
                ) : mySkills.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl p-8">
                    <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-300">No Skills Posted Yet</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1 mb-6">
                      Share your skills with the community to get connected for opportunities.
                    </p>
                    <Link
                      to="/post-skill"
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all inline-flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Your First Skill</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {mySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-violet-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-950/60 text-violet-300 border border-violet-800/50">
                              {skill.category || "OTHER"}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${skill.isActive ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                              {skill.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white">{skill.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{skill.description || "No description provided."}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                            {skill.hourlyRate && (
                              <span className="text-emerald-400 font-semibold">${skill.hourlyRate}/hr</span>
                            )}
                            {skill.phonenum && (
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{skill.phonenum}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleSkill(skill.id)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Toggle active status"
                          >
                            {skill.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 hover:border-rose-800/50 transition-colors cursor-pointer"
                            title="Delete skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: My Posted Opportunities */}
            {activeTab === "opportunities" && (
              <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">My Posted Opportunities</h2>
                      <p className="text-slate-400 text-xs">Manage job & project postings</p>
                    </div>
                  </div>

                  <Link
                    to="/post-opportunity"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 hover:from-indigo-500 hover:to-violet-500 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Opportunity</span>
                  </Link>
                </div>

                {loadingOpportunities ? (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <span className="text-sm">Loading your posted opportunities...</span>
                  </div>
                ) : myOpportunities.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl p-8">
                    <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-300">No Opportunities Posted Yet</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1 mb-6">
                      Post jobs, internships, or project contracts for talent in the community.
                    </p>
                    <Link
                      to="/post-opportunity"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all inline-flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Your First Opportunity</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {myOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                              {opp.type || "JOB"}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                              {opp.category || "OTHER"}
                            </span>
                            {opp.isRemote && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400">
                                Remote
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-white">{opp.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            {opp.companyname && (
                              <span className="flex items-center gap-1 text-slate-300"><Building2 className="w-3 h-3 text-indigo-400" />{opp.companyname}</span>
                            )}
                            {opp.location && (
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" />{opp.location}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <select
                            value={opp.status || "OPEN"}
                            onChange={(e) => handleOpportunityStatusChange(opp.id, e.target.value)}
                            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none cursor-pointer"
                          >
                            <option value="OPEN" className="bg-slate-900">Open</option>
                            <option value="DRAFT" className="bg-slate-900">Draft</option>
                            <option value="CLOSED" className="bg-slate-900">Closed</option>
                            <option value="FILLED" className="bg-slate-900">Filled</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOpportunity(opp.id)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 hover:border-rose-800/50 transition-colors cursor-pointer"
                            title="Delete opportunity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
