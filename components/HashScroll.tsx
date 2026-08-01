"use client";

import { useEffect } from "react";

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const id = decodeURIComponent(hash.slice(1));
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HashScroll() {
  useEffect(() => {
    const t = window.setTimeout(scrollToHash, 100);
    const onHashChange = () => {
      window.setTimeout(scrollToHash, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
