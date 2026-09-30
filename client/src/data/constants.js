/* ============================================================
   Central profile content — Mamaru Demeke Tegegne
   Edit everything about YOU here.
   ============================================================ */

export const PROFILE = {
  name: "Mamaru Demeke",
  firstName: "Mamaru",
  role: "Web Developer & Video Editor",
  brand: "MD.",
  tagline:
    "Dedicated Computer Science graduate from Mekdela Amba University (CGPA 3.91, Exit Exam 78%) — I use technology to solve real-world challenges through web development and video editing.",
  location: "Bole, Addis Ababa",
  email: "mamardemeke1221@gmail.com",
  phone: "+251943467433",
  phoneAlt: "+251946049376",
  resumeUrl: "/resume.pdf",
  status: "Open to new opportunities",
};

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/MamaruDemeke", icon: "github" },
  { label: "Email", href: "mailto:mamardemeke1221@gmail.com", icon: "mail" },
  { label: "Phone", href: "tel:+251943467433", icon: "phone" },
];

export const SKILL_CATEGORIES = [
  {
    title: "Web Development",
    skills: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
  },
  {
    title: "Video & Content",
    skills: ["Video Editing", "Content Creation"],
  },
  {
    title: "Professional",
    skills: [
      "Problem Solving",
      "Team Collaboration",
      "Time Management",
      "Adaptability",
    ],
  },
];

export const EXPERIENCE = [
  {
    company: "Yegna Trading",
    role: "IT Officer",
    period: "Present",
    summary:
      "Gaining hands-on IT experience — supporting daily technical operations and applying my web development skills to real business needs.",
    highlights: [
      "Designed and built responsive websites using HTML, CSS, JavaScript, and React.",
      "Support and maintain the company's IT systems and user needs.",
      "Applying technical and creative skills to ensure high-quality results and efficient task management.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    company: "Freelance",
    role: "Video Editor & Content Creator",
    period: "2022 — Present",
    summary:
      "Creating and editing video content with a strong eye for detail, storytelling and audience engagement.",
    highlights: [
      "Edited and produced video content for a range of projects.",
      "Quick learner with a proactive approach to identifying and resolving challenges.",
    ],
    tech: ["Video Editing", "Content Creation"],
  },
];

/* Certificates — edit this list with YOUR real certificates.
   Set `url` to the credential/verify link (leave "" to hide the link). */
export const CERTIFICATES = [
  {
    title: "Web Development",
    issuer: "Udemy",
    year: "2024",
    url: "",
  },
  {
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    year: "2024",
    url: "",
  },
  {
    title: "Video Editing",
    issuer: "Coursera",
    year: "2023",
    url: "",
  },
];

/* Seed projects — used when the Firestore `projects` collection is empty,
   so the site always looks complete. Manage real projects from /admin. */
export const SEED_PROJECTS = [
  {
    id: "seed-1",
    title: "Personal Portfolio Website",
    category: "Web",
    description:
      "This very website — a responsive portfolio built with React, Vite and Tailwind CSS, with a Firebase-backed admin dashboard for managing projects and contact messages.",
    tech: ["React", "Vite", "Tailwind CSS", "Firebase"],
    imageUrl: "",
    repoUrl: "https://github.com/MamaruDemeke",
    liveUrl: "#",
    featured: true,
  },
  {
    id: "seed-2",
    title: "Responsive Web Designs",
    category: "Web",
    description:
      "A collection of responsive websites built with HTML, CSS, JavaScript and React — focusing on clean layouts, accessibility and mobile-first design.",
    tech: ["HTML", "CSS", "JavaScript", "React"],
    imageUrl: "",
    repoUrl: "https://github.com/MamaruDemeke",
    liveUrl: "#",
    featured: false,
  },
  {
    id: "seed-3",
    title: "Video Editing Reel",
    category: "Video",
    description:
      "A showreel of edited video content — cutting, color grading and storytelling work produced as a Video Editor & Content Creator.",
    tech: ["Video Editing", "Content Creation"],
    imageUrl: "",
    repoUrl: "",
    liveUrl: "#",
    featured: false,
  },
];

export const PROJECT_CATEGORIES = ["All", "Web", "Video"];
