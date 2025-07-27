const validateSearchQuery = (query, currentUsername) => {
    const trimmed = query.trim();

    if (!trimmed) {
        return { valid: false, error: "Search query cannot be empty" };
    }

    if (
        currentUsername &&
        trimmed.toLowerCase() === currentUsername.toLowerCase()
    ) {
        return { valid: false, error: "You cannot search for yourself" };
    }

    return { valid: true, error: null };
};

export { validateSearchQuery };
