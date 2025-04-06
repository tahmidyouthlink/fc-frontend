"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function GoogleSignInWindow() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!(status === "loading") && !session) void signIn("google");
    if (session) window.close();
  }, [session, status]);

  return <div></div>;
}
