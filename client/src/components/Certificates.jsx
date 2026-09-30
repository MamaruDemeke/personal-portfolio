import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";

export default function Certificates() {
  const { certificates } = useSiteContent();

  return (
    <Section id="certificates" eyebrow="certificates" title="Certified" accent="learning">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <motion.article
            key={`${cert.title}-${cert.issuer}-${i}`}
            variants={fadeUp}
            className="glass-card glass-card-hover card-sheen flex flex-col p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon name="award" className="h-5 w-5" />
              </span>
              <span className="font-mono text-sm text-slate-500">
                {cert.year}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold leading-snug text-white">
              {cert.title}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{cert.issuer}</p>
            {(cert.fileUrl || cert.url) && (
              <a
                href={cert.fileUrl || cert.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-mint"
              >
                {cert.fileUrl ? "View / download" : "View credential"}
                <Icon name="external" className="h-3.5 w-3.5" />
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
