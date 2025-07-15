import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const pathname = req.url;

  // If user enters wrong user/shop page URL, redirect to the correct one
  if (/\/user\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/user/profile", pathname));
  if (/\/product\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/shop", pathname));

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect to homepage, if the user is:
  //   1. not logged in and trying to access any of the user pages, or
  //   2. logged in and trying to access the reset password page
  if (
    (!token && pathname.includes("user")) ||
    (token && pathname.includes("reset-password"))
  ) {
    return NextResponse.redirect(new URL("/", pathname));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
