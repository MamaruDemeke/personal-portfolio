import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../firebase.js";
import {
  PROFILE,
  SKILL_CATEGORIES,
  EXPERIENCE,
  CERTIFICATES,
} from "../data/constants.js";

/* Fallback content — shown while loading, on error, or before the
   admin saves content for the first time. */
export const DEFAULT_CONTENT = {
  profile: PROFILE,
  skills: SKILL_CATEGORIES,
  experience: EXPERIENCE,
  certificates: CERTIFICATES,
};

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
        if (snap.exists()) {
          const d = snap.data();
          setContent({
            profile: { ...DEFAULT_CONTENT.profile, ...(d.profile || {}) },
            skills: d.skills?.length ? d.skills : DEFAULT_CONTENT.skills,
            experience: d.experience?.length
              ? d.experience
              : DEFAULT_CONTENT.experience,
            certificates: d.certificates?.length
              ? d.certificates
              : DEFAULT_CONTENT.certificates,
          });
        }
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
