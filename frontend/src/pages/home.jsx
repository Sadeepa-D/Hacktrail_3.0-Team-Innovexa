import React from "react";
import { useAuth } from "../context/authcontext";
import { LogOut, User, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully.");
    navigate("/login", { replace: true });
  };

  const displayName =
    user?.fname && user?.lname
      ? `${user.fname} ${user.lname}`
      : user?.fname || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-xl sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-wide">HackTrail 3.0</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/70 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 transition-all text-sm font-medium cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full p-6 md:p-10 flex flex-col gap-6">
        {/* Welcome card */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/20 p-8 backdrop-blur-xl shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">{displayName}</span>!
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            You are successfully logged in to the Team Innovexa platform. Your JWT session is active.
          </p>
        </div>

        {/* User info card */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 flex items-center gap-4 backdrop-blur-md">
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg text-white font-bold text-xl shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{displayName}</p>
            <p className="text-slate-400 text-sm truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
              {user?.role || "USER"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
