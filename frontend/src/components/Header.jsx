import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <img
              src={logoImage}
              alt="SKILLORA Logo"
              className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
            />
          </Link>

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
            <Link
              to="/contacts"
              className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors"
            >
              Contacts
            </Link>
          </nav>

          {/* Auth Buttons */}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
