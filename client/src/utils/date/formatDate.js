const formatDate = (dateString, fallback = "Unknown") => {
    if (!dateString) return fallback;

    const date = new Date(dateString);

    if (isNaN(date)) return fallback;

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export { formatDate };
