import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import { useFile, fileAnchorProps } from "../hooks/useFile.jsx";
import Icon from "./Icon.jsx";

const HUES = [
  ["#FB7185", "#A78BFA"],
  ["#22D3EE", "#A78BFA"],
  ["#FBBF24", "#FB7185"],
  ["#A3E635", "#22D3EE"],
  ["#A78BFA", "#FB7185"],
  ["#38BDF8", "#A3E635"],
];

function CertLink({ cert, hueA, hueB }) {
  const uri = useFile(cert.file);
  const href = uri || cert.fileUrl || cert.url || "";
  if (!href) return null;
  return (
    <a
      href={href}
      {...fileAnchorProps(href, cert.file?.name)}
      className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors"
      style={{ color: hueA }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hueB;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = hueA;
      }}
    >
      {cert.file || cert.fileUrl ? "View / download" : "View credential"}
      <Icon name="external" className="h-3.5 w-3.5" />
    </a>
  );
}

export default function Certificates() {
  const { certificates } = useSiteContent();

  return (
    <Section id="certificates" eyebrow="certificates" title="Certified" accent="learning">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {certificates.map((cert, i) => {
          const [a, b] = HUES[i % HUES.length];
          return (
            <motion.article
              key={`${cert.title}-${cert.issuer}-${i}`}
              variants={fadeUp}
              style={{ "--hue": a, "--hue-a": a, "--hue-b": b }}
              className="hue-card flex flex-col p-3 sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between sm:mb-4">
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
              {(cert.file || cert.fileUrl || cert.url) && (
                <CertLink cert={cert} hueA={a} hueB={b} />
              )}
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
