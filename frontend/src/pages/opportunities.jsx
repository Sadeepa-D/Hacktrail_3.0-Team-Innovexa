import React from "react";
import Header from "../components/Header";
import {
  Briefcase,
  BookOpen,
  Laptop,
  Clock,
  Calendar,
  Heart,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const opportunityTypes = [
  {
    title: "JOB",
    icon: <Briefcase className="w-7 h-7" />,
    description: "Explore standard employment roles and permanent positions.",
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "INTERNSHIP",
    icon: <BookOpen className="w-7 h-7" />,
    description: "Kickstart your career with learning-based work experiences.",
    color: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "FREELANCE",
    icon: <Laptop className="w-7 h-7" />,
    description: "Find independent contract work on your own terms.",
    color: "from-violet-500 to-purple-400",
    shadow: "shadow-violet-500/20",
  },
  {
    title: "PART_TIME",
    icon: <Clock className="w-7 h-7" />,
    description: "Flexible jobs that fit around your other commitments.",
    color: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-500/20",
  },
  {
    title: "FULL_TIME",
    icon: <Calendar className="w-7 h-7" />,
    description: "Commit to a 40-hour work week with full benefits.",
    color: "from-pink-500 to-rose-400",
    shadow: "shadow-pink-500/20",
  },
  {
    title: "VOLUNTEER",
    icon: <Heart className="w-7 h-7" />,
    description: "Give back to the community and build your network.",
    color: "from-red-500 to-rose-500",
    shadow: "shadow-red-500/20",
  },
  {
    title: "PROJECT",
    icon: <Rocket className="w-7 h-7" />,
    description: "Collaborate on short-term milestones and specific tasks.",
    color: "from-yellow-500 to-orange-400",
    shadow: "shadow-yellow-500/20",
  },
];

const Opportunities = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden pb-20">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Header />

      <main
        className="pt-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 animate-fade-in-up opacity-0"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-violet-300 text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
            <span>Find Your Next Role</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Discover{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Opportunities
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Whether you're looking for a permanent career, a quick freelance
            gig, or a passion project, we have it all categorized for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {opportunityTypes.map((type, index) => (
            <div
              key={index}
              className={`bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300 group shadow-xl ${type.shadow} hover:shadow-2xl hover:shadow-${type.color.split("-")[1]}/30 hover:border-slate-700 flex flex-col h-full`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                {type.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                {type.title.replace("_", " ")}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                {type.description}
              </p>
              <Link
                to={`/opportunities/${type.title.toLowerCase()}`}
                className="inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white transition-colors group/link mt-auto"
              >
                Browse {type.title.replace("_", " ")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Opportunities;
