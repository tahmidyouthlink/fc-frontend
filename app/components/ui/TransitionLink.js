"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/app/contexts/loading";

export default function TransitionLink({
  children,
  href,
  hasDrawer,
  setIsDrawerOpen,
  ...props
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsPageLoading } = useLoading();

  const handleTransition = (event) => {
    event.preventDefault();

    if (
      !searchParams.get("filterBy")
        ? href !== pathname
        : !href.includes(searchParams.get("filterBy")?.split(" ")?.join("+"))
    ) {
      setIsPageLoading(true);
      if (hasDrawer) setIsDrawerOpen(false);
      router.push(href);
    }
  };

  return (
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
}
