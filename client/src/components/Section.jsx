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
    <section id={id} className={`mx-auto max-w-6xl px-6 py-28 ${className}`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {e && <motion.p variants={fadeUp} className="section-title">{e}</motion.p>}
        <motion.h2
          variants={fadeUp}
          className="mb-14 font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          {t}{" "}
          {a && (
            <span className="serif-accent bg-gradient-to-r from-accent to-mint bg-clip-text pr-2 font-normal text-transparent">
              {a}
            </span>
          )}
        </motion.h2>
        {children}
      </motion.div>
    </section>
  );
}