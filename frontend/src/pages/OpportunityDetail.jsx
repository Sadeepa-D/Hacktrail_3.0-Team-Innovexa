import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchAllOpportunities } from "../lib/opportunitiesApi";
import {
  ArrowLeft,
  Building2,
  Phone,
  Search,
  Loader2,
  Sparkles,
  ShieldCheck,
  MapPin,
  DollarSign,
  Briefcase,
  ChevronRight,
  Award,
} from "lucide-react";
import OpportunityUserModal from "../components/OpportunityUserModal";
import toast from "react-hot-toast";

const OPP_TYPE_META = {
  JOB: {
    name: "Standard Employment & Jobs",
    description:
      "Explore employment roles, career positions, and permanent jobs.",
    accentColor: "from-blue-500 to-cyan-400",
    bgGlow: "bg-blue-600/15",
    shadowColor: "shadow-blue-500/20",
  },
  INTERNSHIP: {
    name: "Internships & Traineeships",
    description:
      "Kickstart your career with learning-based work opportunities.",
    accentColor: "from-emerald-500 to-teal-400",
    bgGlow: "bg-emerald-600/15",
    shadowColor: "shadow-emerald-500/20",
  },
  FREELANCE: {
    name: "Freelance & Contract Work",
    description: "Find independent contract work and short-term freelancing.",
    accentColor: "from-violet-500 to-purple-400",
    bgGlow: "bg-violet-600/15",
    shadowColor: "shadow-violet-500/20",
  },
  PART_TIME: {
    name: "Part-Time Positions",
    description: "Flexible jobs that fit around your personal commitments.",
    accentColor: "from-orange-500 to-amber-400",
    bgGlow: "bg-orange-600/15",
    shadowColor: "shadow-orange-500/20",
  },
  FULL_TIME: {
    name: "Full-Time Careers",
    description: "Long-term 40-hour work week roles with full benefits.",
    accentColor: "from-pink-500 to-rose-400",
    bgGlow: "bg-pink-600/15",
    shadowColor: "shadow-pink-500/20",
  },
  VOLUNTEER: {
    name: "Volunteer & Community",
    description: "Give back to the community and build your experience.",
    accentColor: "from-red-500 to-rose-500",
    bgGlow: "bg-red-600/15",
    shadowColor: "shadow-red-500/20",
  },
  PROJECT: {
    name: "Project Milestones & Gigs",
    description:
      "Collaborate on short-term milestones and specialized projects.",
    accentColor: "from-yellow-500 to-orange-400",
    bgGlow: "bg-yellow-600/15",
    shadowColor: "shadow-yellow-500/20",
  },
};

const OpportunityDetail = () => {
  const { category } = useParams();

  // Convert route parameter (e.g. "part-time" or "part_time" -> "PART_TIME")
  const typeEnum = category ? category.toUpperCase().replace(/-/g, "_") : "JOB";

  const meta = OPP_TYPE_META[typeEnum] || OPP_TYPE_META.JOB;

  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState(null);

  // Load verified open opportunities from database
  const loadCategoryOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllOpportunities({
        type: typeEnum,
        search: searchQuery.trim() || undefined,
        isVerified: "true", // Only verified opportunities in public view
        limit: 50,
      });
      setOpportunities(data.opportunities || []);
    } catch (err) {
      console.error("Fetch opportunities error:", err);
      toast.error("Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  }, [typeEnum, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCategoryOpportunities();
  }, [loadCategoryOpportunities]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Background Glows */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] ${meta.bgGlow} rounded-full blur-[120px] pointer-events-none`}
      />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 flex-1">
        {/* Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            to="/opportunities"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Opportunity Types
          </Link>

          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs md:max-w-sm group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${meta.name.toLowerCase()}...`}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-lg backdrop-blur-sm text-sm"
            />
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-violet-300 text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Category: {meta.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Verified{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${meta.accentColor}`}
            >
              {meta.name.split(" ")[0]} Positions
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            {meta.description} (Only verified postings are visible).
          </p>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-slate-400 text-sm">
              Fetching verified opportunities from database...
            </p>
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {opportunities.map((opp) => {
              const company = opp.companyname || "Featured Employer";
              const locationText = opp.isRemote
                ? "Remote"
                : opp.location || "On-site";

              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className={`bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 hover:-translate-y-1.5 transition-all duration-300 group shadow-xl ${meta.shadowColor} hover:border-violet-500/40 flex flex-col justify-between cursor-pointer relative overflow-hidden`}
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                        {opp.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-violet-300 transition-colors line-clamp-2">
                      {opp.title}
                    </h3>

                    {/* Company & Location */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-3">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{company}</span>
                    </div>

                    {opp.description && (
                      <p className="text-slate-400 text-xs line-clamp-3 mb-4">
                        {opp.description}
                      </p>
                    )}
                  </div>

                  {/* Card Footer Details */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2 mt-auto">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-400 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />{" "}
                        {locationText}
                      </span>
                      {opp.salary != null && (
                        <span className="font-bold text-emerald-400 shrink-0">
                          ${opp.salary}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      {opp.contactPhone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />{" "}
                          {opp.contactPhone}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-500" /> Open
                          Role
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
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-slate-600 opacity-50" />
            <h3 className="text-lg font-bold text-white mb-1">
              No Verified Opportunities Found
            </h3>
            <p className="text-sm text-slate-400">
              {searchQuery
                ? `No verified positions in ${meta.name} matching "${searchQuery}".`
                : `No verified postings have been approved for ${meta.name} yet.`}
            </p>
          </div>
        )}
      </main>

      <Footer />

      {/* Opportunity Detail & Apply Modal */}
      <OpportunityUserModal
        selectedOpp={selectedOpp}
        onClose={() => setSelectedOpp(null)}
      />
    </div>
  );
};

export default OpportunityDetail;
