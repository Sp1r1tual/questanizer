const searchInFields = (fields = [], query) => {
    if (!query?.trim() || fields.length === 0) return {};

    const regex = new RegExp(query.trim(), "i");

    return {
        $or: fields.map((field) => ({ [field]: regex })),
    };
};

export { searchInFields };
