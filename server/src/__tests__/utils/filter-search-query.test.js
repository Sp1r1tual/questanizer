const { filterSearchQuery } = await import(
    "../../shared/utils/search-filters/filter-search-query.js"
);

describe("filterSearchQuery", () => {
    it("returns empty object when query is empty", () => {
        expect(filterSearchQuery(["name"], "")).toEqual({});
        expect(filterSearchQuery(["name"], "   ")).toEqual({});
        expect(filterSearchQuery(["name"], null)).toEqual({});
        expect(filterSearchQuery(["name"], undefined)).toEqual({});
    });

    it("returns empty object when fields array is empty", () => {
        expect(filterSearchQuery([], "test")).toEqual({});
    });

    it("creates $or filter for single field", () => {
        const result = filterSearchQuery(["username"], "john");

        expect(result).toEqual({
            $or: [{ username: expect.any(RegExp) }],
        });

        const regex = result.$or[0].username;

        expect(regex.source).toBe("john");
        expect(regex.flags).toBe("i");
    });

    it("creates $or filter for multiple fields", () => {
        const result = filterSearchQuery(["username", "email", "bio"], "test");

        expect(result).toEqual({
            $or: [
                { username: expect.any(RegExp) },
                { email: expect.any(RegExp) },
                { bio: expect.any(RegExp) },
            ],
        });

        result.$or.forEach((condition) => {
            const regex = Object.values(condition)[0];

            expect(regex.source).toBe("test");
            expect(regex.flags).toBe("i");
        });
    });

    it("trims whitespace from query", () => {
        const result = filterSearchQuery(["name"], "  john  ");

        const regex = result.$or[0].name;

        expect(regex.source).toBe("john");
    });

    it("creates case-insensitive regex", () => {
        const result = filterSearchQuery(["username"], "JOHN");

        const regex = result.$or[0].username;

        expect(regex.flags).toBe("i");
        expect("john").toMatch(regex);
        expect("JOHN").toMatch(regex);
        expect("John").toMatch(regex);
    });

    it("handles special regex characters", () => {
        const result = filterSearchQuery(["username"], "user.name+test");

        const regex = result.$or[0].username;

        expect(regex.source).toBe("user.name+test");
    });

    it("handles empty fields array", () => {
        const result = filterSearchQuery([], "test");

        expect(result).toEqual({});
    });

    it("handles undefined fields", () => {
        const result = filterSearchQuery(undefined, "test");

        expect(result).toEqual({});
    });
});
