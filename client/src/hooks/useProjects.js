import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, firebaseReady } from "../firebase.js";
import { SEED_PROJECTS } from "../data/constants.js";

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
          setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
