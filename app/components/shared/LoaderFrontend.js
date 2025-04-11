"use client";

import { useLoading } from "@/app/contexts/loading";
import LoadingSpinner from "./LoadingSpinner";

export default function LoaderFrontend() {
  const { isPageLoading } = useLoading();

  if (isPageLoading) return <LoadingSpinner />;
}
