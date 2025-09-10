// Extracts data from settled promises
export const extractData = (result, defaultValue, errorContext, nestedKey) => {
  // Return the data if the promise was fulfilled and the fetch was 'ok'
  if (result.status === "fulfilled" && result.value?.ok) {
    const responseData = result.value.data;

    // If a nestedKey is provided, return that specific property
    if (nestedKey) {
      return responseData?.[nestedKey] || defaultValue;
    }

    return responseData || defaultValue;
  }
  // Log an error if the promise was rejected or the fetch was not 'ok'
  if (result.status === "rejected") {
    console.error(
      `FetchError (${errorContext}):`,
      result.reason?.message || result.reason,
    );
  } else if (result.value && !result.value.ok) {
    console.error(
      `FetchError (${errorContext}):`,
      result.value?.message || "Request failed",
    );
  }
  return defaultValue;
};
