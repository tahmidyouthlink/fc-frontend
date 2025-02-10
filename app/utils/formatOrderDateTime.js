export default function formatOrderDateTime(dateTime) {
  if (!dateTime)
    return {
      orderMonthFirstThreeLetters: "",
      orderMonthRestOfLetters: "",
      orderDayAndYear: "",
      orderTime: "",
    };

  const [datePart, timePart] = dateTime.split(" | ");
  const [day, month, year] = datePart.split("-");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthFull = months[parseInt(month, 10) - 1];
  const fullYear = parseInt(year, 10) + 2000;

  const [hour, minute] = timePart.split(":").map(Number);
  const amPm = hour >= 12 ? "PM" : "AM";
  const hourInTwelveHourFormat = hour % 12 === 0 ? 12 : hour % 12;
  const formattedHour = String(hourInTwelveHourFormat).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");
  const formattedTime = `${formattedHour}:${formattedMinute} ${amPm}`;

  return {
    orderMonthFirstThreeLetters: monthFull.slice(0, 3),
    orderMonthRestOfLetters: monthFull.slice(3),
    orderDayAndYear: `${day} ${fullYear}`,
    orderTime: formattedTime,
  };
}
