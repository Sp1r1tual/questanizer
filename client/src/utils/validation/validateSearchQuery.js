const validateSearchQuery = (query, currentUserId, currentUsername) => {
  const trimmed = query.trim();

  if (!trimmed) {
    return { valid: false, error: "validation.searchQueryEmpty" };
  }

  if (currentUsername && trimmed.toLowerCase() === currentUsername.toLowerCase()) {
    return { valid: false, error: "validation.searchQuerySelf" };
  }

  if (currentUserId) {
    if (trimmed === currentUserId) {
      return { valid: false, error: "validation.searchQuerySelf" };
    }
  }

  return { valid: true, error: null };
};

export { validateSearchQuery };
