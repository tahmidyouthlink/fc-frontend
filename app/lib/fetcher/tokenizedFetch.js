import { getServerSession } from "next-auth";
import { authOptions } from "../../utils/authOptions";
import handleResponse from "./handleResponse";

// Fetch for routes that require access token
export const tokenizedFetch = async (path, options = {}) => {
  if (typeof window !== "undefined")
    throw new Error(
      "UnauthorizedError (tokenizedFetch/window): Forbidden in client-side.",
    );

  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error(
      "UnauthorizedError (tokenizedFetch/sessionAccessToken): Access token unavailable inside session.",
    );
  }

  const method = (options.method || "GET").toUpperCase();

  const isGetMethod = method === "GET";
  const hasCustomCache =
    options.cache === "force-cache" ||
    (options.next && "revalidate" in options.next);

  let res = await fetch(`${process.env.BACKEND_URL}${path}`, {
    ...options,
    method,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
    },
    ...(isGetMethod && !hasCustomCache && { cache: "no-store" }),
    credentials: "include", // ensure httpOnly cookie is sent
  });

  return handleResponse(res);
};
