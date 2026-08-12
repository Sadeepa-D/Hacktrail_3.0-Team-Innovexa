import React, { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  MapPin,
  Globe,
  DollarSign,
  Calendar,
  FileText,
  Edit3,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
  Tag
} from "lucide-react";
import toast from "react-hot-toast";

const SavedOpportunity = ({
  savedOpportunity = null,
  opportunity = null,
  isSaved = true,
  onSave = null,
  onUnsave = null,
  onUpdateNotes = null,
}) => {
  // Extract data from savedOpportunity or opportunity fallback
  const opp = savedOpportunity?.opportunity || opportunity || {};
  const [notes, setNotes] = useState(savedOpportunity?.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isTogglingSave, setIsTogglingSave] = useState(false);

  const handleToggleSave = async () => {
    try {
      setIsTogglingSave(true);
      if (isSaved) {
        if (onUnsave) {
          await onUnsave(opp.id || savedOpportunity?.id);
        } else {
          toast.success("Removed from saved opportunities.");
        }
      } else {
        if (onSave) {
          await onSave(opp.id, notes);
        } else {
          toast.success("Opportunity saved successfully!");
        }
      }
    } catch (err) {
      console.error("Save opportunity toggle error:", err);
      toast.error("Failed to update bookmark.");
    } finally {
      setIsTogglingSave(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      if (onUpdateNotes) {
        await onUpdateNotes(savedOpportunity?.id || opp.id, notes);
      }
      toast.success("Saved notes updated!");
      setIsEditingNotes(false);
    } catch (err) {
      console.error("Save notes error:", err);
      toast.error("Failed to update notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const formatSalary = () => {
    if (!opp.salary && !opp.salaryMax) return null;
    const typeLabel = opp.salaryType === "HOURLY" ? "/hr" : opp.salaryType === "MONTHLY" ? "/mo" : "";
    if (opp.salary && opp.salaryMax) {
      return `$${opp.salary.toLocaleString()} - $${opp.salaryMax.toLocaleString()}${typeLabel}`;
    }
    return `$${(opp.salary || opp.salaryMax).toLocaleString()}${typeLabel}`;
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xl transition-all font-sans text-slate-200 group relative overflow-hidden">
      {/* Decorative gradient highlight on top edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 opacity-80" />

      {/* Main Row */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex-1">
          {/* Category & Type badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            {opp.type && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                {opp.type}
              </span>
            )}
            {opp.category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/50">
                {opp.category}
              </span>
            )}
            {opp.isRemote && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Remote
              </span>
            )}
          </div>

          {/* Title & Company */}
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
            {opp.title || "Untitled Opportunity"}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            {opp.companyname && (
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {opp.companyname}
              </span>
            )}
            {opp.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {opp.location}
              </span>
            )}
            {formatSalary() && (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                {formatSalary()}
              </span>
            )}
          </div>
        </div>

        {/* Bookmark Toggle Button */}
        <button
          onClick={handleToggleSave}
          disabled={isTogglingSave}
          className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
            isSaved
              ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/50 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-800/50"
              : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-700"
          }`}
          title={isSaved ? "Remove from saved opportunities" : "Save opportunity"}
        >
          {isTogglingSave ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4 fill-indigo-500 text-indigo-400" />
              <span className="hidden sm:inline">Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </button>
      </div>

      {/* Description Snippet */}
      {opp.description && (
        <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
          {opp.description}
        </p>
      )}

      {/* Saved Notes Section */}
      <div className="mt-4 pt-4 border-t border-slate-800/60 bg-slate-950/40 -mx-5 -mb-5 p-4 sm:p-5 rounded-b-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            Personal Notes
          </span>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>{notes ? "Edit Notes" : "Add Notes"}</span>
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-2 mt-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private notes (e.g. Applied on date, contact person, interview status...)"
              rows="3"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingNotes(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                {isSavingNotes ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            {notes ? notes : "No personal notes added yet. Click 'Add Notes' to keep track of applications or reminders."}
          </p>
        )}

        {/* Date Saved Footer */}
        {savedOpportunity?.createdAt && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800/40">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Saved on {new Date(savedOpportunity.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedOpportunity;
