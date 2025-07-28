export default function customCurrentDateTimeFormat() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;
  const hours = parts.find((p) => p.type === "hour").value;
  const minutes = parts.find((p) => p.type === "minute").value;

  return `${day}-${month}-${year} | ${hours}:${minutes}`;
}
