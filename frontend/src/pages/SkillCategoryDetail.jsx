import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchAllSkills } from "../lib/skillsApi";
import {
  ArrowLeft, User, Phone, Search, Loader2, Sparkles,
  DollarSign, Clock, Award, Tag, Briefcase, ChevronRight
} from "lucide-react";
import SkillUserDetails from "../components/SkillUserDetails";
import toast from "react-hot-toast";

const CATEGORY_META = {
  TECHNICAL: {
    name: "Technical & Software",
    description: "Programming, web development, software engineering, and data analysis.",
    accentColor: "from-blue-500 to-cyan-400",
    bgGlow: "bg-blue-600/15",
    shadowColor: "shadow-blue-500/20",
  },
  DESIGN: {
    name: "UI/UX & Creative Design",
    description: "Graphic design, UI/UX design, video editing, 3D modeling, and digital art.",
    accentColor: "from-pink-500 to-rose-400",
    bgGlow: "bg-pink-600/15",
    shadowColor: "shadow-pink-500/20",
  },
  COMMUNICATION: {
    name: "Communication & PR",
    description: "Content writing, public relations, public speaking, and translation.",
    accentColor: "from-emerald-500 to-teal-400",
    bgGlow: "bg-emerald-600/15",
    shadowColor: "shadow-emerald-500/20",
  },
  MANAGEMENT: {
    name: "Project & Product Management",
    description: "Agile project management, product strategy, leadership, and administration.",
    accentColor: "from-orange-500 to-amber-400",
    bgGlow: "bg-orange-600/15",
    shadowColor: "shadow-orange-500/20",
  },
  LANGUAGE: {
    name: "Languages & Linguistics",
    description: "Bilingual translation, interpretation, and language teaching.",
    accentColor: "from-violet-500 to-purple-400",
    bgGlow: "bg-violet-600/15",
    shadowColor: "shadow-violet-500/20",
  },
  SOFT_SKILL: {
    name: "Soft Skills & Leadership",
    description: "Teamwork, problem-solving, empathy, public speaking, and adaptability.",
    accentColor: "from-yellow-500 to-orange-400",
    bgGlow: "bg-yellow-600/15",
    shadowColor: "shadow-yellow-500/20",
  },
  OTHER: {
    name: "General & Diverse Talents",
    description: "Unique talents, specialized services, and diverse skills.",
    accentColor: "from-red-500 to-rose-500",
    bgGlow: "bg-red-600/15",
    shadowColor: "shadow-red-500/20",
  },
};

const SkillCategoryDetail = () => {
  const { category } = useParams();

  // Convert route param (e.g. "soft-skill" -> "SOFT_SKILL")
  const categoryEnum = category
    ? category.toUpperCase().replace(/-/g, "_")
    : "TECHNICAL";

  const meta = CATEGORY_META[categoryEnum] || CATEGORY_META.OTHER;

  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Load skills from backend API according to selected category and search term
  const loadCategorySkills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllSkills({
        category: categoryEnum,
        search: searchQuery.trim() || undefined,
        limit: 50,
      });
      setSkills(data.skills || []);
    } catch (err) {
      console.error("Fetch category skills error:", err);
      toast.error("Failed to load skills for this category.");
    } finally {
      setLoading(false);
    }
  }, [categoryEnum, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCategorySkills();
  }, [loadCategorySkills]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Background Glows */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] ${meta.bgGlow} rounded-full blur-[120px] pointer-events-none`}
      />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 flex-1">
        {/* Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            to="/skills"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Categories
          </Link>

          {/* Category Search Bar */}
          <div className="relative w-full sm:max-w-xs md:max-w-sm group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${meta.name}...`}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-lg backdrop-blur-sm text-sm"
            />
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-violet-300 text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Category: {meta.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Available{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${meta.accentColor}`}>
              {meta.name.split(" ")[0]} Skills
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            {meta.description}
          </p>
        </div>

        {/* Skills Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-slate-400 text-sm">Fetching skills from database...</p>
          </div>
        ) : skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skills.map((skill) => {
              const skillerName =
                skill.user?.fname || skill.user?.lname
                  ? `${skill.user?.fname || ""} ${skill.user?.lname || ""}`.trim()
                  : "Community Skiller";

              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 hover:-translate-y-1.5 transition-all duration-300 group shadow-xl ${meta.shadowColor} hover:border-violet-500/40 flex flex-col justify-between cursor-pointer relative overflow-hidden`}
                >
                  <div>
                    {/* Header: Icon & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.accentColor} flex items-center justify-center text-white shadow-lg transform group-hover:scale-105 transition-transform`}>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                        {skill.category}
                      </span>
                    </div>

                    {/* Skill Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
                      {skill.name}
                    </h3>

                    {/* Description preview */}
                    {skill.description && (
                      <p className="text-slate-400 text-xs line-clamp-3 mb-4">
                        {skill.description}
                      </p>
                    )}
                  </div>

                  {/* Skiller Details Footer */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {skill.user?.avatarUrl ? (
                          <img
                            src={skill.user.avatarUrl}
                            alt={skillerName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-violet-500/40"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {skillerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {skillerName}
                        </span>
                      </div>

                      {skill.hourlyRate != null && (
                        <span className="text-xs font-bold text-emerald-400 shrink-0">
                          ${skill.hourlyRate}/hr
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      {skill.availability ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {skill.availability}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" /> {skill.phonenum}
                        </span>
                      )}
                      <span className="text-violet-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        Details <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-600 opacity-50" />
            <h3 className="text-lg font-bold text-white mb-1">No Skills Found</h3>
            <p className="text-sm text-slate-400">
              {searchQuery
                ? `No skills in ${meta.name} matching "${searchQuery}".`
                : `No active skills have been posted under ${meta.name} yet.`}
            </p>
          </div>
        )}
      </main>

      <Footer />

      {/* Skiller Detail Modal */}
      <SkillUserDetails
        selectedSkill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
  );
};

export default SkillCategoryDetail;
