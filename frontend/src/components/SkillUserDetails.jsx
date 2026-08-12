import React from 'react';
import { X, Mail, Phone, BookOpen, Briefcase } from 'lucide-react';

const SkillUserDetails = ({ selectedSkill, onClose }) => {
  if (!selectedSkill) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <img 
              src={selectedSkill.photo} 
              alt={selectedSkill.skiller} 
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-slate-800 shadow-xl flex-shrink-0"
            />
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-violet-400 text-xs font-semibold mb-3 shadow-sm">
                {selectedSkill.name}
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">{selectedSkill.skiller}</h2>
              
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-slate-300 text-sm">
                    <Mail className="w-4 h-4 mr-3 text-violet-400" />
                    {selectedSkill.email}
                  </div>
                  <div className="flex items-center text-slate-300 text-sm">
                    <Phone className="w-4 h-4 mr-3 text-emerald-400" />
                    {selectedSkill.contact}
                  </div>
                </div>
                
                <div className="flex items-start text-slate-300 text-sm border-t border-slate-800/80 pt-4">
                  <BookOpen className="w-4 h-4 mr-3 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white block mb-1">Qualifications</span>
                    <span className="text-slate-400">{selectedSkill.qualifications}</span>
                  </div>
                </div>
                
                <div className="flex items-start text-slate-300 text-sm border-t border-slate-800/80 pt-4">
                  <Briefcase className="w-4 h-4 mr-3 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white block mb-2">Recent Projects</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.projects.map((proj, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-medium text-slate-300">
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/30 p-6 border-t border-slate-700/50 flex justify-end">
          <a 
            href={`mailto:${selectedSkill.email}`}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
};

export default SkillUserDetails;
