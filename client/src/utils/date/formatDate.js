const formatDate = (dateString, fallback = "Unknown") => {
  if (!dateString) return fallback;

  const date = new Date(dateString);

  if (isNaN(date)) return fallback;

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export { formatDate };
