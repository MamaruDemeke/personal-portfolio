import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";

const HUES = [
  ["#FB7185", "#A78BFA"],
  ["#22D3EE", "#A78BFA"],
  ["#FBBF24", "#FB7185"],
  ["#A3E635", "#22D3EE"],
  ["#A78BFA", "#FB7185"],
  ["#38BDF8", "#A3E635"],
];

export default function Certificates() {
  const { certificates } = useSiteContent();

  return (
    <Section id="certificates" eyebrow="certificates" title="Certified" accent="learning">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => {
          const [a, b] = HUES[i % HUES.length];
          return (
            <motion.article
              key={`${cert.title}-${cert.issuer}-${i}`}
              variants={fadeUp}
              style={{ "--hue": a, "--hue-a": a, "--hue-b": b }}
              className="hue-card flex flex-col p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: `${a}1F`, color: a }}
                >
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
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors"
                  style={{ color: a }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = b;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = a;
                  }}
                >
                  {cert.fileUrl ? "View / download" : "View credential"}
                  <Icon name="external" className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
