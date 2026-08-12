import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  User, MapPin, Calendar, Sparkles, Briefcase,
  Award, Clock, DollarSign, Loader2, ArrowLeft,
  ChevronRight, Tag, ShieldCheck, CheckCircle2
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchPublicProfile } from "../lib/searchApi";
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

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills"); // "skills" | "opportunities"

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
          <p className="text-slate-400 mb-6">The requested user profile does not exist or has been removed.</p>
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

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
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
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Posted Skills</span>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-center sm:text-left">
                  <span className="text-lg font-bold text-white block">
                    {profileUser.opportunities?.length || 0}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 mb-6">
          <button
            onClick={() => setActiveTab("skills")}
            className={`pb-3.5 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "skills"
                ? "border-violet-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Skills ({profileUser.skills?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`pb-3.5 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "opportunities"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Opportunities ({profileUser.opportunities?.length || 0})
          </button>
        </div>

        {/* Tab 1: Skills Section */}
        {activeTab === "skills" && (
          <div>
            {!profileUser.skills || profileUser.skills.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-12 text-center">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="text-white font-semibold mb-1">No Skills Posted Yet</h3>
                <p className="text-slate-400 text-sm">This user has not listed any active skills profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileUser.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 hover:border-violet-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-white text-base leading-snug">{skill.name}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${
                            categoryColors[skill.category] || categoryColors.OTHER
                          }`}
                        >
                          {skill.category}
                        </span>
                      </div>

                      {skill.description && (
                        <p className="text-slate-400 text-sm line-clamp-3 mb-4">{skill.description}</p>
                      )}

                      {skill.qualification && (
                        <p className="text-xs text-slate-400 mb-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                          🎓 <span className="text-slate-300 font-medium">{skill.qualification}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60 mt-2">
                      {skill.hourlyRate != null ? (
                        <span className="text-emerald-400 font-bold">${skill.hourlyRate}/hr</span>
                      ) : (
                        <span>Rate negotiable</span>
                      )}
                      {skill.availability && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" /> {skill.availability}
                        </span>
                      )}
                      {skill.experience && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Award className="w-3 h-3 text-violet-400" /> {skill.experience}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Opportunities Section */}
        {activeTab === "opportunities" && (
          <div>
            {!profileUser.opportunities || profileUser.opportunities.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-12 text-center">
                <div className="text-3xl mb-2">💼</div>
                <h3 className="text-white font-semibold mb-1">No Opportunities Posted</h3>
                <p className="text-slate-400 text-sm">This user has no active job or opportunity postings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileUser.opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-white text-base leading-snug">{opp.title}</h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 font-semibold shrink-0">
                          {opp.type}
                        </span>
                      </div>

                      {opp.companyname && (
                        <p className="text-slate-400 text-xs font-semibold mb-2">🏢 {opp.companyname}</p>
                      )}

                      {opp.description && (
                        <p className="text-slate-400 text-sm line-clamp-3 mb-4">{opp.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60 mt-2">
                      {opp.salary != null ? (
                        <span className="text-emerald-400 font-bold">
                          ${opp.salary}{opp.salaryMax ? ` – $${opp.salaryMax}` : ""} / {opp.salaryType}
                        </span>
                      ) : (
                        <span>Compensation negotiable</span>
                      )}
                      {opp.isRemote && (
                        <span className="text-indigo-400 font-medium">🌐 Remote</span>
                      )}
                      {opp.location && (
                        <span className="text-slate-400 truncate max-w-[120px]">📍 {opp.location}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
