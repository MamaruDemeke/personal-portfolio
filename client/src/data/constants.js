/* ============================================================
   Central portfolio content — Mamaru Demeke
   Every export here is the FALLBACK / seed used before (or
   instead of) the admin dashboard publishing to Firestore
   (site/main). Nothing here needs editing after go-live.
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
  logoUrl: "",
  faviconUrl: "",
  /* Public URL of the deployed site (Vercel, Firebase Hosting, or any domain).
     Editable in the admin so share/preview links never point at a stale host. */
  siteUrl: "https://personal-portfolio-chi-topaz-33.vercel.app",
};

/* Hero section — headline roles, CTA labels and targets */
export const HERO = {
  roles: ["Web Developer", "Video Editor"],
  primaryCta: "View My Work",
  primaryHref: "#projects",
  secondaryCta: "Get In Touch",
  secondaryHref: "#contact",
  resumeCta: "Download CV",
  showResume: true,
};

/* About section — bio copy, stats and the two small cards */
export const ABOUT = {
  greeting: "Hi, I’m",
  headingAccent: "a builder of things",
  paragraphs: [
    "A Computer Science graduate from Mekdela Amba University based in Bole, Addis Ababa. I use technology to solve real-world challenges — through clean, responsive web development and compelling video storytelling.",
    "With strong skills in web development (HTML, CSS, JavaScript, React) and video editing, I’m eager to contribute to a dynamic team, enhance operational efficiency and support growth through innovative solutions and proactive problem-solving.",
    "Hardworking, responsible and quick-learning — I bring technical precision and creative energy to every task, ensuring high-quality results.",
  ],
  stats: [
    { value: "3.91", label: "CGPA" },
    { value: "78%", label: "Exit Exam" },
    { value: "2+", label: "Years Experience" },
  ],
  availability: {
    enabled: true,
    title: "Open to work",
    text: "Freelance & full-time opportunities",
  },
  locationNote: "Working remotely, worldwide",
};

/* Contact section copy */
export const CONTACT_COPY = {
  intro:
    "My inbox is always open — whether you have a project in mind, a role to discuss, or just want to say hi. I’ll do my best to reply within 24 hours.",
  submitLabel: "Send Message",
  sendingLabel: "Sending…",
  successMessage: "Message sent! I'll get back to you soon.",
};

/* Per-section visibility + headings. `visible: false` hides the block. */
export const SECTION_META = {
  marquee: { visible: true },
  about: { visible: true, eyebrow: "about", title: "Behind the", accent: "pixels" },
  skills: { visible: true, eyebrow: "skills", title: "My", accent: "toolkit" },
  experience: {
    visible: true,
    eyebrow: "experience",
    title: "Where I've",
    accent: "worked",
  },
  certificates: {
    visible: true,
    eyebrow: "certificates",
    title: "Certified",
    accent: "learning",
  },
  projects: { visible: true, eyebrow: "projects", title: "Selected", accent: "work" },
  contact: { visible: true, eyebrow: "contact", title: "Let's build", accent: "something" },
};

/* Navbar links — reorder, rename, hide or add from /admin → Content */
export const NAV_LINKS = [
  { label: "About", href: "#about", visible: true },
  { label: "Skills", href: "#skills", visible: true },
  { label: "Experience", href: "#experience", visible: true },
  { label: "Certificates", href: "#certificates", visible: true },
  { label: "Projects", href: "#projects", visible: true },
  { label: "Contact", href: "#contact", visible: true },
];

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/MamaruDemeke", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/MamaruDemeke", icon: "linkedin" },
  { label: "Email", href: "mailto:mamardemeke1221@gmail.com", icon: "mail" },
  { label: "Phone", href: "tel:+251943467433", icon: "phone" },
];

/* Icon names offered by the social-link picker */
export const SOCIAL_ICONS = [
  "github",
  "linkedin",
  "x",
  "instagram",
  "telegram",
  "whatsapp",
  "youtube",
  "tiktok",
  "dribbble",
  "behance",
  "globe",
  "mail",
  "phone",
  "link",
];

