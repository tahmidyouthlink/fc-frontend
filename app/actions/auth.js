"use server";

import { cookies } from "next/headers";

export async function createSession(token) {
  cookies().set("user_session", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 3 * 1000, // 3 days
    path: "/",
  });
}

export async function removeSession() {
  cookies().delete("user_session");
}
