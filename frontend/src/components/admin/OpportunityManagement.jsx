import React, { useState, useEffect } from "react";
import api from "../../context/apiinstance";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Lock,
  Search,
  Trash2,
  Check,
  Building2,
  MapPin,
  Loader2,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

const OpportunityManagement = () => {
  const [category, setCategory] = useState("draft");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/opportunities");
      setOpportunities(res.data?.opportunities || []);
    } catch (err) {
      console.error("Fetch admin opportunities error:", err);
      setOpportunities([]);
      toast.error("Could not load opportunities list.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (oppId, newStatus) => {
    try {
      const res = await api.patch(`/admin/opportunities/${oppId}/status`, { status: newStatus });
      const updatedOpp = res.data?.opportunity;
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === oppId
            ? {
                ...o,
                status: newStatus,
                isVerified: updatedOpp ? updatedOpp.isVerified : newStatus === "OPEN",
              }
            : o
        )
      );
      toast.success(
        newStatus === "OPEN"
          ? "Opportunity approved & published to public feeds!"
          : `Opportunity status updated to ${newStatus}.`
      );
    } catch (err) {
      console.error("Update opportunity status error:", err);
      toast.error("Failed to update opportunity status.");
    }
  };

  const handleDeleteOpportunity = async (oppId) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      await api.delete(`/admin/opportunities/${oppId}`);
      setOpportunities((prev) => prev.filter((o) => o.id !== oppId));
      toast.success("Opportunity deleted.");
    } catch (err) {
      console.error("Delete opportunity error:", err);
      toast.error("Failed to delete opportunity.");
    }
  };

  const filteredOpportunities = opportunities.filter((o) => {
    const oppStatus = (o.status || "DRAFT").toLowerCase();
    const isVerified = Boolean(o.isVerified);
    let matchesCategory = false;
    if (category === "open") {
      matchesCategory = isVerified && oppStatus === "open";
    } else if (category === "draft") {
      matchesCategory = !isVerified || oppStatus === "draft" || oppStatus === "pending";
    } else if (category === "closed") {
      matchesCategory = oppStatus === "closed" || oppStatus === "filled" || oppStatus === "expired" || oppStatus === "cancelled";
    }

    const matchesSearch =
      o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.companyname?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCount = (catKey) =>
    opportunities.filter((o) => {
      const oppStatus = (o.status || "DRAFT").toLowerCase();
      const isVerified = Boolean(o.isVerified);
      if (catKey === "open") return isVerified && oppStatus === "open";
      if (catKey === "draft") return !isVerified || oppStatus === "draft" || oppStatus === "pending";
      if (catKey === "closed") return oppStatus === "closed" || oppStatus === "filled" || oppStatus === "expired" || oppStatus === "cancelled";
      return false;
    }).length;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Opportunity Category Buttons */}
      <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 shadow-lg">
        {/* Drafts & Pending Review */}
        <button
          onClick={() => setCategory("draft")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "draft"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Drafts & Pending Review</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-amber-400 font-extrabold border border-amber-500/30">
            {getCount("draft")}
          </span>
        </button>

        {/* Open & Active */}
        <button
          onClick={() => setCategory("open")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "open"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Open & Active</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-emerald-400 font-extrabold border border-emerald-500/30">
            {getCount("open")}
          </span>
        </button>

        {/* Closed & Filled */}
        <button
          onClick={() => setCategory("closed")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            category === "closed"
              ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-800/40"
              : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80"
          }`}
        >
          <Lock className="w-4 h-4 text-slate-300" />
          <span>Closed & Filled</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/80 text-slate-400 font-extrabold border border-slate-700/50">
            {getCount("closed")}
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
            placeholder="Search opportunities by title or company..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800/90 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
        </div>
        <button
          onClick={fetchOpportunities}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Opportunity Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="text-sm">Loading opportunities list...</span>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8 bg-slate-900/40">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No {category.toUpperCase()} Opportunities Found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
            There are currently no opportunity listings under the "{category}" status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((o) => (
            <div
              key={o.id}
              className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                      {o.type || "JOB"}
                    </span>
                    {o.isRemote && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400">
                        Remote
                      </span>
                    )}
                  </div>
                  {o.salary != null && (
                    <span className="text-emerald-400 text-xs font-bold">
                      Rs. {o.salary.toLocaleString()}{o.salaryMax ? ` – Rs. ${o.salaryMax.toLocaleString()}` : ""}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white">{o.title}</h4>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  {o.companyname && (
                    <span className="flex items-center gap-1 text-slate-300"><Building2 className="w-3 h-3 text-indigo-400" />{o.companyname}</span>
                  )}
                  {o.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" />{o.location}</span>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {category !== "open" && (
                    <button
                      onClick={() => handleStatusChange(o.id, "OPEN")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}
                  {category !== "closed" && (
                    <button
                      onClick={() => handleStatusChange(o.id, "CLOSED")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Close Listing</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteOpportunity(o.id)}
                  className="p-1.5 rounded-lg bg-slate-950 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 transition-colors cursor-pointer"
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
  );
};

export default OpportunityManagement;
