const validateSearchQueryMiddleware = (req, res, next) => {
    const { query, page, limit } = req.query;

    if (!query?.trim()) {
        return res
            .status(400)
            .json({ message: "Query string cannot be empty." });
    }

    if (page && (isNaN(page) || parseInt(page) < 1)) {
        return res
            .status(400)
            .json({ message: "Page must be a positive number." });
    }

    if (
        limit &&
        (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)
    ) {
        return res
            .status(400)
            .json({ message: "Limit must be between 1 and 100." });
    }

    next();
};

export { validateSearchQueryMiddleware };
