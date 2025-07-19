import { useDispatch, useSelector } from "react-redux";
import useOverdueTasksChecker from "../../../hooks/tasks/useOverdueTasksChecker";

import { renderHook, act } from "@testing-library/react";
import { TaskService } from "../../../services/tasksService";
import { markDamageTaken } from "../../../store/tasks/tasksSlice";
import { markTaskAsRaged } from "../../../store/boss/bossBattleSlice";
import { fetchStats } from "../../../store/stats/userStatsThunks";

jest.mock("react-redux");
jest.mock("../../../services/tasksService");
jest.mock("../../../store/tasks/tasksSlice", () => ({
    markDamageTaken: jest.fn((id) => ({
        type: "markDamageTaken",
        payload: id,
    })),
}));
jest.mock("../../../store/boss/bossBattleSlice", () => ({
    markTaskAsRaged: jest.fn((id) => ({
        type: "markTaskAsRaged",
        payload: id,
    })),
}));
jest.mock("../../../store/stats/userStatsThunks", () => ({
    fetchStats: jest.fn(() => ({ type: "fetchStats" })),
}));

describe("useOverdueTasksChecker", () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useDispatch.mockReturnValue(dispatchMock);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("does nothing if there are no overdue tasks", async () => {
        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    tasks: [
                        {
                            _id: "1",
                            isCompleted: true,
                            deadline: "2025-01-01T00:00:00Z",
                            damageTaken: false,
                        },
                    ],
                },
                bossBattle: {
                    bossId: null,
                    alreadyRagedTaskIds: [],
                },
            })
        );

        renderHook(() => useOverdueTasksChecker());

        await act(() => Promise.resolve());

        expect(TaskService.takeDamageOverdueTask).not.toHaveBeenCalled();
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it("processes overdue tasks, dispatches actions and calls service", async () => {
        const now = new Date("2024-01-01T00:00:00Z");

        jest.useFakeTimers("modern");
        jest.setSystemTime(now);

        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    tasks: [
                        {
                            _id: "1",
                            isCompleted: false,
                            deadline: "2023-12-31T23:59:59Z",
                            damageTaken: false,
                        },
                        {
                            _id: "2",
                            isCompleted: false,
                            deadline: "2025-01-01T00:00:00Z",
                            damageTaken: false,
                        },
                    ],
                },
                bossBattle: {
                    bossId: "boss123",
                    alreadyRagedTaskIds: [],
                },
            })
        );

        TaskService.takeDamageOverdueTask.mockResolvedValue({});

        renderHook(() => useOverdueTasksChecker());

        await act(async () => {});

        expect(TaskService.takeDamageOverdueTask).toHaveBeenCalledTimes(1);
        expect(TaskService.takeDamageOverdueTask).toHaveBeenCalledWith("1");

        expect(dispatchMock).toHaveBeenCalledWith(markDamageTaken("1"));
        expect(dispatchMock).toHaveBeenCalledWith(markTaskAsRaged("1"));
        expect(dispatchMock).toHaveBeenCalledWith(fetchStats());

        jest.runOnlyPendingTimers();
    });

    it("does not dispatch markTaskAsRaged if task already raged", async () => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date("2024-01-01T00:00:00Z"));

        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    tasks: [
                        {
                            _id: "1",
                            isCompleted: false,
                            deadline: "2023-12-31T23:59:59Z",
                            damageTaken: false,
                        },
                    ],
                },
                bossBattle: {
                    bossId: "boss123",
                    alreadyRagedTaskIds: ["1"],
                },
            })
        );

        TaskService.takeDamageOverdueTask.mockResolvedValue({});

        renderHook(() => useOverdueTasksChecker());

        await act(async () => {});

        expect(dispatchMock).toHaveBeenCalledWith(markDamageTaken("1"));
        expect(dispatchMock).not.toHaveBeenCalledWith(markTaskAsRaged("1"));
        expect(dispatchMock).toHaveBeenCalledWith(fetchStats());
    });

    it("handles errors from service gracefully", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});

        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    tasks: [
                        {
                            _id: "1",
                            isCompleted: false,
                            deadline: "2023-12-31T23:59:59Z",
                            damageTaken: false,
                        },
                    ],
                },
                bossBattle: {
                    bossId: null,
                    alreadyRagedTaskIds: [],
                },
            })
        );

        TaskService.takeDamageOverdueTask.mockRejectedValue(new Error("fail"));

        renderHook(() => useOverdueTasksChecker());

        await act(async () => {});

        expect(console.error).toHaveBeenCalledWith(
            "Overdue damage error:",
            expect.any(Error)
        );

        console.error.mockRestore();
    });
});
