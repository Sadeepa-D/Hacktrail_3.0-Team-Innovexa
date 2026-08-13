import { 
  Code2, Smartphone, Database, Server,
  Palette, PenTool, Layout, Video,
  MessageSquare, Mic, PenTool as Write, Languages,
  Kanban, LineChart, Target, Users,
  Globe, BookOpen, Speech, Lightbulb, Heart,
  Camera, Image, Music
} from "lucide-react";

const createSkill = (id, name, skiller, contact, email, qualifications, projects, photo, icon) => ({ 
  id, name, skiller, contact, email, qualifications, projects, photo, icon 
});

export const categoryData = {
  "technical": {
    name: "TECHNICAL SKILLS",
    accentColor: "from-blue-500 to-cyan-400",
    shadowColor: "shadow-blue-500/20",
    bgGlow: "bg-cyan-600/10",
    description: "Explore technical experts in the SKILLORA community.",
    popularSkills: [
      createSkill(1, "Web Development", "Kavindu Dilshan", "+94 77 123 4567", "kavindu.d@example.com", "BSc in Computer Science", ["E-commerce App", "Portfolio Site"], "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", Code2),
      createSkill(2, "Mobile App Dev", "Sarah Jenkins", "+94 71 987 6543", "sarah.j@example.com", "BEng Software Engineering", ["Fitness Tracker UI", "Delivery App"], "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop", Smartphone),
      createSkill(3, "Data Analysis", "Michael Chen", "+94 70 555 1234", "michael.c@example.com", "MSc Data Science", ["Sales Dashboard", "Predictive ML Model"], "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", Database),
      createSkill(4, "Cloud Architecture", "Kasun Perera", "+94 76 333 9999", "kasun.p@example.com", "AWS Certified Solutions Architect", ["AWS Migration", "Serverless API"], "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop", Server)
    ]
  },
  "design": {
    name: "DESIGN SKILLS",
    accentColor: "from-pink-500 to-rose-400",
    shadowColor: "shadow-pink-500/20",
    bgGlow: "bg-pink-600/10",
    description: "Connect with creative designers and artists.",
    popularSkills: [
      createSkill(1, "UI/UX Design", "Nethmi Silva", "+94 75 111 2222", "nethmi.s@example.com", "BA Graphic Design", ["Fintech App UI", "Website Redesign"], "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", Layout),
      createSkill(2, "Graphic Design", "Amanda Fernando", "+94 72 333 4444", "amanda.f@example.com", "Diploma in Visual Arts", ["Brand Identity Package", "Social Media Kits"], "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop", Palette),
      createSkill(3, "Video Editing", "Ruwan Kumara", "+94 77 555 6666", "ruwan.k@example.com", "Advanced Premiere Pro Cert", ["Promo Video 2026", "YouTube Edits"], "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop", Video),
      createSkill(4, "Digital Art", "Piyumi Sen", "+94 71 777 8888", "piyumi.s@example.com", "Self-Taught Illustrator", ["Character Design Pack", "Storybook Art"], "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop", PenTool)
    ]
  },
  "communication": {
    name: "COMMUNICATION SKILLS",
    accentColor: "from-emerald-500 to-teal-400",
    shadowColor: "shadow-emerald-500/20",
    bgGlow: "bg-emerald-600/10",
    description: "Find experts in writing, speaking, and translation.",
    popularSkills: [
      createSkill(1, "Content Writing", "Sachintha Silva", "+94 78 123 9999", "sachintha@example.com", "BA English Literature", ["Tech Blog Posts", "SEO Copywriting"], "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop", Write),
      createSkill(2, "Public Speaking", "Oshada Perera", "+94 71 456 8888", "oshada@example.com", "Toastmasters Advanced", ["Keynote Tech Conf", "Workshop Host"], "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop", Mic),
      createSkill(3, "Translation", "Dilini Fernando", "+94 77 789 7777", "dilini@example.com", "MA Translation Studies", ["Document Localization", "Live Interpreter"], "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop", Languages),
      createSkill(4, "Copywriting", "Shehan Silva", "+94 70 321 6666", "shehan@example.com", "Marketing Communications", ["Ad Campaigns", "Landing Page Copy"], "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=200&auto=format&fit=crop", MessageSquare)
    ]
  },
  "management": {
    name: "MANAGEMENT SKILLS",
    accentColor: "from-orange-500 to-amber-400",
    shadowColor: "shadow-orange-500/20",
    bgGlow: "bg-orange-600/10",
    description: "Discover leaders and project management professionals.",
    popularSkills: [
      createSkill(1, "Project Management", "Tharaka De Silva", "+94 77 111 2233", "tharaka@example.com", "PMP Certified", ["ERP Rollout", "Team Scaling"], "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop", Kanban),
      createSkill(2, "Business Analysis", "Dinuka Bandara", "+94 71 444 5566", "dinuka@example.com", "MBA Business Strategy", ["Market Research 24", "Process Optimization"], "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", LineChart),
      createSkill(3, "Product Management", "Malith Perera", "+94 70 777 8899", "malith@example.com", "CSPO Certified", ["App V2 Launch", "Feature Roadmaps"], "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop", Target),
      createSkill(4, "Team Leadership", "Kamal Rathnayake", "+94 72 999 0011", "kamal@example.com", "Agile Leadership Cert", ["Mentorship Program", "Dept Reorg"], "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop", Users)
    ]
  },
  "language": {
    name: "LANGUAGE SKILLS",
    accentColor: "from-violet-500 to-purple-400",
    shadowColor: "shadow-violet-500/20",
    bgGlow: "bg-violet-600/10",
    description: "Connect with language tutors and translators.",
    popularSkills: [
      createSkill(1, "English Tutoring", "Sanduni Perera", "+94 77 123 1111", "sanduni@example.com", "TEFL Certified", ["Online IELTS Prep", "Business English"], "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop", Speech),
      createSkill(2, "Foreign Languages", "Chamodi Silva", "+94 71 456 2222", "chamodi@example.com", "JLPT N2 Level", ["Japanese Localization", "French Basics Tutoring"], "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop", Globe),
      createSkill(3, "Language Translation", "Pasindu Kumara", "+94 70 789 3333", "pasindu@example.com", "BA Linguistics", ["Legal Document Trans", "Subtitle Sync"], "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", Languages),
      createSkill(4, "Interpretation", "Heshan De Silva", "+94 78 321 4444", "heshan@example.com", "Dip in Interpretation", ["Live Conference Audio", "Meeting Translator"], "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", BookOpen)
    ]
  },
  "soft_skill": {
    name: "SOFT SKILLS",
    accentColor: "from-yellow-500 to-orange-400",
    shadowColor: "shadow-yellow-500/20",
    bgGlow: "bg-yellow-600/10",
    description: "Experts in problem solving and critical thinking.",
    popularSkills: [
      createSkill(1, "Problem Solving", "Nuwan Perera", "+94 77 111 9999", "nuwan@example.com", "Logic & Critical Thinking Cert", ["Crisis Management", "Hackathon Winner"], "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop", Lightbulb),
      createSkill(2, "Team Collaboration", "Ashan Silva", "+94 71 222 8888", "ashan@example.com", "Scrum Master", ["Cross-functional Team Lead", "Agile Coach"], "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop", Users),
      createSkill(3, "Empathy & EQ", "Thilini Fernando", "+94 70 333 7777", "thilini@example.com", "Psychology BSc", ["HR Wellbeing Lead", "Counseling"], "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", Heart),
      createSkill(4, "Conflict Resolution", "Lahiru Kumara", "+94 72 444 6666", "lahiru@example.com", "Mediation Certification", ["Workplace Arbitration", "Client Relations"], "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop", MessageSquare)
    ]
  },
  "other": {
    name: "OTHER SKILLS",
    accentColor: "from-red-500 to-rose-500",
    shadowColor: "shadow-red-500/20",
    bgGlow: "bg-red-600/10",
    description: "Discover diverse and unique talents.",
    popularSkills: [
      createSkill(1, "Photography", "Praveen Silva", "+94 77 999 1111", "praveen@example.com", "Pro Photography Course", ["Wedding Shoots", "Nature Portraits"], "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", Camera),
      createSkill(2, "Music Production", "Saman Perera", "+94 71 888 2222", "saman@example.com", "Audio Engineering Dip", ["Indie Album Mix", "Commercial Jingles"], "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=200&auto=format&fit=crop", Music),
      createSkill(3, "Illustration", "Kasuni Fernando", "+94 70 777 3333", "kasuni@example.com", "BFA Visual Arts", ["Children's Book Art", "Concept Art for Game"], "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop", Image),
      createSkill(4, "Event Planning", "Nimesh Kumara", "+94 78 666 4444", "nimesh@example.com", "Event Mgmt Certification", ["Corporate Gala", "Tech Expo 2025"], "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop", Target)
    ]
  }
};
