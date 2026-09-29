import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseReady } from "../firebase.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setUser(null);
      setAuthLoading(false);
      return undefined;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  return { user, authLoading };
}
