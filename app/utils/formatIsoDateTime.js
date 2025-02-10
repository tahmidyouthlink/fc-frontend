export function formatIsoDateTime(dateIsoString) {
  const date = new Date(dateIsoString);

  // Format the date part
  const datePart = date
    .toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    })
    .replace(",", ""); // Remove the comma after the day

  // Format the time part
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Combine and return the result
  return `${datePart}, ${timePart}`;
}
