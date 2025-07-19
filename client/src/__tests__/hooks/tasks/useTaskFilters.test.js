import useTaskFilters from "../../../hooks/tasks/useTaskFilters";

describe("useTaskFilters", () => {
    const { getFilteredTasks } = useTaskFilters();

    const baseTasks = [
        {
            id: 1,
            isCompleted: false,
            deadline: "2025-01-01T10:00:00Z",
            difficulty: "easy",
            createdAt: "2024-01-01T10:00:00Z",
        },
        {
            id: 2,
            isCompleted: true,
            deadline: "2023-01-01T10:00:00Z",
            difficulty: "hard",
            createdAt: "2024-01-02T10:00:00Z",
        },
        {
            id: 3,
            isCompleted: false,
            deadline: null,
            difficulty: "medium",
            createdAt: "2024-01-03T10:00:00Z",
        },
        {
            id: 4,
            isCompleted: false,
            deadline: "2022-12-31T10:00:00Z",
            difficulty: "critical",
            createdAt: "2024-01-04T10:00:00Z",
        },
    ];

    const now = new Date("2024-01-01T00:00:00Z");

    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(now);
    });
    afterAll(() => {
        jest.useRealTimers();
    });

    it("filters by status 'completed'", () => {
        const filters = {
            status: "completed",
            deadline: "all",
            difficulty: "all",
            sortBy: "createdAt",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result.every((t) => t.isCompleted)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(2);
    });

    it("filters by status 'not completed'", () => {
        const filters = {
            status: "not_completed",
            deadline: "all",
            difficulty: "all",
            sortBy: "createdAt",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result.every((t) => !t.isCompleted)).toBe(true);
        expect(result.length).toBe(3);
    });

    it("filters by deadline 'overdue'", () => {
        const filters = {
            status: "all",
            deadline: "overdue",
            difficulty: "all",
            sortBy: "createdAt",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(4);
    });

    it("filters by deadline 'upcoming'", () => {
        const filters = {
            status: "all",
            deadline: "upcoming",
            difficulty: "all",
            sortBy: "createdAt",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(1);
    });

    it("filters by deadline 'none'", () => {
        const filters = {
            status: "all",
            deadline: "none",
            difficulty: "all",
            sortBy: "createdAt",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(3);
    });

    it("filters by difficulty", () => {
        const filters = {
            status: "all",
            deadline: "all",
            difficulty: "hard",
            sortBy: "createdAt",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result.length).toBe(1);
        expect(result[0].difficulty).toBe("hard");
    });

    it("sorts by createdAt descending", () => {
        const filters = {
            status: "all",
            deadline: "all",
            difficulty: "all",
            sortBy: "createdAt",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result[0].createdAt).toBe("2024-01-04T10:00:00Z");
        expect(result[result.length - 1].createdAt).toBe(
            "2024-01-01T10:00:00Z"
        );
    });

    it("sorts by deadline ascending", () => {
        const filters = {
            status: "all",
            deadline: "all",
            difficulty: "all",
            sortBy: "deadline",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result[0].deadline).toBeNull();
        expect(result[result.length - 1].deadline).toBe("2025-01-01T10:00:00Z");
    });

    it("sorts by difficulty ascending", () => {
        const filters = {
            status: "all",
            deadline: "all",
            difficulty: "all",
            sortBy: "difficulty",
        };

        const result = getFilteredTasks(baseTasks, filters);

        expect(result.map((t) => t.difficulty)).toEqual([
            "easy",
            "medium",
            "hard",
            "critical",
        ]);
    });
});
