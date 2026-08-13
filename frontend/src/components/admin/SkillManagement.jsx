import React, { useState, useEffect } from "react";
import api from "../../context/apiinstance";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  EyeOff,
  Search,
  Trash2,
  Check,
  Phone,
  Loader2,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

const SkillManagement = () => {
  const [category, setCategory] = useState("pending");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/skills");
      setSkills(res.data?.skills || []);
    } catch (err) {
      console.error("Fetch admin skills error:", err);
      setSkills([]);
      toast.error("Could not load skills list.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySkill = async (skillId, verifyState) => {
    try {
      await api.put(`/admin/skills/${skillId}/verify`, {
        isVerified: verifyState,
      });
      setSkills((prev) =>
        prev.map((s) =>
          s.id === skillId ? { ...s, isVerified: verifyState } : s,
        ),
      );
      toast.success(
        verifyState
          ? "Skill verified & approved!"
          : "Verification status updated.",
      );
    } catch (err) {
      console.error("Verify skill error:", err);
      toast.error("Failed to update skill verification.");
    }
  };

  const handleToggleSkillActive = async (skillId) => {
    try {
      await api.patch(`/admin/skills/${skillId}/toggle`);
      setSkills((prev) =>
        prev.map((s) =>
          s.id === skillId ? { ...s, isActive: !s.isActive } : s,
        ),
      );
      toast.success("Skill active status updated.");
    } catch (err) {
      console.error("Toggle skill active error:", err);
      toast.error("Failed to toggle active status.");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill listing?"))
      return;
    try {
      await api.delete(`/admin/skills/${skillId}`);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      toast.success("Skill listing deleted.");
    } catch (err) {
      console.error("Delete skill error:", err);
      toast.error("Failed to delete skill.");
    }
  };

  const filteredSkills = skills.filter((s) => {
    let skillCat = !s.isActive
      ? "inactive"
      : s.isVerified
        ? "verified"
        : "pending";
    const matchesCategory = skillCat === category;
    const matchesSearch =
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCount = (catKey) =>
    skills.filter((s) => {
      let skillCat = !s.isActive
        ? "inactive"
        : s.isVerified
          ? "verified"
          : "pending";
      return skillCat === catKey;
    }).length;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Skill Category Buttons */}
      <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 shadow-lg">
        <button
          onClick={() => setCategory("pending")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "pending"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Pending Verification</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-amber-400 font-extrabold border border-amber-500/30">
            {getCount("pending")}
          </span>
        </button>

        <button
          onClick={() => setCategory("verified")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "verified"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Verified Skills</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-emerald-400 font-extrabold border border-emerald-500/30">
            {getCount("verified")}
          </span>
        </button>

        <button
          onClick={() => setCategory("inactive")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "inactive"
              ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-800/40"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <EyeOff className="w-4 h-4 text-slate-300" />
          <span>Inactive / Hidden</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-slate-400 font-extrabold border border-slate-700/50">
            {getCount("inactive")}
          </span>
        </button>
      </div>

      {/* Search & Refresh Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800/90 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/70"
          />
        </div>
        <button
          onClick={fetchSkills}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Skill Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <span className="text-sm">Loading skills list...</span>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8 bg-slate-900/40">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">
            No {category.toUpperCase()} Skills Found
          </h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
            There are currently no skill listings under the "{category}" status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-4 hover:border-slate-700/80 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-950/70 text-violet-300 border border-violet-800/50">
                    {s.category || "OTHER"}
                  </span>
                  {(s.hourlyRate != null || s.rateType) && (
                    <span className="text-emerald-400 text-xs font-bold bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
                      {s.rateType === "FREE" || s.hourlyRate === 0
                        ? "Free Service"
                        : s.rateType === "NEGOTIABLE"
                        ? "Negotiable"
                        : `Rs. ${s.hourlyRate != null ? s.hourlyRate : ""}${
                            s.rateType === "FIXED"
                              ? " / Project"
                              : s.rateType === "DAILY"
                              ? " / Day"
                              : s.rateType === "MONTHLY"
                              ? " / Month"
                              : " / Hour"
                          }`}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  {s.name}
                  {s.isVerified && (
                    <ShieldCheck
                      className="w-4 h-4 text-emerald-400"
                      title="Verified Skill"
                    />
                  )}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {s.description || "No description."}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {s.phonenum}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!s.isVerified && (
                    <button
                      onClick={() => handleVerifySkill(s.id, true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleSkillActive(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{s.isActive ? "Disable" : "Enable"}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteSkill(s.id)}
                  className="p-1.5 rounded-lg bg-slate-950 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 transition-colors cursor-pointer"
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
  );
};

export default SkillManagement;
