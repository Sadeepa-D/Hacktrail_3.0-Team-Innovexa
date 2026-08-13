import { Briefcase, BookOpen, Laptop, Clock, Calendar, Heart, Rocket } from "lucide-react";

const createJob = (id, role, company, mobile, type, icon) => ({ id, role, company, mobile, type, icon });

export const opportunityData = {
  "job": {
    name: "JOB OPPORTUNITIES",
    accentColor: "from-blue-500 to-cyan-400",
    shadowColor: "shadow-blue-500/20",
    bgGlow: "bg-cyan-600/10",
    description: "Explore standard employment roles and permanent positions.",
    jobs: [
      createJob(1, "Software Engineer", "TechCorp Inc.", "+94 77 123 4567", "Permanent", Briefcase),
      createJob(2, "UI/UX Designer", "DesignStudio", "+94 71 987 6543", "Contract", Briefcase),
      createJob(3, "Marketing Manager", "BrandBoost", "+94 70 555 1234", "Permanent", Briefcase),
      createJob(4, "Data Analyst", "DataFlow Labs", "+94 76 333 9999", "Permanent", Briefcase)
    ]
  },
  "internship": {
    name: "INTERNSHIPS",
    accentColor: "from-emerald-500 to-teal-400",
    shadowColor: "shadow-emerald-500/20",
    bgGlow: "bg-emerald-600/10",
    description: "Kickstart your career with learning-based work experiences.",
    jobs: [
      createJob(1, "Frontend Intern", "WebSolutions", "+94 75 111 2222", "6 Months Internship", BookOpen),
      createJob(2, "HR Trainee", "People First", "+94 72 333 4444", "3 Months Internship", BookOpen),
      createJob(3, "QA Intern", "TestWorks", "+94 77 555 6666", "6 Months Internship", BookOpen),
      createJob(4, "Business Analyst Intern", "StrategyX", "+94 71 777 8888", "1 Year Internship", BookOpen)
    ]
  },
  "freelance": {
    name: "FREELANCE GIGS",
    accentColor: "from-violet-500 to-purple-400",
    shadowColor: "shadow-violet-500/20",
    bgGlow: "bg-violet-600/10",
    description: "Find independent contract work on your own terms.",
    jobs: [
      createJob(1, "React Freelancer", "StartupX", "+94 77 999 1111", "Contract (3 months)", Laptop),
      createJob(2, "Logo Designer", "RetailPro", "+94 71 888 2222", "One-off Project", Laptop),
      createJob(3, "SEO Consultant", "Marketing LK", "+94 70 777 3333", "Retainer", Laptop),
      createJob(4, "Video Editor", "Vlog Creations", "+94 78 666 4444", "Per Video", Laptop)
    ]
  },
  "part_time": {
    name: "PART TIME JOBS",
    accentColor: "from-orange-500 to-amber-400",
    shadowColor: "shadow-orange-500/20",
    bgGlow: "bg-orange-600/10",
    description: "Flexible jobs that fit around your other commitments.",
    jobs: [
      createJob(1, "Customer Support", "GlobalTech", "+94 70 555 1234", "Part Time (20h/wk)", Clock),
      createJob(2, "Social Media Manager", "Creative Hub", "+94 76 333 9999", "Part Time (Weekend)", Clock),
      createJob(3, "Data Entry Clerk", "FinanceLK", "+94 72 111 2222", "Part Time (Evening)", Clock),
      createJob(4, "Content Reviewer", "MediaNet", "+94 78 444 5555", "Part Time (Flexible)", Clock)
    ]
  },
  "full_time": {
    name: "FULL TIME JOBS",
    accentColor: "from-pink-500 to-rose-400",
    shadowColor: "shadow-pink-500/20",
    bgGlow: "bg-pink-600/10",
    description: "Commit to a 40-hour work week with full benefits.",
    jobs: [
      createJob(1, "Backend Engineer", "ServerPro", "+94 77 111 2233", "Full Time", Calendar),
      createJob(2, "Sales Executive", "SalesForce LK", "+94 71 444 5566", "Full Time", Calendar),
      createJob(3, "Product Manager", "Innovate Inc", "+94 70 777 8899", "Full Time", Calendar),
      createJob(4, "System Admin", "TechOps", "+94 72 999 0011", "Full Time", Calendar)
    ]
  },
  "volunteer": {
    name: "VOLUNTEER ROLES",
    accentColor: "from-red-500 to-rose-500",
    shadowColor: "shadow-red-500/20",
    bgGlow: "bg-red-600/10",
    description: "Give back to the community and build your network.",
    jobs: [
      createJob(1, "Event Coordinator", "Charity LK", "+94 77 111 9999", "Unpaid Volunteer", Heart),
      createJob(2, "Tech Mentor", "Code for Good", "+94 71 222 8888", "2 hours/week", Heart),
      createJob(3, "Social Media Vol", "Animal Rescue", "+94 70 333 7777", "Flexible Volunteer", Heart),
      createJob(4, "Beach Cleanup Lead", "Eco Lanka", "+94 72 444 6666", "Weekend Event", Heart)
    ]
  },
  "project": {
    name: "SHORT PROJECTS",
    accentColor: "from-yellow-500 to-orange-400",
    shadowColor: "shadow-yellow-500/20",
    bgGlow: "bg-yellow-600/10",
    description: "Collaborate on short-term milestones and specific tasks.",
    jobs: [
      createJob(1, "MVP Development", "New Startup", "+94 78 123 9999", "1 Month Project", Rocket),
      createJob(2, "Database Migration", "Legacy Systems", "+94 71 456 8888", "2 Weeks Project", Rocket),
      createJob(3, "Website Redesign", "Local Bakery", "+94 77 789 7777", "Fixed Price Project", Rocket),
      createJob(4, "App Prototype", "Fintech Idea", "+94 70 321 6666", "3 Weeks Project", Rocket)
    ]
  }
};
