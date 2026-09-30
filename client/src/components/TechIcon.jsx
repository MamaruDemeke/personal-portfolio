import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiVite,
  SiNodedotjs,
  SiMongodb,
  SiFirebase,
  SiGit,
  SiGithub,
  SiFigma,
  SiWordpress,
  SiYoutube,
} from "react-icons/si";
import {
  FaClapperboard,
  FaPaintbrush,
  FaPenNib,
} from "react-icons/fa6";

/* name → { Icon, color } — matched case-insensitively against skill names */
const TECH = {
  html: { Icon: SiHtml5, color: "#E44D26" },
  html5: { Icon: SiHtml5, color: "#E44D26" },
  css: { Icon: SiCss, color: "#1572B6" },
  css3: { Icon: SiCss, color: "#1572B6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  js: { Icon: SiJavascript, color: "#F7DF1E" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  react: { Icon: SiReact, color: "#61DAFB" },
  "next.js": { Icon: SiNextdotjs, color: "#FFFFFF" },
  nextjs: { Icon: SiNextdotjs, color: "#FFFFFF" },
  tailwind: { Icon: SiTailwindcss, color: "#38BDF8" },
  tailwindcss: { Icon: SiTailwindcss, color: "#38BDF8" },
  bootstrap: { Icon: SiBootstrap, color: "#7952B3" },
  vite: { Icon: SiVite, color: "#A855F7" },
  node: { Icon: SiNodedotjs, color: "#5FA04E" },
  "node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  nodejs: { Icon: SiNodedotjs, color: "#5FA04E" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  firebase: { Icon: SiFirebase, color: "#FFCA28" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#FFFFFF" },
  figma: { Icon: SiFigma, color: "#F24E1E" },
  wordpress: { Icon: SiWordpress, color: "#21759B" },
  "video editing": { Icon: FaClapperboard, color: "#9999FF" },
  premiere: { Icon: FaClapperboard, color: "#9999FF" },
  "premiere pro": { Icon: FaClapperboard, color: "#9999FF" },
  photoshop: { Icon: FaPaintbrush, color: "#31A8FF" },
  "content creation": { Icon: SiYoutube, color: "#FF0000" },
  youtube: { Icon: SiYoutube, color: "#FF0000" },
  writing: { Icon: FaPenNib, color: "#E2E8F0" },
};

export default function TechIcon({ name, className = "h-3.5 w-3.5" }) {
  const key = String(name || "").toLowerCase().trim();
  const match = TECH[key];
  if (!match) return null;
  const { Icon, color } = match;
  return <Icon className={className} style={{ color }} aria-hidden="true" />;
}
