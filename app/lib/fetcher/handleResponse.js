// Handles response parsing and error catching
export default async function handleResponse(res) {
  const contentType = res.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;
  let message = "";
  let ok = res.ok;
  let status = res.status;

  try {
    const text = await res.text();

    if (isJson && text) {
      data = JSON.parse(text);
      message = data?.message || data?.error || res.statusText;
    } else {
      message = res.statusText || "No content";
    }
  } catch (error) {
    console.error("Failed to parse JSON:", error.message || error);
    return {
      ok: false,
      status,
      message: "Invalid response format",
      data: null,
    };
  }

  return {
    ok,
    status,
    message,
    data,
  };
}
