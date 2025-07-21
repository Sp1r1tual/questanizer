import { jest } from "@jest/globals";

const getAllTasks = jest.fn();
const createTask = jest.fn();
const completeTask = jest.fn();
const removeTask = jest.fn();
const applyOverduePenalty = jest.fn();

jest.unstable_mockModule("../../../tasks/services/tasks-service.js", () => ({
    __esModule: true,
    default: {
        getAllTasks,
        createTask,
        completeTask,
        removeTask,
        applyOverduePenalty,
    },
}));

const tasksController = (
    await import("../../../tasks/controllers/tasks-controller.js")
).default;

describe("tasksController", () => {
    const mockUser = { id: "user123" };
    const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getTasks", () => {
        it("should return tasks", async () => {
            getAllTasks.mockResolvedValue([{ id: 1 }, { id: 2 }]);

            const req = { user: mockUser };

            await tasksController.getTasks(req, mockRes, next);

            expect(getAllTasks).toHaveBeenCalledWith("user123");
            expect(mockRes.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
        });

        it("should call next on error", async () => {
            const error = new Error("DB error");

            getAllTasks.mockRejectedValue(error);

            const req = { user: mockUser };

            await tasksController.getTasks(req, mockRes, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("addTask", () => {
        it("should create task and return it", async () => {
            const task = { id: 1, title: "Test" };

            createTask.mockResolvedValue(task);

            const req = { user: mockUser, body: { title: "Test" } };

            await tasksController.addTask(req, mockRes, next);

            expect(createTask).toHaveBeenCalledWith(
                { title: "Test" },
                "user123"
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(task);
        });

        it("should call next on error", async () => {
            const error = new Error("Validation error");

            createTask.mockRejectedValue(error);

            const req = { user: mockUser, body: {} };

            await tasksController.addTask(req, mockRes, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("completeTask", () => {
        it("should complete task", async () => {
            const result = { success: true };

            completeTask.mockResolvedValue(result);

            const req = { user: mockUser, params: { id: "task123" } };

            await tasksController.completeTask(req, mockRes, next);

            expect(completeTask).toHaveBeenCalledWith("task123", "user123");
            expect(mockRes.json).toHaveBeenCalledWith(result);
        });

        it("should call next on error", async () => {
            const error = new Error("Not found");

            completeTask.mockRejectedValue(error);

            const req = { user: mockUser, params: { id: "task123" } };

            await tasksController.completeTask(req, mockRes, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("deleteTask", () => {
        it("should delete task", async () => {
            removeTask.mockResolvedValue();

            const req = { user: mockUser, params: { id: "task123" } };

            await tasksController.deleteTask(req, mockRes, next);

            expect(removeTask).toHaveBeenCalledWith("task123", "user123");
            expect(mockRes.json).toHaveBeenCalledWith();
        });

        it("should call next on error", async () => {
            const error = new Error("Not found");

            removeTask.mockRejectedValue(error);

            const req = { user: mockUser, params: { id: "task123" } };

            await tasksController.deleteTask(req, mockRes, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("takeDamageOverdueTask", () => {
        it("should apply penalty", async () => {
            const result = { penalty: 10 };

            applyOverduePenalty.mockResolvedValue(result);

            const req = { user: mockUser, params: { id: "task123" } };

            await tasksController.takeDamageOverdueTask(req, mockRes, next);

            expect(applyOverduePenalty).toHaveBeenCalledWith(
                "task123",
                "user123"
            );
            expect(mockRes.json).toHaveBeenCalledWith(result);
        });

        it("should call next on error", async () => {
            const error = new Error("Task not found");

            applyOverduePenalty.mockRejectedValue(error);

            const req = { user: mockUser, params: { id: "task123" } };

            await tasksController.takeDamageOverdueTask(req, mockRes, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
