import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Calendar,
  Sparkles,
  Briefcase,
  Award,
  Clock,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchPublicProfile } from "../lib/searchApi";
import { openDirectMessageWithUser } from "../components/ChatMessengerPopup";
import { useAuth } from "../context/authcontext";
import toast from "react-hot-toast";

const categoryColors = {
  TECHNICAL: "bg-blue-900/50 text-blue-300 border-blue-700/50",
  DESIGN: "bg-pink-900/50 text-pink-300 border-pink-700/50",
  COMMUNICATION: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
  MANAGEMENT: "bg-green-900/50 text-green-300 border-green-700/50",
  LANGUAGE: "bg-purple-900/50 text-purple-300 border-purple-700/50",
  SOFT_SKILL: "bg-orange-900/50 text-orange-300 border-orange-700/50",
  OTHER: "bg-slate-800 text-slate-400 border-slate-700/50",
};

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills");

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchPublicProfile(id);
        setProfileUser(data.user);
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast.error("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProfile();
    }
  }, [id]);

  const handleOpenChat = () => {
    if (!currentUser) {
      toast.error("Please sign in to send direct messages.");
      navigate("/login");
      return;
    }
    if (currentUser.id === profileUser.id) {
      toast.error("You cannot message yourself.");
      return;
    }
    openDirectMessageWithUser(profileUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading user profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
        <Header />
        <main className="pt-32 pb-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-slate-400 mb-6">
            The requested user profile does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all"
          >
            Return to Home
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const fullName =
    profileUser.fname || profileUser.lname
      ? `${profileUser.fname || ""} ${profileUser.lname || ""}`.trim()
      : "Community Member";

  const memberSince = profileUser.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative z-10 flex-1">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Card Header */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 pointer-events-none">
            <div className="h-32 w-32 bg-violet-600/10 rounded-full blur-2xl" />
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              {profileUser.avatarUrl ? (
                <img
                  src={profileUser.avatarUrl}
                  alt={fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-violet-500/40 shadow-xl shadow-violet-950/50"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-violet-950/50 border border-violet-400/30">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {fullName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-xs font-semibold self-center sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5" /> Public Profile
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-400 mt-2">
                  {profileUser.city && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      {profileUser.city}
                    </span>
                  )}
                  {memberSince && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      Member since {memberSince}
                    </span>
                  )}
                </div>

                {/* Stat Counters */}
                <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 pt-4 border-t border-slate-800/80">
                  <div className="text-center sm:text-left">
                    <span className="text-lg font-bold text-white block">
                      {profileUser.skills?.length || 0}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      Posted Skills
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-center sm:text-left">
                    <span className="text-lg font-bold text-white block">
                      {profileUser.opportunities?.length || 0}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      Opportunities
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Message Trigger Button */}
            {(!currentUser || currentUser.id !== profileUser.id) && (
              <button
                onClick={handleOpenChat}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer shrink-0 border border-violet-400/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message User</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
