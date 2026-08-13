import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2, User, Sparkles, Briefcase, MapPin, X, ShieldCheck } from "lucide-react";
import logoImage from "../assets/logo.png";
import { searchUsers } from "../lib/searchApi";
import { useAuth } from "../context/authcontext";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced search call
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchUsers(trimmed);
        setSuggestions(data.users || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (userId) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/profile/${userId}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img
                src={logoImage}
                alt="SKILLORA Logo"
                className="h-14 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-white hover:text-violet-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/skills"
              className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors"
            >
              Skill Feeds
            </Link>
            <Link
              to="/opportunities"
              className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors"
            >
              Opportunities
            </Link>
            <button
              onClick={() => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors cursor-pointer"
            >
              Contacts
            </button>
          </nav>

          {/* Right Side Controls (Search + Auth) */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
              {/* Header Search Bar with Live User Suggestions */}
              <div ref={searchContainerRef} className="hidden lg:block relative w-72 group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Search user profiles & skills..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowDropdown(true);
                    }}
                    className="w-full pl-10 pr-9 py-2 bg-slate-950/70 border border-slate-700/80 rounded-full text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-500/50 transition-all shadow-md backdrop-blur-md"
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setSuggestions([]);
                        setShowDropdown(false);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Floating Suggestion Dropdown */}
                {showDropdown && query.trim() !== "" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl shadow-violet-950/80 backdrop-blur-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                        <span>Searching profiles...</span>
                      </div>
                    ) : suggestions.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        No matching user profiles found.
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60">
                          Suggested User Profiles
                        </div>
                        {suggestions.map((u) => {
                          const name =
                            u.fname || u.lname
                              ? `${u.fname || ""} ${u.lname || ""}`.trim()
                              : "Community Member";

                          return (
                            <button
                              key={u.id}
                              onClick={() => handleSelectUser(u.id)}
                              className="w-full px-4 py-3 text-left hover:bg-slate-800/80 transition-colors flex items-start gap-3 border-b border-slate-800/40 last:border-0 cursor-pointer group"
                            >
                              {/* Avatar */}
                              {u.avatarUrl ? (
                                <img
                                  src={u.avatarUrl}
                                  alt={name}
                                  className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-violet-500/30"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                                  {name.charAt(0).toUpperCase()}
                                </div>
                              )}

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                                    {name}
                                  </span>
                                  {u.city && (
                                    <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-0.5">
                                      <MapPin className="w-3 h-3 text-violet-400" />
                                      {u.city}
                                    </span>
                                  )}
                                </div>

                                {/* Unique Skills Pills */}
                                {u.skills && u.skills.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                    <Sparkles className="w-3 h-3 text-violet-400 shrink-0" />
                                    {u.skills.map((skill) => (
                                      <span
                                        key={skill.id}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-800/50 font-medium truncate max-w-[110px]"
                                      >
                                        {skill.name}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Posted Opportunities Pills */}
                                {u.opportunities && u.opportunities.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                    <Briefcase className="w-3 h-3 text-indigo-400 shrink-0" />
                                    {u.opportunities.map((opp) => (
                                      <span
                                        key={opp.id}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-800/50 font-medium truncate max-w-[110px]"
                                      >
                                        {opp.title}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Auth Buttons / Controls */}
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Clickable Top Profile Icon & Badge -> Navigates to /profile */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-violet-950/60 border border-slate-700/60 hover:border-violet-500/50 transition-all group cursor-pointer"
                    title="Profile Management"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Profile Avatar"
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-violet-500/50 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold group-hover:scale-105 transition-transform shadow-md">
                        {(user.fname || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-violet-300 transition-colors truncate max-w-[120px]">
                      {user.fname || user.email?.split("@")[0]}
                    </span>
                  </Link>

                  {/* If user is Admin, show Admin Dashboard link */}
                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      title="Admin Dashboard"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Admin</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                      navigate("/login");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="hidden sm:block text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
