import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X, Mail, Phone, BookOpen, Briefcase, Clock,
  Award, DollarSign, MessageSquare, ExternalLink, User, ShieldCheck
} from "lucide-react";
import { openDirectMessageWithUser } from "./ChatMessengerPopup";
import { useAuth } from "../context/authcontext";
import toast from "react-hot-toast";

const SkillUserDetails = ({ selectedSkill, onClose }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  if (!selectedSkill) return null;

  const skillerName =
    selectedSkill.skiller ||
    (selectedSkill.user?.fname || selectedSkill.user?.lname
      ? `${selectedSkill.user?.fname || ""} ${selectedSkill.user?.lname || ""}`.trim()
      : "Community Skiller");

  const avatarUrl = selectedSkill.photo || selectedSkill.user?.avatarUrl;
  const email = selectedSkill.email || selectedSkill.user?.email || "No email listed";
  const phone = selectedSkill.phonenum || selectedSkill.contact || "No phone listed";
  const qualifications = selectedSkill.qualification || selectedSkill.qualifications || "Not specified";

  const handleMessageSkiller = () => {
    const targetUser = selectedSkill.user || {
      id: selectedSkill.userId,
      fname: skillerName,
      avatarUrl,
    };

    if (!currentUser) {
      toast.error("Please sign in to send direct messages.");
      navigate("/login");
      return;
    }

    if (targetUser.id && currentUser.id === targetUser.id) {
      toast.error("This is your own skill posting.");
      return;
    }

    onClose();
    openDirectMessageWithUser(targetUser);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up z-10 text-slate-100 font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/60 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            {/* Avatar */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={skillerName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-slate-800 shadow-xl flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-4xl font-black border-4 border-slate-800 shadow-xl flex-shrink-0">
                {skillerName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Skiller
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  {selectedSkill.category || "SKILL"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                {selectedSkill.name}
              </h2>
              <p className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-1.5">
                <User className="w-4 h-4 text-violet-400" /> Offered by {skillerName}
              </p>

              {/* Badges / Metrics */}
              <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap mb-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
                {selectedSkill.hourlyRate != null && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> ${selectedSkill.hourlyRate}/hr
                  </span>
                )}
                {selectedSkill.availability && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {selectedSkill.availability}
                  </span>
                )}
                {selectedSkill.experience && (
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-violet-400" /> {selectedSkill.experience}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {/* Description */}
                {selectedSkill.description && (
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    <span className="font-semibold text-slate-200 block mb-1">Description</span>
                    {selectedSkill.description}
                  </div>
                )}

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center text-slate-300 text-xs">
                    <Mail className="w-4 h-4 mr-2.5 text-violet-400 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center text-slate-300 text-xs">
                    <Phone className="w-4 h-4 mr-2.5 text-emerald-400 shrink-0" />
                    <span>{phone}</span>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="flex items-start text-slate-300 text-xs border-t border-slate-800/80 pt-3">
                  <BookOpen className="w-4 h-4 mr-2.5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Qualifications</span>
                    <span className="text-slate-400">{qualifications}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-950/80 p-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {selectedSkill.user?.id ? (
            <Link
              to={`/profile/${selectedSkill.user.id}`}
              onClick={onClose}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>View Full Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleMessageSkiller}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillUserDetails;
