import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X, Mail, Phone, Building2, MapPin, DollarSign,
  ShieldCheck, MessageSquare, Send, Award, Clock, ExternalLink, Tag
} from "lucide-react";
import { openDirectMessageWithUser } from "./ChatMessengerPopup";
import { useAuth } from "../context/authcontext";
import { applyToOpportunity } from "../lib/opportunitiesApi";
import toast from "react-hot-toast";

const OpportunityUserModal = ({ selectedOpp, onClose }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  if (!selectedOpp) return null;

  const company = selectedOpp.companyname || "Featured Employer";
  const locationText = selectedOpp.isRemote
    ? "Remote Position"
    : selectedOpp.location || "Location Flexible";

  const posterName =
    selectedOpp.user?.fname || selectedOpp.user?.lname
      ? `${selectedOpp.user?.fname || ""} ${selectedOpp.user?.lname || ""}`.trim()
      : "Opportunity Poster";

  const avatarUrl = selectedOpp.user?.avatarUrl;
  const email = selectedOpp.contactEmail || selectedOpp.user?.email || "No email listed";
  const phone = selectedOpp.contactPhone || "No phone listed";

  const handleMessagePoster = () => {
    const targetUser = selectedOpp.user || {
      id: selectedOpp.userId,
      fname: posterName,
      avatarUrl,
    };

    if (!currentUser) {
      toast.error("Please sign in to send direct messages.");
      navigate("/login");
      return;
    }

    if (targetUser.id && currentUser.id === targetUser.id) {
      toast.error("This is your own posted opportunity.");
      return;
    }

    onClose();
    openDirectMessageWithUser(targetUser);
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in to apply for opportunities.");
      navigate("/login");
      return;
    }

    try {
      setIsApplying(true);
      await applyToOpportunity(selectedOpp.id, {
        coverLetter: coverLetter.trim() || undefined,
      });
      toast.success("Application submitted successfully! 🎉");
      setShowApplyForm(false);
      onClose();
    } catch (err) {
      console.error("Apply error:", err);
      toast.error(err.response?.data?.error || "Failed to submit application.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up z-10 text-slate-100 font-sans max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/60 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Top Row: Verification & Type */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Opportunity
            </span>
            <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {selectedOpp.type || "JOB"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
            {selectedOpp.title}
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap mb-6">
            <span className="flex items-center gap-1.5 text-violet-400 font-semibold">
              <Building2 className="w-4 h-4" /> {company}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400" /> {locationText}
            </span>
            {selectedOpp.salary != null && (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Tag className="w-4 h-4" /> Rs. {selectedOpp.salary}
                {selectedOpp.salaryMax ? ` - Rs. ${selectedOpp.salaryMax}` : ""}
                {selectedOpp.salaryType ? ` / ${selectedOpp.salaryType.toLowerCase()}` : ""}
              </span>
            )}
          </div>

          {/* Description */}
          {selectedOpp.description && (
            <div className="mb-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/70">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Job Description & Details
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedOpp.description}
              </p>
            </div>
          )}

          {/* Requirements & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {selectedOpp.experience && (
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3">
                <Award className="w-5 h-5 text-violet-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Experience Level</span>
                  <span className="text-xs text-slate-200 font-semibold">{selectedOpp.experience}</span>
                </div>
              </div>
            )}

            {selectedOpp.education && (
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Education Required</span>
                  <span className="text-xs text-slate-200 font-semibold">{selectedOpp.education}</span>
                </div>
              </div>
            )}

            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <Mail className="w-5 h-5 text-violet-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Contact Email</span>
                <span className="text-xs text-slate-200 font-semibold truncate block">{email}</span>
              </div>
            </div>

            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Contact Phone</span>
                <span className="text-xs text-slate-200 font-semibold">{phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Apply Form Accordion */}
          {showApplyForm && (
            <form onSubmit={handleApply} className="bg-violet-950/40 border border-violet-800/50 p-4 rounded-2xl mb-6 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                Submit Your Application
              </h4>
              <textarea
                rows={3}
                placeholder="Include a short cover note or application message for the recruiter..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-3 bg-slate-950/80 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isApplying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-950/80 p-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {selectedOpp.user?.id ? (
            <Link
              to={`/profile/${selectedOpp.user.id}`}
              onClick={onClose}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Posted by {posterName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleMessagePoster}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-violet-400" />
              <span>Direct Message</span>
            </button>

            <button
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Apply Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityUserModal;
