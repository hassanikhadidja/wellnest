"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      scrollToTop();
    }
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    scrollToTop();
  }, [pathname]);

  return null;
}
