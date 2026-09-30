import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../firebase.js";
import {
  PROFILE,
  HERO,
  ABOUT,
  CONTACT_COPY,
  SECTION_META,
  NAV_LINKS,
  SOCIALS,
  SKILL_CATEGORIES,
  EXPERIENCE,
  CERTIFICATES,
  PROJECT_CATEGORIES,
} from "../data/constants.js";

/* Fallback content — shown while loading, on error, or before the
   admin saves content for the first time. */
export const DEFAULT_CONTENT = {
  profile: PROFILE,
  hero: HERO,
  about: ABOUT,
  contact: CONTACT_COPY,
  sections: SECTION_META,
  navLinks: NAV_LINKS,
  socials: SOCIALS,
  skills: SKILL_CATEGORIES,
  experience: EXPERIENCE,
  certificates: CERTIFICATES,
  projectCategories: PROJECT_CATEGORIES,
};

/** Keys that must stay arrays even when stored empty on purpose. */
const LIST_KEYS = [
  "navLinks",
  "socials",
  "skills",
  "experience",
  "certificates",
  "projectCategories",
];

/**
 * Merges the raw `site/main` Firestore document over the defaults so the
 * public site never breaks on a partially-written document.
 * An array that exists but is empty is respected (admin cleared it).
 */
export function mergeSiteContent(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const out = { ...DEFAULT_CONTENT };

  for (const key of ["profile", "hero", "about", "contact", "sections"]) {
    out[key] = { ...DEFAULT_CONTENT[key], ...(data[key] || {}) };
  }
  for (const key of LIST_KEYS) {
    if (Array.isArray(data[key])) out[key] = data[key];
  }
  return out;
}

const SiteContentContext = createContext(DEFAULT_CONTENT);

/**
 * Live-subscribes to the Firestore document `site/main`.
 * The hidden /admin dashboard edits and saves this document;
 * the public site updates in real time.
 */
export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    if (!firebaseReady || !db) return undefined;
    const unsub = onSnapshot(
      doc(db, "site", "main"),
      (snap) => {
        if (snap.exists()) setContent(mergeSiteContent(snap.data()));
      },
      (err) => console.warn("Site content unavailable, using defaults:", err)
    );
    return unsub;
  }, []);

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}