export const SKILL_LIBRARY = {
  Languages: [
    { name: "HTML", logo: "html" },
    { name: "CSS", logo: "css" },
    { name: "JavaScript", logo: "javascript" },
    { name: "TypeScript", logo: "typescript" },
    { name: "Python", logo: "python" },
    { name: "SQL", logo: "sql" },
    { name: "Bash", logo: "bash" },
    { name: "PHP", logo: "php" },
    { name: "Java", logo: "openjdk" },
    { name: "C++", logo: "c++" },
    { name: "Rust", logo: "rust" },
    { name: "Go", logo: "go" },
    { name: "Kotlin", logo: "kotlin" },
    { name: "Swift", logo: "swift" },
    { name: "Ruby", logo: "ruby" },
  ],
  Frameworks: [
    { name: "React", logo: "react" },
    { name: "Next.js", logo: "next.js" },
    { name: "Tailwind CSS", logo: "tailwind" },
    { name: "Bootstrap", logo: "bootstrap" },
    { name: "Vite", logo: "vite" },
    { name: "Node.js", logo: "node" },
    { name: "Express", logo: "express" },
    { name: "Vue", logo: "vue" },
    { name: "Svelte", logo: "svelte" },
    { name: "Angular", logo: "angular" },
    { name: "Nuxt", logo: "nuxt" },
    { name: "Redux", logo: "redux" },
    { name: "Django", logo: "django" },
    { name: "Flask", logo: "flask" },
    { name: "Laravel", logo: "laravel" },
    { name: "Spring", logo: "spring" },
    { name: "MongoDB", logo: "mongodb" },
    { name: "Firebase", logo: "firebase" },
  ],
  DevOps: [
    { name: "Git", logo: "git" },
    { name: "GitHub", logo: "github" },
    { name: "GitHub Actions", logo: "github actions" },
    { name: "GitLab", logo: "gitlab" },
    { name: "Docker", logo: "docker" },
    { name: "Kubernetes", logo: "kubernetes" },
    { name: "CI/CD", logo: "ci/cd" },
    { name: "Linux", logo: "linux" },
    { name: "Terraform", logo: "terraform" },
    { name: "Nginx", logo: "nginx" },
    { name: "Jenkins", logo: "jenkins" },
    { name: "Ansible", logo: "ansible" },
    { name: "Prometheus", logo: "prometheus" },
    { name: "Grafana", logo: "grafana" },
  ],
  Cloud: [
    { name: "AWS", logo: "aws" },
    { name: "Google Cloud", logo: "gcp" },
    { name: "Cloudflare", logo: "cloudflare" },
    { name: "Vercel", logo: "vercel" },
    { name: "Netlify", logo: "netlify" },
    { name: "Firebase", logo: "firebase" },
  ],
};

/* The exact toolkit shown on the public page (4 categories). */
export const SKILL_CATEGORIES = [
  {
    title: "Languages",
    skills: [
      { name: "HTML", logo: "html" },
      { name: "CSS", logo: "css" },
      { name: "JavaScript", logo: "javascript" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Python", logo: "python" },
      { name: "SQL", logo: "sql" },
      { name: "Bash", logo: "bash" },
    ],
  },
  {
    title: "Frameworks",
    skills: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "next.js" },
      { name: "Tailwind CSS", logo: "tailwind" },
      { name: "Node.js", logo: "node" },
      { name: "Express", logo: "express" },
      { name: "Vite", logo: "vite" },
      { name: "Firebase", logo: "firebase" },
      { name: "Vue", logo: "vue" },
    ],
  },
  {
    title: "DevOps",
    skills: [
      { name: "Git", logo: "git" },
      { name: "GitHub Actions", logo: "github actions" },
      { name: "Docker", logo: "docker" },
      { name: "Kubernetes", logo: "kubernetes" },
      { name: "CI/CD", logo: "ci/cd" },
      { name: "Linux", logo: "linux" },
    ],
  },
  {
    title: "Cloud",
    skills: [{ name: "AWS", logo: "aws" }],
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

/* Certificates — the admin uploads the actual PDF/image file per entry.
   Set `url` to a credential/verify link (leave "" to hide the link). */
export const CERTIFICATES = [
  {
    title: "Web Development",
    issuer: "Udemy",
    year: "2024",
    url: "",
    fileUrl: "",
  },
  {
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    year: "2024",
    url: "",
    fileUrl: "",
  },
  {
    title: "Video Editing",
    issuer: "Coursera",
    year: "2023",
    url: "",
    fileUrl: "",
  },
];

/* Project filter chips on the public gallery */
export const PROJECT_CATEGORIES = ["All", "Web", "Video"];

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
    liveUrl: "",
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
    liveUrl: "",
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
    liveUrl: "",
    featured: false,
  },
];