import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import {
  Mail, Lock, Eye, EyeOff, UserPlus, Loader2,
  Sparkles, CheckCircle2, User,
} from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email address is required.");
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!confirmPassword) {
      toast.error("Please confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await register(
        email.trim().toLowerCase(),
        password,
        fname.trim() || undefined,
        lname.trim() || undefined
      );
      toast.success("Account created! Welcome 🎉");

      // Role-based navigation: ADMIN -> /admindashboard, USER -> /home
      if (res?.user?.role === "ADMIN") {
        navigate("/admindashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.message || "Failed to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-violet-500 selection:text-white">
      {/* Animated background blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-lg bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl shadow-violet-950/50 relative z-10 my-8">
        {/* Branding */}
        <div className="flex flex-col items-center mb-7 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-violet-500/30 mb-4 ring-2 ring-violet-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1.5">
            Join Team Innovexa · Only email & password required
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-fname" className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                First Name <span className="text-slate-600 normal-case font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-fname"
                  type="text"
                  autoComplete="given-name"
                  placeholder="John"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-lname" className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Last Name <span className="text-slate-600 normal-case font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-lname"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-email" className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <p className={`text-xs mt-0.5 ${password.length >= 6 ? "text-emerald-400" : "text-rose-400"}`}>
                {password.length >= 6 ? "✓ Password strength: good" : `${6 - password.length} more character(s) required`}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <input
                id="reg-confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-950/60 rounded-xl border text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword && confirmPassword !== password
                    ? "border-rose-500/60 focus:ring-rose-500/50"
                    : confirmPassword && confirmPassword === password
                    ? "border-emerald-500/60 focus:ring-emerald-500/50"
                    : "border-slate-800 focus:ring-violet-500/70 focus:border-violet-500/50"
                }`}
              />
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-xs text-rose-400 mt-0.5">✗ Passwords do not match</p>
            )}
            {confirmPassword && confirmPassword === password && (
              <p className="text-xs text-emerald-400 mt-0.5">✓ Passwords match</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center">
            Fields marked <span className="text-rose-400">*</span> are required
          </p>
        </form>

        {/* Login link */}
        <p className="text-xs md:text-sm text-slate-500 text-center mt-6 pt-5 border-t border-slate-800/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-400 font-semibold hover:text-violet-300 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;