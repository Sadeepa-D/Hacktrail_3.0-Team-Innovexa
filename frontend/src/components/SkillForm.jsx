import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Briefcase,
  Phone,
  Mail,
  Award,
  DollarSign,
  Clock,
  UserCheck,
  AlignLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  ToggleLeft,
  ToggleRight,
  X
} from "lucide-react";
import toast from "react-hot-toast";

// Enum Categories as specified in the Skill Prisma Schema
export const SKILL_CATEGORIES = [
  { value: "TECHNICAL", label: "Technical & Software", icon: "💻" },
  { value: "DESIGN", label: "UI/UX & Creative Design", icon: "🎨" },
  { value: "COMMUNICATION", label: "Communication & PR", icon: "🗣️" },
  { value: "MANAGEMENT", label: "Project & Product Management", icon: "📊" },
  { value: "LANGUAGE", label: "Languages & Linguistics", icon: "🌐" },
  { value: "SOFT_SKILL", label: "Soft Skills & Leadership", icon: "🤝" },
  { value: "OTHER", label: "Other / General", icon: "✨" },
];

export const AVAILABILITY_OPTIONS = [
  "Full-time",
  "Part-time",
  "Weekends",
  "Flexible",
  "Contract / Project-based",
];

export const EXPERIENCE_LEVELS = [
  "Less than 1 year (Beginner)",
  "1 - 2 Years (Junior)",
  "3 - 5 Years (Intermediate)",
  "5+ Years (Senior / Expert)",
];

