import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus, Pencil, Trash2, Loader2, Eye, Briefcase,
  RefreshCw, ChevronLeft, CheckCircle2, XCircle, Clock,
} from "lucide-react";
import OpportunityForm from "../components/OpportunityForm";
import {
  createOpportunity, updateOpportunity, deleteOpportunity,
  fetchMyOpportunities, updateOpportunityStatus,
} from "../lib/opportunitiesApi";
import { useAuth } from "../context/authcontext";

// ── Badge helpers ──────────────────────────────────────────────────────────────
const statusConfig = {
  DRAFT:     { label: "Draft",     cls: "bg-slate-800 text-slate-400 border-slate-700/50" },
  OPEN:      { label: "Open",      cls: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50" },
  CLOSED:    { label: "Closed",    cls: "bg-rose-900/50 text-rose-300 border-rose-700/50" },
  FILLED:    { label: "Filled",    cls: "bg-blue-900/50 text-blue-300 border-blue-700/50" },
  EXPIRED:   { label: "Expired",   cls: "bg-orange-900/50 text-orange-300 border-orange-700/50" },
  CANCELLED: { label: "Cancelled", cls: "bg-slate-800 text-slate-500 border-slate-700/40" },
};

const typeColors = {
  JOB:       "💼",
  INTERNSHIP:"🎓",
  FREELANCE: "💻",
  PART_TIME: "⏳",
  FULL_TIME: "🕒",
  VOLUNTEER: "🤝",
  PROJECT:   "🚀",
};

// ── Component ──────────────────────────────────────────────────────────────────
const PostOpportunityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [opportunities, setOpportunities] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusChangingId, setStatusChangingId] = useState(null);

  // ── Fetch my opportunities ───────────────────────────────────────────────────
  const loadOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMyOpportunities({ limit: 50 });
      setOpportunities(data.opportunities || []);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to load opportunities.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // ── Create ───────────────────────────────────────────────────────────────────
  const handleCreate = async (payload) => {
    setIsSubmitting(true);
    try {
      const data = await createOpportunity(payload);
      toast.success("Opportunity published! 🎉");
      setOpportunities((prev) => [data.opportunity, ...prev]);
      setView("list");
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to create opportunity.";
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
      const data = await updateOpportunity(editTarget.id, payload);
      toast.success("Opportunity updated!");
      setOpportunities((prev) =>
        prev.map((o) => (o.id === editTarget.id ? data.opportunity : o))
      );
      setView("list");
      setEditTarget(null);
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to update.";
      toast.error(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this opportunity? All applications will also be removed.")) return;
    setDeletingId(id);
    try {
      await deleteOpportunity(id);
      toast.success("Opportunity deleted.");
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Quick status toggle (OPEN ↔ CLOSED) ──────────────────────────────────────
  const handleQuickStatus = async (opportunity) => {
    const newStatus = opportunity.status === "OPEN" ? "CLOSED" : "OPEN";
    setStatusChangingId(opportunity.id);
    try {
      const data = await updateOpportunityStatus(opportunity.id, newStatus);
      toast.success(data.message);
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === opportunity.id ? { ...o, status: data.opportunity.status } : o
        )
      );
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update status.");
    } finally {
      setStatusChangingId(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">My Opportunities</h1>
                  <p className="text-slate-400 text-sm">Manage your posted job & opportunity listings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadOpportunities}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Post Opportunity
                </button>
              </div>
            </div>

            {/* ── Opportunity list ── */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-slate-400 text-sm">Loading opportunities...</p>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-3xl">💼</div>
                <div>
                  <p className="text-white font-semibold text-lg">No opportunities posted yet</p>
                  <p className="text-slate-400 text-sm mt-1">Start hiring or finding collaborators by posting an opportunity.</p>
                </div>
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Post First Opportunity
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {opportunities.map((opp) => {
                  const sc = statusConfig[opp.status] || statusConfig.DRAFT;
                  return (
                    <div
                      key={opp.id}
                      className={`rounded-2xl bg-slate-900/60 border backdrop-blur-md p-5 flex items-start justify-between gap-4 transition-all ${
                        opp.status === "OPEN"
                          ? "border-slate-800/80"
                          : "border-slate-800/40 opacity-70"
                      }`}
                    >
                      {/* Left content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-base">{typeColors[opp.type] || "💼"}</span>
                          <h3 className="font-bold text-white text-base truncate">{opp.title}</h3>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${sc.cls}`}>
                            {sc.label}
                          </span>
                        </div>

                        {opp.companyname && (
                          <p className="text-slate-400 text-sm mb-1">🏢 {opp.companyname}</p>
                        )}

                        {opp.description && (
                          <p className="text-slate-500 text-sm line-clamp-2 mb-2">{opp.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                          {opp.location && <span>📍 {opp.location}</span>}
                          {opp.isRemote && <span className="text-indigo-400">🌐 Remote</span>}
                          {opp.salary != null && (
                            <span className="text-emerald-400 font-semibold">
                              ${opp.salary}{opp.salaryMax ? ` – $${opp.salaryMax}` : ""} / {opp.salaryType}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {opp.viewCount}
                          </span>
                          {(opp._count?.applications ?? opp.applicationCount) > 0 && (
                            <span className="text-violet-400 font-semibold">
                              {opp._count?.applications ?? opp.applicationCount} applicant(s)
                            </span>
                          )}
                          <span className="text-slate-600">
                            {new Date(opp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Quick open/close toggle */}
                        <button
                          onClick={() => handleQuickStatus(opp)}
                          disabled={statusChangingId === opp.id}
                          className={`p-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
                            opp.status === "OPEN"
                              ? "text-emerald-400 hover:text-rose-300 hover:bg-rose-900/30"
                              : "text-slate-500 hover:text-emerald-300 hover:bg-emerald-900/30"
                          }`}
                          title={opp.status === "OPEN" ? "Close listing" : "Re-open listing"}
                        >
                          {statusChangingId === opp.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : opp.status === "OPEN" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => { setEditTarget(opp); setView("edit"); }}
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-900/30 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(opp.id)}
                          disabled={deletingId === opp.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-900/30 transition-all cursor-pointer disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === opp.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── CREATE VIEW ── */}
        {view === "create" && (
          <div>
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to My Opportunities
            </button>
            <OpportunityForm
              onSubmit={handleCreate}
              onCancel={() => setView("list")}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* ── EDIT VIEW ── */}
        {view === "edit" && editTarget && (
          <div>
            <button
              onClick={() => { setView("list"); setEditTarget(null); }}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to My Opportunities
            </button>
            <OpportunityForm
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

export default PostOpportunityPage;
