import {
    fetchTasks,
    addTaskAsync,
    deleteTaskAsync,
    completeTaskAsync,
} from "../../../store/tasks/tasksThunks";
import { TaskService } from "../../../services/tasksService";
import { fetchStats } from "../../../store/stats/userStatsThunks";

jest.mock("../../../services/tasksService");
jest.mock("../../../store/stats/userStatsThunks", () => ({
    fetchStats: jest.fn(() => ({ type: "stats/fetchStats" })),
}));

describe("tasks thunks", () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchTasks", () => {
        it("dispatches fulfilled action with tasks data", async () => {
            const fakeTasks = [{ id: 1, text: "Task 1" }];

            TaskService.getAllTasks.mockResolvedValueOnce({ data: fakeTasks });

            const result = await fetchTasks()(dispatch, getState, undefined);

            expect(TaskService.getAllTasks).toHaveBeenCalledTimes(1);
            expect(result.payload).toEqual(fakeTasks);
            expect(result.type).toBe("tasks/fetchTasks/fulfilled");
        });

        it("dispatches rejected action on failure", async () => {
            TaskService.getAllTasks.mockRejectedValueOnce(new Error("fail"));

            const result = await fetchTasks()(dispatch, getState, undefined);

            expect(TaskService.getAllTasks).toHaveBeenCalledTimes(1);
            expect(result.payload).toBe("Failed to load tasks");
            expect(result.type).toBe("tasks/fetchTasks/rejected");
        });
    });

    describe("addTaskAsync", () => {
        it("dispatches fulfilled action with created task", async () => {
            const newTask = { id: 2, text: "New Task" };

            TaskService.createTask.mockResolvedValueOnce({ data: newTask });

            const payload = {
                text: "New Task",
                deadline: "2025-12-31",
                difficulty: 3,
            };
            const result = await addTaskAsync(payload)(
                dispatch,
                getState,
                undefined
            );

            expect(TaskService.createTask).toHaveBeenCalledWith(payload);
            expect(result.payload).toEqual(newTask);
            expect(result.type).toBe("tasks/addTaskAsync/fulfilled");
        });

        it("dispatches rejected action on failure", async () => {
            TaskService.createTask.mockRejectedValueOnce(new Error("fail"));

            const payload = {
                text: "New Task",
                deadline: "2025-12-31",
                difficulty: 3,
            };
            const result = await addTaskAsync(payload)(
                dispatch,
                getState,
                undefined
            );

            expect(TaskService.createTask).toHaveBeenCalledWith(payload);
            expect(result.payload).toBe("Failed to create task");
            expect(result.type).toBe("tasks/addTaskAsync/rejected");
        });
    });

    describe("deleteTaskAsync", () => {
        it("dispatches fulfilled action with deleted task id", async () => {
            TaskService.deleteTask.mockResolvedValueOnce();

            const taskId = "abc123";
            const result = await deleteTaskAsync(taskId)(
                dispatch,
                getState,
                undefined
            );

            expect(TaskService.deleteTask).toHaveBeenCalledWith(taskId);
            expect(result.payload).toBe(taskId);
            expect(result.type).toBe("tasks/deleteTaskAsync/fulfilled");
        });

        it("dispatches rejected action on failure", async () => {
            TaskService.deleteTask.mockRejectedValueOnce(new Error("fail"));

            const taskId = "abc123";
            const result = await deleteTaskAsync(taskId)(
                dispatch,
                getState,
                undefined
            );

            expect(TaskService.deleteTask).toHaveBeenCalledWith(taskId);
            expect(result.payload).toBe("Failed to delete task");
            expect(result.type).toBe("tasks/deleteTaskAsync/rejected");
        });
    });

    describe("completeTaskAsync", () => {
        it("dispatches fulfilled action with completed task and calls fetchStats", async () => {
            const completedTask = { id: "t1", text: "Completed task" };

            TaskService.completeTask.mockResolvedValueOnce({
                data: { task: completedTask },
            });

            const taskId = "t1";
            const thunkAPI = { dispatch, getState };
            const result = await completeTaskAsync(taskId)(
                dispatch,
                getState,
                thunkAPI
            );

            expect(TaskService.completeTask).toHaveBeenCalledWith(taskId);
            expect(dispatch).toHaveBeenCalledWith(fetchStats());
            expect(result.payload).toEqual(completedTask);
            expect(result.type).toBe("tasks/completeTaskAsync/fulfilled");
        });

        it("dispatches rejected action on failure", async () => {
            TaskService.completeTask.mockRejectedValueOnce(new Error("fail"));

            const taskId = "t1";
            const thunkAPI = {
                dispatch,
                getState,
                rejectWithValue: jest.fn((v) => v),
            };
            const result = await completeTaskAsync(taskId)(
                dispatch,
                getState,
                thunkAPI
            );

            expect(TaskService.completeTask).toHaveBeenCalledWith(taskId);
            expect(result.payload).toBe("Failed to perform task");
            expect(result.type).toBe("tasks/completeTaskAsync/rejected");
        });
    });
});
