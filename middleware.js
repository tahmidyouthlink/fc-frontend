import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = cookies().get("user_session")?.value;
  const pathname = request.url;

  // If user enters wrong user/shop page URL, redirect to the correct one
  if (/\/user\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/user/profile", pathname));
  if (/\/product\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/shop", pathname));

  // Redirect to login page, if user tries to access any user page without being logged in
  if (!session && pathname.includes("user")) {
    return NextResponse.redirect(new URL("/", pathname));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
