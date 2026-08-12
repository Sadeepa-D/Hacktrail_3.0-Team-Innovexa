import { 
  Code2, Smartphone, Database, Server,
  Palette, PenTool, Layout, Video,
  MessageSquare, Mic, PenTool as Write, Languages,
  Kanban, LineChart, Target, Users,
  Globe, BookOpen, Speech, Lightbulb, Heart,
  Camera, Image, Music
} from "lucide-react";

const createSkill = (id, name, skiller, contact, icon) => ({ id, name, skiller, contact, icon });

export const categoryData = {
  "technical": {
    name: "TECHNICAL SKILLS",
    accentColor: "from-blue-500 to-cyan-400",
    shadowColor: "shadow-blue-500/20",
    bgGlow: "bg-cyan-600/10",
    description: "Explore technical experts in the SKILLORA community.",
    popularSkills: [
      createSkill(1, "Web Development", "Kavindu Dilshan", "+94 77 123 4567", Code2),
      createSkill(2, "Mobile App Dev", "Sarah Jenkins", "+94 71 987 6543", Smartphone),
      createSkill(3, "Data Analysis", "Michael Chen", "+94 70 555 1234", Database),
      createSkill(4, "Cloud Architecture", "Kasun Perera", "+94 76 333 9999", Server)
    ]
  },
  "design": {
    name: "DESIGN SKILLS",
    accentColor: "from-pink-500 to-rose-400",
    shadowColor: "shadow-pink-500/20",
    bgGlow: "bg-pink-600/10",
    description: "Connect with creative designers and artists.",
    popularSkills: [
      createSkill(1, "UI/UX Design", "Nethmi Silva", "+94 75 111 2222", Layout),
      createSkill(2, "Graphic Design", "Amanda Fernando", "+94 72 333 4444", Palette),
      createSkill(3, "Video Editing", "Ruwan Kumara", "+94 77 555 6666", Video),
      createSkill(4, "Digital Art", "Piyumi Sen", "+94 71 777 8888", PenTool)
    ]
  },
  "communication": {
    name: "COMMUNICATION SKILLS",
    accentColor: "from-emerald-500 to-teal-400",
    shadowColor: "shadow-emerald-500/20",
    bgGlow: "bg-emerald-600/10",
    description: "Find experts in writing, speaking, and translation.",
    popularSkills: [
      createSkill(1, "Content Writing", "Sachintha Silva", "+94 78 123 9999", Write),
      createSkill(2, "Public Speaking", "Oshada Perera", "+94 71 456 8888", Mic),
      createSkill(3, "Translation", "Dilini Fernando", "+94 77 789 7777", Languages),
      createSkill(4, "Copywriting", "Shehan Silva", "+94 70 321 6666", MessageSquare)
    ]
  },
  "management": {
    name: "MANAGEMENT SKILLS",
    accentColor: "from-orange-500 to-amber-400",
    shadowColor: "shadow-orange-500/20",
    bgGlow: "bg-orange-600/10",
    description: "Discover leaders and project management professionals.",
    popularSkills: [
      createSkill(1, "Project Management", "Tharaka De Silva", "+94 77 111 2233", Kanban),
      createSkill(2, "Business Analysis", "Dinuka Bandara", "+94 71 444 5566", LineChart),
      createSkill(3, "Product Management", "Malith Perera", "+94 70 777 8899", Target),
      createSkill(4, "Team Leadership", "Kamal Rathnayake", "+94 72 999 0011", Users)
    ]
  },
  "language": {
    name: "LANGUAGE SKILLS",
    accentColor: "from-violet-500 to-purple-400",
    shadowColor: "shadow-violet-500/20",
    bgGlow: "bg-violet-600/10",
    description: "Connect with language tutors and translators.",
    popularSkills: [
      createSkill(1, "English Tutoring", "Sanduni Perera", "+94 77 123 1111", Speech),
      createSkill(2, "Foreign Languages", "Chamodi Silva", "+94 71 456 2222", Globe),
      createSkill(3, "Language Translation", "Pasindu Kumara", "+94 70 789 3333", Languages),
      createSkill(4, "Interpretation", "Heshan De Silva", "+94 78 321 4444", BookOpen)
    ]
  },
  "soft_skill": {
    name: "SOFT SKILLS",
    accentColor: "from-yellow-500 to-orange-400",
    shadowColor: "shadow-yellow-500/20",
    bgGlow: "bg-yellow-600/10",
    description: "Experts in problem solving and critical thinking.",
    popularSkills: [
      createSkill(1, "Problem Solving", "Nuwan Perera", "+94 77 111 9999", Lightbulb),
      createSkill(2, "Team Collaboration", "Ashan Silva", "+94 71 222 8888", Users),
      createSkill(3, "Empathy & EQ", "Thilini Fernando", "+94 70 333 7777", Heart),
      createSkill(4, "Conflict Resolution", "Lahiru Kumara", "+94 72 444 6666", MessageSquare)
    ]
  },
  "other": {
    name: "OTHER SKILLS",
    accentColor: "from-red-500 to-rose-500",
    shadowColor: "shadow-red-500/20",
    bgGlow: "bg-red-600/10",
    description: "Discover diverse and unique talents.",
    popularSkills: [
      createSkill(1, "Photography", "Praveen Silva", "+94 77 999 1111", Camera),
      createSkill(2, "Music Production", "Saman Perera", "+94 71 888 2222", Music),
      createSkill(3, "Illustration", "Kasuni Fernando", "+94 70 777 3333", Image),
      createSkill(4, "Event Planning", "Nimesh Kumara", "+94 78 666 4444", Target)
    ]
  }
};
