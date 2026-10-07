import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, firebaseReady } from "../firebase.js";

/* Memoizes loaded files so the same document is never fetched twice and
   repeated renders don't re-fetch a file they already have. */
const loaded = new Map();

/**
 * Loads a file that was uploaded through the admin dashboard and stored in
 * Firestore as base64 (the free, no-card upload destination — see fields.jsx).
 * `fileRef` has the shape { fileId, name, type, size } and comes from the
 * site/main document (cv, certificates).
 * Returns a data URI that can be used in <img>, <iframe>, or an anchor href.
 */
export function useFile(fileRef) {
  const id = fileRef?.fileId;
  const [uri, setUri] = useState(() =>
    id && loaded.has(id) ? loaded.get(id) : ""
  );

  useEffect(() => {
    if (!firebaseReady || !db || !id) return undefined;
    if (loaded.has(id)) {
      setUri(loaded.get(id));
      return undefined;
    }
    let alive = true;
    getDoc(doc(db, "files", id))
      .then((snap) => {
        if (!alive) return;
        if (snap.exists()) {
          const data = snap.data();
          const uriValue = data.data
            ? `data:${data.type || "application/octet-stream"};base64,${data.data}`
            : "";
          loaded.set(id, uriValue);
          setUri(uriValue);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  return uri;
}

/* Anchor attributes that behave correctly for both normal URLs and data URIs.
   Browsers block top-frame navigation to data URIs, so those get a download
   attribute instead of target="_blank". */
export function fileAnchorProps(href, name) {
  if (!href) return {};
  if (href.startsWith("data:")) return { download: name || "file" };
  return { target: "_blank", rel: "noreferrer" };
}