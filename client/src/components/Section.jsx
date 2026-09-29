import { motion } from "framer-motion";

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

export default function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-6 py-24 ${className}`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.p variants={fadeUp} className="section-title">
          {`// ${eyebrow}`}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mb-12 text-3xl font-bold text-white md:text-4xl"
        >
          {title}
        </motion.h2>
        {children}
      </motion.div>
    </section>
  );
}