const SkillForm = ({
  initialData = null,
  onSubmit = null,
  onCancel = null,
  isSubmitting: externalIsSubmitting = false,
  title = null,
  subtitle = null,
}) => {
  const isEditMode = Boolean(initialData?.id);

  // Form state according to Prisma Skill model fields
  const [formData, setFormData] = useState({
    name: "",
    phonenum: "",
    email: "",
    category: "OTHER",
    description: "",
    qualification: "",
    hourlyRate: "",
    availability: "Flexible",
    experience: "1 - 2 Years (Junior)",
    isActive: true,
    isVerified: false,
  });

  const [errors, setErrors] = useState({});
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || internalSubmitting;

  // Pre-fill form when initialData changes or for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        phonenum: initialData.phonenum || "",
        email: initialData.email || "",
        category: initialData.category || "OTHER",
        description: initialData.description || "",
        qualification: initialData.qualification || "",
        hourlyRate: initialData.hourlyRate !== undefined && initialData.hourlyRate !== null ? String(initialData.hourlyRate) : "",
        availability: initialData.availability || "Flexible",
        experience: initialData.experience || "1 - 2 Years (Junior)",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        isVerified: initialData.isVerified || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for field on user input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Skill name is required.";
    }

    if (!formData.phonenum.trim()) {
      newErrors.phonenum = "Phone number is required.";
    } else if (!/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData.phonenum.trim())) {
      newErrors.phonenum = "Please enter a valid phone number.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.hourlyRate && (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) < 0)) {
      newErrors.hourlyRate = "Hourly rate must be a non-negative number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors before submitting.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      phonenum: formData.phonenum.trim(),
      email: formData.email.trim() || null,
      category: formData.category,
      description: formData.description.trim() || null,
      qualification: formData.qualification.trim() || null,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
      availability: formData.availability || null,
      experience: formData.experience || null,
      isActive: formData.isActive,
      isVerified: formData.isVerified,
    };

    if (onSubmit) {
      try {
        setInternalSubmitting(true);
        await onSubmit(payload);
      } catch (err) {
        console.error("Skill form submission error:", err);
      } finally {
        setInternalSubmitting(false);
      }
    } else {
      // Fallback demo toast if no external handler provided
      toast.success(isEditMode ? "Skill updated successfully!" : "Skill created successfully!");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-violet-950/30 text-slate-100 font-sans relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {title || (isEditMode ? "Edit Skill Profile" : "Add New Skill")}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              {subtitle || (isEditMode ? "Update your offered skill details below" : "Share a new skill or service with the community")}
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

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10" noValidate>
        {/* Row 1: Skill Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Skill Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-name" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-violet-400" />
              Skill Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="skill-name"
              type="text"
              name="name"
              required
              placeholder="e.g. React & Node.js Development"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-rose-500/80 focus:ring-rose-500/50"
                  : "border-slate-800/90 focus:ring-violet-500/70 focus:border-violet-500/50"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Category Enum */}
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-category" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-violet-400" />
              Skill Category
            </label>
            <select
              id="skill-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all cursor-pointer"
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Phone Number & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-phonenum" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-violet-400" />
              Phone Number <span className="text-rose-400">*</span>
            </label>
            <input
              id="skill-phonenum"
              type="tel"
              name="phonenum"
              required
              placeholder="+1 (555) 000-0000"
              value={formData.phonenum}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.phonenum
                  ? "border-rose-500/80 focus:ring-rose-500/50"
                  : "border-slate-800/90 focus:ring-violet-500/70 focus:border-violet-500/50"
              }`}
            />
            {errors.phonenum && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phonenum}</span>
              </p>
            )}
          </div>

          {/* Email (Optional) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-email" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              Contact Email <span className="text-slate-500 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="skill-email"
              type="email"
              name="email"
              placeholder="contact@skillora.dev"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-rose-500/80 focus:ring-rose-500/50"
                  : "border-slate-800/90 focus:ring-violet-500/70 focus:border-violet-500/50"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Hourly Rate, Availability, Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Hourly Rate */}
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-rate" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-violet-400" />
              Hourly Rate ($)
            </label>
            <input
              id="skill-rate"
              type="number"
              step="0.01"
              min="0"
              name="hourlyRate"
              placeholder="e.g. 45.00"
              value={formData.hourlyRate}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.hourlyRate
                  ? "border-rose-500/80 focus:ring-rose-500/50"
                  : "border-slate-800/90 focus:ring-violet-500/70 focus:border-violet-500/50"
              }`}
            />
            {errors.hourlyRate && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.hourlyRate}</span>
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-availability" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              Availability
            </label>
            <select
              id="skill-availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all cursor-pointer"
            >
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-slate-900 text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-experience" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-violet-400" />
              Experience
            </label>
            <select
              id="skill-experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all cursor-pointer"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level} className="bg-slate-900 text-white">
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Qualification */}
        <div className="flex flex-col gap-2">
          <label htmlFor="skill-qualification" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-violet-400" />
            Qualification / Certifications <span className="text-slate-500 font-normal lowercase">(optional)</span>
          </label>
          <input
            id="skill-qualification"
            type="text"
            name="qualification"
            placeholder="e.g. B.Sc in Computer Science, AWS Certified Solutions Architect"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all"
          />
        </div>

        {/* Row 5: Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="skill-description" className="text-xs font-semibold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-violet-400" />
            Description & Highlights <span className="text-slate-500 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            id="skill-description"
            name="description"
            rows="4"
            placeholder="Describe what services or learning you offer, key tools, previous projects, etc..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800/90 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all resize-y min-h-[100px]"
          />
        </div>

        {/* Row 6: Active Status Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
              className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              {formData.isActive ? (
                <ToggleRight className="w-8 h-8 text-violet-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-600" />
              )}
            </button>
            <div>
              <span className="text-sm font-semibold text-white block">Active Status</span>
              <span className="text-xs text-slate-400">
                {formData.isActive ? "This skill is active and visible to others" : "Hidden from search & listings"}
              </span>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${formData.isActive ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50" : "bg-slate-800 text-slate-400"}`}>
            {formData.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Submit Actions */}
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEditMode ? "Saving Changes..." : "Creating Skill..."}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditMode ? "Update Skill" : "Publish Skill"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;
