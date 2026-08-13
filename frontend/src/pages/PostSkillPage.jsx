import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Loader2, Eye, Sparkles, RefreshCw, ChevronLeft,
} from "lucide-react";
import SkillForm from "../components/SkillForm";
import {
  createSkill, updateSkill, deleteSkill,
  fetchMySkills, toggleSkillStatus,
} from "../lib/skillsApi";
import { useAuth } from "../context/authcontext";

// ── Badge helpers ──────────────────────────────────────────────────────────────
const categoryColors = {
  TECHNICAL: "bg-blue-900/50 text-blue-300 border-blue-700/50",
  DESIGN: "bg-pink-900/50 text-pink-300 border-pink-700/50",
  COMMUNICATION: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
  MANAGEMENT: "bg-green-900/50 text-green-300 border-green-700/50",
  LANGUAGE: "bg-purple-900/50 text-purple-300 border-purple-700/50",
  SOFT_SKILL: "bg-orange-900/50 text-orange-300 border-orange-700/50",
  OTHER: "bg-slate-800 text-slate-400 border-slate-700/50",
};

// ── Component ──────────────────────────────────────────────────────────────────
const PostSkillPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [skills, setSkills] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // ── Fetch own skills ─────────────────────────────────────────────────────────
  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMySkills({ limit: 50 });
      setSkills(data.skills || []);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to load your skills.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // ── Create ───────────────────────────────────────────────────────────────────
  const handleCreate = async (payload) => {
    setIsSubmitting(true);
    try {
      const data = await createSkill(payload);
      toast.success("Skill published successfully! 🎉");
      setSkills((prev) => [data.skill, ...prev]);
      setView("list");
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to create skill.";
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────────
  const handleUpdate = async (payload) => {
    if (!editTarget?.id) return;
    setIsSubmitting(true);
    try {
      const data = await updateSkill(editTarget.id, payload);
      toast.success("Skill updated successfully!");
      setSkills((prev) =>
        prev.map((s) => (s.id === editTarget.id ? data.skill : s))
      );
      setView("list");
      setEditTarget(null);
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to update skill.";
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteSkill(id);
      toast.success("Skill deleted.");
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete skill.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────────────
  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const data = await toggleSkillStatus(id);
      toast.success(data.message);
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: data.skill.isActive } : s))
      );
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to toggle status.");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        {/* ── Page header ── */}
        {view === "list" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">My Skills</h1>
                  <p className="text-slate-400 text-sm">Manage your posted skill profiles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadSkills}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Post New Skill
                </button>
              </div>
            </div>

            {/* ── Skills list ── */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                <p className="text-slate-400 text-sm">Loading your skills...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-3xl">💡</div>
                <div>
                  <p className="text-white font-semibold text-lg">No skills posted yet</p>
                  <p className="text-slate-400 text-sm mt-1">Share your skills with the community and get discovered!</p>
                </div>
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Post Your First Skill
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`rounded-2xl bg-slate-900/60 border backdrop-blur-md p-5 flex items-start justify-between gap-4 transition-all ${
                      skill.isActive
                        ? "border-slate-800/80"
                        : "border-slate-800/40 opacity-60"
                    }`}
                  >
                    {/* Left */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3 className="font-bold text-white text-base truncate">{skill.name}</h3>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${categoryColors[skill.category] || categoryColors.OTHER}`}
                        >
                          {skill.category}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            skill.isActive
                              ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {skill.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {skill.description && (
                        <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                          {skill.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        {(skill.hourlyRate != null || skill.rateType) && (
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
                            {skill.rateType === "FREE" || skill.hourlyRate === 0
                              ? "Free Service"
                              : skill.rateType === "NEGOTIABLE"
                              ? "Negotiable"
                              : `${skill.hourlyRate != null ? `$${skill.hourlyRate}` : ""}${
                                  skill.rateType === "FIXED"
                                    ? "/project"
                                    : skill.rateType === "DAILY"
                                    ? "/day"
                                    : skill.rateType === "MONTHLY"
                                    ? "/mo"
                                    : "/hr"
                                }`}
                          </span>
                        )}
                        {skill.availability && <span>⏰ {skill.availability}</span>}
                        {skill.experience && <span>🏅 {skill.experience}</span>}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {skill.viewCount} views
                        </span>
                        <span className="text-slate-600">
                          {new Date(skill.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Toggle */}
                      <button
                        onClick={() => handleToggle(skill.id)}
                        disabled={togglingId === skill.id}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer disabled:opacity-50"
                        title={skill.isActive ? "Deactivate" : "Activate"}
                      >
                        {togglingId === skill.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : skill.isActive ? (
                          <ToggleRight className="w-5 h-5 text-violet-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => { setEditTarget(skill); setView("edit"); }}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-900/30 transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(skill.id)}
                        disabled={deletingId === skill.id}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-900/30 transition-all cursor-pointer disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === skill.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Create form ── */}
        {view === "create" && (
          <div>
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to My Skills
            </button>
            <SkillForm
              onSubmit={handleCreate}
              onCancel={() => setView("list")}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* ── Edit form ── */}
        {view === "edit" && editTarget && (
          <div>
            <button
              onClick={() => { setView("list"); setEditTarget(null); }}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to My Skills
            </button>
            <SkillForm
              initialData={editTarget}
              onSubmit={handleUpdate}
              onCancel={() => { setView("list"); setEditTarget(null); }}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSkillPage;
