"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GAClientTracker() {
  const pathname = usePathname();
  const search = useSearchParams()?.toString() ?? "";

  useEffect(() => {
    if (!window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: pathname + (search ? `?${search}` : ""),
      page_location: window.location.href,
    });
  }, [pathname, search]);

  return null;
}
