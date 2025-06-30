"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function GoogleSignInWindow() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const sendResult = (isSuccessful) => {
      if (window.opener) {
        window.opener.isLoginSuccessful = isSuccessful;
        window.close();
      }
    };

    const handleGoogleLogin = async () => {
      try {
        const result = await signIn("google", { redirect: false });

        if (result?.error) {
          console.error("LoginError (googleWindow/signIn):", result.error);
          sendResult(false);
        }
      } catch (error) {
        console.error(
          "LoginError (googleWindow/catch):",
          error.message || error,
        );
        sendResult(false);
      }
    };

    if (status !== "loading" && !session) {
      handleGoogleLogin();
    } else if (session) {
      sendResult(true);
    }
  }, [session, status]);

  return <div></div>;
}
