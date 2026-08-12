import React from "react";
import Header from "../components/Header";
import { 
  Code, 
  Palette, 
  GraduationCap, 
  PenTool, 
  Share2, 
  Camera, 
  Video,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const skillCategories = [
  {
    title: "Web Development",
    icon: <Code className="w-7 h-7" />,
    description: "Build modern, responsive websites and full-stack applications.",
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20"
  },
  {
    title: "Graphic Design",
    icon: <Palette className="w-7 h-7" />,
    description: "Create stunning visuals, logos, and beautiful digital art.",
    color: "from-pink-500 to-rose-400",
    shadow: "shadow-pink-500/20"
  },
  {
    title: "Online Teaching",
    icon: <GraduationCap className="w-7 h-7" />,
    description: "Share your knowledge and tutor students globally online.",
    color: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/20"
  },
  {
    title: "Writing",
    icon: <PenTool className="w-7 h-7" />,
    description: "Craft compelling content, technical articles, and copy.",
    color: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-500/20"
  },
  {
    title: "Social Media Management",
    icon: <Share2 className="w-7 h-7" />,
    description: "Manage brand campaigns and grow online communities.",
    color: "from-violet-500 to-purple-400",
    shadow: "shadow-violet-500/20"
  },
  {
    title: "Photography",
    icon: <Camera className="w-7 h-7" />,
    description: "Capture moments and provide professional photo edits.",
    color: "from-yellow-500 to-orange-400",
    shadow: "shadow-yellow-500/20"
  },
  {
    title: "Video Editing",
    icon: <Video className="w-7 h-7" />,
    description: "Produce engaging video content, effects, and animations.",
    color: "from-red-500 to-rose-500",
    shadow: "shadow-red-500/20"
  }
];

const Skills = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden pb-20">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Header />

      <main className="pt-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-violet-300 text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
            <span>Browse Categories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Skill Feeds</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover a wide range of opportunities to monetize your talents or find the perfect freelancer for your next project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              className={`bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300 group shadow-xl ${category.shadow} hover:shadow-2xl hover:shadow-${category.color.split('-')[1]}/30 hover:border-slate-700 flex flex-col h-full`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                {category.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                {category.description}
              </p>
              <Link to={`/skills/${category.title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white transition-colors group/link mt-auto">
                View Opportunities
                <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
          
          {/* "More Coming Soon" Card */}
          <div className="bg-slate-900/30 border border-slate-800/50 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[250px] transition-all hover:bg-slate-900/50">
             <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4 shadow-inner">
                <span className="text-2xl">🚀</span>
             </div>
             <h3 className="text-lg font-bold text-slate-300 mb-2">More Categories</h3>
             <p className="text-slate-500 text-sm">We are constantly expanding our skill feeds.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Skills;
