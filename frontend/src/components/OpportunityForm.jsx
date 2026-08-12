import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  Globe,
  DollarSign,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Calendar,
  AlignLeft,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
  X,
  Layers,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

// Enum Constants matching Backend Prisma schema
export const OPPORTUNITY_TYPES = [
  { value: "JOB", label: "Full Job", icon: "💼" },
  { value: "INTERNSHIP", label: "Internship", icon: "🎓" },
  { value: "FREELANCE", label: "Freelance / Contract", icon: "💻" },
  { value: "PART_TIME", label: "Part-Time", icon: "⏳" },
  { value: "FULL_TIME", label: "Full-Time", icon: "🕒" },
  { value: "VOLUNTEER", label: "Volunteer", icon: "🤝" },
  { value: "PROJECT", label: "Project Based", icon: "🚀" },
];

export const OPPORTUNITY_CATEGORIES = [
  { value: "TECHNOLOGY", label: "Technology & Software", icon: "⚡" },
  { value: "DESIGN", label: "Design & Creative", icon: "🎨" },
  { value: "MARKETING", label: "Marketing & Growth", icon: "📈" },
  { value: "WRITING", label: "Writing & Content", icon: "✍️" },
  { value: "TUTORING", label: "Tutoring & Education", icon: "📚" },
  { value: "LABOR", label: "Skilled Labor & Services", icon: "🛠️" },
  { value: "FOOD_SERVICE", label: "Food & Hospitality", icon: "🍔" },
  { value: "EVENT", label: "Event Management", icon: "🎉" },
  { value: "AGRICULTURE", label: "Agriculture & Farming", icon: "🌱" },
  { value: "OTHER", label: "Other / General", icon: "✨" },
];

