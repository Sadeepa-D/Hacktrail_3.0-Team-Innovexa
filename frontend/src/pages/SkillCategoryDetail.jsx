import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { categoryData } from '../data/skillCategoryData';
import { ArrowLeft, User, Phone, Search } from 'lucide-react';
import SkillUserDetails from '../components/SkillUserDetails';

const SkillCategoryDetail = () => {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const data = categoryData[category] || categoryData['technical'];

  const filteredSkills = data.popularSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.skiller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden pb-20">
      <div className={`absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] ${data.bgGlow} rounded-full blur-[120px] pointer-events-none`}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Header />

      <main className="pt-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link to="/skills" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Link>
          
          {/* Category Search Bar */}
          <div className="relative w-full sm:max-w-xs md:max-w-sm group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${data.name.toLowerCase()}...`}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-lg backdrop-blur-sm text-sm"
            />
          </div>
        </div>
        
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm`}>
            <span>{data.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Explore <span className={`text-transparent bg-clip-text bg-gradient-to-r ${data.accentColor}`}>{data.name.split(" ")[0]} Skills</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', opacity: 0 }}>
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => {
              const Icon = skill.icon;
              return (
              <div 
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 hover:-translate-y-2 transition-all duration-300 group shadow-xl ${data.shadowColor} hover:shadow-2xl hover:shadow-${data.accentColor.split('-')[1]}/30 hover:border-slate-700 flex flex-col h-full cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.accentColor} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                  {skill.name}
                </h3>
                
                {/* Details */}
                <div className="space-y-3 mt-auto pt-4 border-t border-slate-800/80">
                  <div className="flex items-center text-sm text-slate-300 font-medium">
                    <User className="w-4 h-4 mr-2 text-violet-400" />
                    {skill.skiller}
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Phone className="w-4 h-4 mr-2 text-emerald-400" />
                    {skill.contact}
                  </div>
                </div>
              </div>
            )
          })) : (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed">
              <Search className="w-12 h-12 mx-auto mb-4 text-slate-600 opacity-50" />
              <p className="text-lg">No skills found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Skiller Detail Modal */}
      <SkillUserDetails 
        selectedSkill={selectedSkill} 
        onClose={() => setSelectedSkill(null)} 
      />
    </div>
  );
};

export default SkillCategoryDetail;
