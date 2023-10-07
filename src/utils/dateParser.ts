export function dateParser(date: Date) {
  const dateString = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: true,
    hour: "2-digit",
  });
  const month = dateString.split(" ")[0];
  const day = dateString.split(" ")[1].replace(",", "");

  return {
    month,
    day,
    year: dateString.split(" ")[2].replace(",", ""),
    time: dateString.split(" ")[3],
    postDateFormat: `${month} ${day}`,
    dateString,
  };
}
