import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, firebaseReady } from "../firebase.js";
import { SEED_PROJECTS } from "../data/constants.js";

/**
 * Admin-defined `order` wins; anything un-ordered falls back to newest-first.
 * Sorting client-side avoids needing a composite Firestore index.
 */
export function sortProjects(list) {
  return [...list].sort((a, b) => {
    const ao = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
    const bo = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
  });
}

/**
 * Live-subscribes to the Firestore `projects` collection.
 * Falls back to SEED_PROJECTS while loading, on error, or when empty.
 * When Firebase is not configured, seed data is used directly.
 */
export default function useProjects() {
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!firebaseReady || !db) {
      setProjects(SEED_PROJECTS);
      setIsLive(false);
      setLoading(false);
      return undefined;
    }
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setProjects(SEED_PROJECTS);
          setIsLive(false);
        } else {
          setProjects(sortProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
          setIsLive(true);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore projects unavailable, using seed data:", err);
        setProjects(SEED_PROJECTS);
        setIsLive(false);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { projects, loading, isLive };
}
