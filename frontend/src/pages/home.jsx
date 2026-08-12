import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import Footer from "../components/Footer";

const slides = [
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    title: "Collaborative Learning",
    description: "Join teams and grow together."
  },
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    title: "Master Tech Skills",
    description: "Learn cutting-edge technologies."
  },
  {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    title: "Career Opportunities",
    description: "Discover paths that match your passion."
  },
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    title: "Creative Workspaces",
    description: "Build portfolios that stand out."
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 border-b border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                SKILLORA
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-white hover:text-violet-400 transition-colors">
                Home
              </Link>
              <Link to="/skills" className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors">
                Skill Feeds
              </Link>
              <Link to="/opportunities" className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors">
                Opportunities
              </Link>
              <Link to="/contacts" className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors">
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

      {/* Main Content Area */}
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 min-h-screen flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-violet-300 text-xs font-semibold mb-6 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to the future of learning</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Potential
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Discover new skills, explore exciting opportunities, and connect with industry professionals on SKILLORA.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/skills"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-white font-bold text-sm transition-all backdrop-blur-sm text-center"
              >
                Explore Skills
              </Link>
            </div>
          </div>

          {/* Right Column: Modern Slideshow */}
          <div className="order-1 lg:order-2 relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] xl:aspect-square max-h-[600px] rounded-3xl overflow-hidden border border-slate-800/60 shadow-2xl shadow-violet-900/20 group">
            
            {/* Images */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                <img
                  src={slide.url}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                    currentSlide === index ? "scale-110" : "scale-100"
                  }`}
                />
                
                {/* Text overlay on slide */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform transition-all duration-700 delay-300">
                  <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                  <p className="text-slate-300">{slide.description}</p>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 right-8 z-30 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-6 bg-violet-500" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
          
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;
