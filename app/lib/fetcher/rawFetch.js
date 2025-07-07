import handleResponse from "./handleResponse";

// Fetch for routes that do not require access token
export const rawFetch = async (path, options = {}) => {
  const backendUrl =
    typeof window === "undefined"
      ? process.env.BACKEND_URL
      : process.env.NEXT_PUBLIC_BACKEND_URL;

  const method = (options.method || "GET").toUpperCase();
  const isGetMethod = method === "GET";
  const hasCustomCache =
    options.cache === "force-cache" ||
    (options.next && "revalidate" in options.next);

  const headers = {
    ...(options.headers || {}),
  };

  const isFormData = options.body instanceof FormData;
  const isContentTypeNotSet =
    !headers["Content-Type"] && !headers["content-type"];

  if (options.body && !isFormData && isContentTypeNotSet) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${backendUrl}${path}`, {
    ...options,
    method,
    headers,
    ...(isGetMethod && !hasCustomCache && { cache: "no-store" }),
  });

  return handleResponse(res);
};
