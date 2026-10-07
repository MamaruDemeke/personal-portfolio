import { motion } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent.jsx";

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/**
 * Section wrapper. Headings and visibility come from the editable
 * `sections` map in site content; the props are only fallbacks.
 */
/**
 * Each section gets its own colour identity so the page reads as a sequence of
 * distinct zones rather than one flat green page. Colours are passed as CSS
 * custom properties so the classes stay static and Tailwind can still purge.
 */
export const SECTION_HUES = {
  hero: ["#10B981", "#22D3EE"],
  about: ["#22D3EE", "#A78BFA"],
  skills: ["#A78BFA", "#FB7185"],
  experience: ["#FBBF24", "#FB7185"],
  projects: ["#38BDF8", "#A78BFA"],
  certificates: ["#FB7185", "#A78BFA"],
  contact: ["#A3E635", "#22D3EE"],
};

function hueStyle(id) {
  const [a, b] = SECTION_HUES[id] || SECTION_HUES.hero;
  return { "--hue-a": a, "--hue-b": b, "--hue": a };
}

export default function Section({
  id,
  eyebrow,
  title,
  accent,
  children,
  className = "",
}) {
  const { sections } = useSiteContent();
  const meta = sections?.[id] || {};

  if (meta.visible === false) return null;

  const e = meta.eyebrow ?? eyebrow;
  const t = meta.title ?? title;
  const a = meta.accent ?? accent;

  return (
    <section
      id={id}
      style={hueStyle(id)}
      className={`relative mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-14 ${className}`}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10"
      >
        {e && <motion.p variants={fadeUp} className="section-title">{e}</motion.p>}
        <motion.h2
          variants={fadeUp}
          className="mb-8 font-display text-2xl font-extrabold tracking-tight text-white sm:mb-12 md:text-4xl"
        >
          {t}{" "}
          {a && (
            <span className="serif-accent grad-text pr-2 font-normal">{a}</span>
          )}
        </motion.h2>
        {children}
      </motion.div>
    </section>
  );
}