export const OPPORTUNITY_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open / Active" },
  { value: "CLOSED", label: "Closed" },
  { value: "FILLED", label: "Filled" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const SALARY_TYPES = [
  { value: "FIXED", label: "Fixed Amount" },
  { value: "HOURLY", label: "Per Hour ($/hr)" },
  { value: "MONTHLY", label: "Per Month ($/mo)" },
  { value: "NEGOTIABLE", label: "Negotiable" },
];

const OpportunityForm = ({
  initialData = null,
  onSubmit = null,
  onCancel = null,
  isSubmitting: externalIsSubmitting = false,
  title = null,
  subtitle = null,
}) => {
  const isEditMode = Boolean(initialData?.id);

  // Form state according to Prisma Opportunity model
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "JOB",
    category: "TECHNOLOGY",
    status: "OPEN",
    location: "",
    isRemote: false,
    salary: "",
    salaryMax: "",
    salaryType: "FIXED",
    companyname: "",
    contactEmail: "",
    contactPhone: "",
    experience: "",
    education: "",
    expiresAt: "",
  });

  const [errors, setErrors] = useState({});
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || internalSubmitting;

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "JOB",
        category: initialData.category || "TECHNOLOGY",
        status: initialData.status || "OPEN",
        location: initialData.location || "",
        isRemote: initialData.isRemote || false,
        salary: initialData.salary !== undefined && initialData.salary !== null ? String(initialData.salary) : "",
        salaryMax: initialData.salaryMax !== undefined && initialData.salaryMax !== null ? String(initialData.salaryMax) : "",
        salaryType: initialData.salaryType || "FIXED",
        companyname: initialData.companyname || "",
        contactEmail: initialData.contactEmail || "",
        contactPhone: initialData.contactPhone || "",
        experience: initialData.experience || "",
        education: initialData.education || "",
        expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().split("T")[0] : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Opportunity title is required.";
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail.trim())) {
      newErrors.contactEmail = "Please enter a valid contact email.";
    }

    if (formData.salary && (isNaN(Number(formData.salary)) || Number(formData.salary) < 0)) {
      newErrors.salary = "Minimum salary must be a valid non-negative number.";
    }

    if (formData.salaryMax && (isNaN(Number(formData.salaryMax)) || Number(formData.salaryMax) < 0)) {
      newErrors.salaryMax = "Maximum salary must be a valid non-negative number.";
    }

    if (formData.salary && formData.salaryMax && Number(formData.salaryMax) < Number(formData.salary)) {
      newErrors.salaryMax = "Max salary cannot be lower than min salary.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix highlighted errors before submitting.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      type: formData.type,
      category: formData.category,
      status: formData.status,
      location: formData.location.trim() || null,
      isRemote: formData.isRemote,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
      salaryType: formData.salaryType,
      companyname: formData.companyname.trim() || null,
      contactEmail: formData.contactEmail.trim() || null,
      contactPhone: formData.contactPhone.trim() || null,
      experience: formData.experience.trim() || null,
      education: formData.education.trim() || null,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
    };

    if (onSubmit) {
      try {
        setInternalSubmitting(true);
        await onSubmit(payload);
      } catch (err) {
        console.error("Opportunity form submit error:", err);
      } finally {
        setInternalSubmitting(false);
      }
    } else {
      toast.success(isEditMode ? "Opportunity updated successfully!" : "Opportunity created successfully!");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-violet-950/30 text-slate-100 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {title || (isEditMode ? "Edit Opportunity" : "Post Opportunity")}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              {subtitle || (isEditMode ? "Update opportunity details & settings" : "Create a job, internship, or freelance opportunity")}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10" noValidate>
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="opp-title" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Opportunity Title <span className="text-rose-400">*</span>
          </label>
          <input
            id="opp-title"
            type="text"
            name="title"
            required
            placeholder="e.g. Senior Frontend Developer / UI Design Intern"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? "border-rose-500/80 focus:ring-rose-500/50"
                : "border-slate-800/90 focus:ring-indigo-500/70 focus:border-indigo-500/50"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Type, Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Type */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-type" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Opportunity Type
            </label>
            <select
              id="opp-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all cursor-pointer"
            >
              {OPPORTUNITY_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-slate-900 text-white">
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-category" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Category
            </label>
            <select
              id="opp-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all cursor-pointer"
            >
              {OPPORTUNITY_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-status" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Status
            </label>
            <select
              id="opp-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all cursor-pointer"
            >
              {OPPORTUNITY_STATUSES.map((st) => (
                <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Company Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-company" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Company / Employer Name
            </label>
            <input
              id="opp-company"
              type="text"
              name="companyname"
              placeholder="e.g. Acme Tech Solutions"
              value={formData.companyname}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-location" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Location
            </label>
            <input
              id="opp-location"
              type="text"
              name="location"
              placeholder="e.g. San Francisco, CA / Colombo, SL"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Remote Work Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isRemote: !prev.isRemote }))}
              className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              {formData.isRemote ? (
                <ToggleRight className="w-8 h-8 text-indigo-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
            <div>
              <span className="text-sm font-semibold text-white block">Remote Work Available</span>
              <span className="text-xs text-slate-400">
                {formData.isRemote ? "Applicants can work remotely from anywhere" : "On-site / Office requirement"}
              </span>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${formData.isRemote ? "bg-indigo-950/60 text-indigo-400 border border-indigo-800/50" : "bg-slate-800 text-slate-400"}`}>
            {formData.isRemote ? "Remote Enabled" : "On-Site"}
          </span>
        </div>

        {/* Salary Row: Min Salary, Max Salary, Salary Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Min Salary */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-salary" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
              Salary / Pay Min ($)
            </label>
            <input
              id="opp-salary"
              type="number"
              step="0.01"
              min="0"
              name="salary"
              placeholder="e.g. 3000"
              value={formData.salary}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.salary
                  ? "border-rose-500/80 focus:ring-rose-500/50"
                  : "border-slate-800/90 focus:ring-indigo-500/70 focus:border-indigo-500/50"
              }`}
            />
            {errors.salary && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.salary}</span>
              </p>
            )}
          </div>

          {/* Max Salary */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-salary-max" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
              Salary Max ($)
            </label>
            <input
              id="opp-salary-max"
              type="number"
              step="0.01"
              min="0"
              name="salaryMax"
              placeholder="e.g. 5000"
              value={formData.salaryMax}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.salaryMax
                  ? "border-rose-500/80 focus:ring-rose-500/50"
                  : "border-slate-800/90 focus:ring-indigo-500/70 focus:border-indigo-500/50"
              }`}
            />
            {errors.salaryMax && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.salaryMax}</span>
              </p>
            )}
          </div>

          {/* Salary Type */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-salary-type" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              Pay Type
            </label>
            <select
              id="opp-salary-type"
              name="salaryType"
              value={formData.salaryType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all cursor-pointer"
            >
              {SALARY_TYPES.map((st) => (
                <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Contact Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-email" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Contact Email
            </label>
            <input
              id="opp-email"
              type="email"
              name="contactEmail"
              placeholder="jobs@company.com"
              value={formData.contactEmail}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.contactEmail
                  ? "border-rose-500/80 focus:ring-rose-500/50"
                  : "border-slate-800/90 focus:ring-indigo-500/70 focus:border-indigo-500/50"
              }`}
            />
            {errors.contactEmail && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.contactEmail}</span>
              </p>
            )}
          </div>

          {/* Contact Phone */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-phone" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              Contact Phone
            </label>
            <input
              id="opp-phone"
              type="tel"
              name="contactPhone"
              placeholder="+1 (555) 123-4567"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Experience */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-experience" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Required Experience
            </label>
            <input
              id="opp-experience"
              type="text"
              name="experience"
              placeholder="e.g. 2+ years React experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Education */}
          <div className="flex flex-col gap-2">
            <label htmlFor="opp-education" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              Required Education
            </label>
            <input
              id="opp-education"
              type="text"
              name="education"
              placeholder="e.g. Bachelor's Degree in CS or equivalent"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Expiration Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="opp-expires" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Application Expiration Date <span className="text-slate-500 font-normal lowercase">(optional)</span>
          </label>
          <input
            id="opp-expires"
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all cursor-pointer"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="opp-description" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
            Full Opportunity Description & Responsibilities
          </label>
          <textarea
            id="opp-description"
            name="description"
            rows="5"
            placeholder="Detailed description of role responsibilities, team tech stack, benefits..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/50 transition-all resize-y min-h-[120px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 hover:bg-slate-800/80 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEditMode ? "Saving Changes..." : "Publishing..."}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditMode ? "Update Opportunity" : "Publish Opportunity"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityForm;
