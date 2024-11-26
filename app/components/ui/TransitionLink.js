"use client";

import { useLoading } from "@/app/contexts/loading";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TransitionLink({
  children,
  href,
  hasModal,
  setIsModalOpen,
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
      if (hasModal) setIsModalOpen(false);
      router.push(href);
    }
  };

  return (
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
}