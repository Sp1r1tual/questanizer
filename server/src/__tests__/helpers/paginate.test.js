import { jest } from "@jest/globals";

const mockModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
};

const mockQuery = {
    skip: jest.fn(),
    limit: jest.fn(),
    sort: jest.fn(),
    select: jest.fn(),
    populate: jest.fn(),
    exec: jest.fn(),
};

const { paginate } = await import("../../shared/helpers/paginate.js");

describe("paginate", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockQuery.skip.mockReturnThis();
        mockQuery.limit.mockReturnThis();
        mockQuery.sort.mockReturnThis();
        mockQuery.select.mockReturnThis();
        mockQuery.populate.mockReturnThis();

        mockModel.find.mockReturnValue(mockQuery);
    });

    it("returns paginated results with default options", async () => {
        const mockResults = [{ id: 1 }, { id: 2 }];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(25);

        const result = await paginate(mockModel);

        expect(mockModel.find).toHaveBeenCalledWith({}, null);
        expect(mockQuery.skip).toHaveBeenCalledWith(0);
        expect(mockQuery.limit).toHaveBeenCalledWith(10);
        expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
        expect(mockModel.countDocuments).toHaveBeenCalledWith({});

        expect(result).toEqual({
            results: mockResults,
            total: 25,
            page: 1,
            limit: 10,
            totalPages: 3,
            hasMore: true,
        });
    });

    it("handles custom page and limit", async () => {
        const mockResults = [{ id: 3 }, { id: 4 }];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(25);

        const result = await paginate(mockModel, {}, { page: 3, limit: 5 });

        expect(mockQuery.skip).toHaveBeenCalledWith(10);
        expect(mockQuery.limit).toHaveBeenCalledWith(5);
        expect(result.page).toBe(3);
        expect(result.limit).toBe(5);
        expect(result.totalPages).toBe(5);
    });

    it("handles conditions and projection", async () => {
        const conditions = { active: true };
        const projection = { name: 1, email: 1 };
        const mockResults = [];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(0);

        await paginate(mockModel, conditions, { projection });

        expect(mockModel.find).toHaveBeenCalledWith(conditions, projection);
        expect(mockModel.countDocuments).toHaveBeenCalledWith(conditions);
    });

    it("applies select when provided", async () => {
        const mockResults = [];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(0);

        await paginate(mockModel, {}, { select: "name email" });

        expect(mockQuery.select).toHaveBeenCalledWith("name email");
    });

    it("applies populate when provided", async () => {
        const mockResults = [];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(0);

        await paginate(mockModel, {}, { populate: "user" });

        expect(mockQuery.populate).toHaveBeenCalledWith("user");
    });

    it("applies custom sort", async () => {
        const mockResults = [];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(0);

        await paginate(mockModel, {}, { sort: { name: 1 } });

        expect(mockQuery.sort).toHaveBeenCalledWith({ name: 1 });
    });

    it("enforces minimum page number", async () => {
        const mockResults = [];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(0);

        const result = await paginate(mockModel, {}, { page: -5 });

        expect(mockQuery.skip).toHaveBeenCalledWith(0);
        expect(result.page).toBe(1);
    });

    it("enforces limit boundaries", async () => {
        const mockResults = [];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(0);

        await paginate(mockModel, {}, { limit: -10 });
        expect(mockQuery.limit).toHaveBeenCalledWith(1);

        await paginate(mockModel, {}, { limit: 200 });
        expect(mockQuery.limit).toHaveBeenCalledWith(100);
    });

    it("calculates hasMore correctly when no more results", async () => {
        const mockResults = [{ id: 1 }];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(5);

        const result = await paginate(mockModel, {}, { page: 5, limit: 2 });

        expect(result.hasMore).toBe(false);
    });

    it("handles string page and limit inputs", async () => {
        const mockResults = [];

        mockQuery.exec.mockResolvedValue(mockResults);
        mockModel.countDocuments.mockResolvedValue(0);

        const result = await paginate(
            mockModel,
            {},
            { page: "2", limit: "15" }
        );

        expect(mockQuery.skip).toHaveBeenCalledWith(15);
        expect(mockQuery.limit).toHaveBeenCalledWith(15);
        expect(result.page).toBe(2);
        expect(result.limit).toBe(15);
    });
});
