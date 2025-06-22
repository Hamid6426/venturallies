export default function formatDate(dateInput, fallback = "—") {
  if (!dateInput) return fallback;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
