import {
  SiPython,
  SiMysql,
  SiGnubash,
  SiExpress,
  SiVuedotjs,
  SiGithubactions,
  SiDocker,
  SiKubernetes,
  SiCircleci,
  SiLinux,
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
  FaCloud,
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
  python: { Icon: SiPython, color: "#3776AB" },
  sql: { Icon: SiMysql, color: "#4479A1" },
  bash: { Icon: SiGnubash, color: "#4EAA25" },
  express: { Icon: SiExpress, color: "#FFFFFF" },
  vue: { Icon: SiVuedotjs, color: "#4FC08D" },
  "github actions": { Icon: SiGithubactions, color: "#2088FF" },
  githubactions: { Icon: SiGithubactions, color: "#2088FF" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
  "ci/cd": { Icon: SiCircleci, color: "#F01F3D" },
  cicd: { Icon: SiCircleci, color: "#F01F3D" },
  linux: { Icon: SiLinux, color: "#FCC624" },
  aws: { Icon: FaCloud, color: "#FF9900" },
  cloud: { Icon: FaCloud, color: "#FF9900" },
  "video editing": { Icon: FaClapperboard, color: "#9999FF" },
  premiere: { Icon: FaClapperboard, color: "#9999FF" },
  "premiere pro": { Icon: FaClapperboard, color: "#9999FF" },
  photoshop: { Icon: FaPaintbrush, color: "#31A8FF" },
  "content creation": { Icon: SiYoutube, color: "#FF0000" },
  youtube: { Icon: SiYoutube, color: "#FF0000" },
  writing: { Icon: FaPenNib, color: "#E2E8F0" },
};

/* Canonical logo keys offered by the admin skill picker */
export const TECH_LOGOS = [
  "html",
  "css",
  "javascript",
  "typescript",
  "python",
  "sql",
  "bash",
  "react",
  "next.js",
  "tailwind",
  "bootstrap",
  "vite",
  "node",
  "express",
  "vue",
  "mongodb",
  "firebase",
  "git",
  "github",
  "github actions",
  "docker",
  "kubernetes",
  "ci/cd",
  "linux",
  "aws",
  "figma",
  "wordpress",
  "premiere pro",
  "photoshop",
  "content creation",
  "youtube",
];

export default function TechIcon({
  name,
  className = "h-3.5 w-3.5",
  color: colorOverride,
}) {
  const key = String(name || "").toLowerCase().trim();
  const match = TECH[key];
  if (!match) return null;
  const { Icon, color } = match;
  return (
    <Icon
      className={className}
      style={{ color: colorOverride || color }}
      aria-hidden="true"
    />
  );
}
