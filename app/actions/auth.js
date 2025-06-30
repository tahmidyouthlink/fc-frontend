"use server";

import { cookies } from "next/headers";

export async function removeRefreshToken() {
  cookies().delete("refreshToken");
}
