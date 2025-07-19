import { useDispatch, useSelector } from "react-redux";
import useTaskActions from "../../../hooks/tasks/useTaskActions";
import useBoss from "../../../hooks/boss/useBoss";

import { renderHook, act } from "@testing-library/react";

import {
    closeConfirmModal,
    openConfirmModal,
} from "../../../store/tasks/tasksSlice";

import { deleteTaskAsync } from "../../../store/tasks/tasksThunks";

jest.mock("react-redux");
jest.mock("../../../hooks/boss/useBoss");
jest.mock("../../../store/tasks/tasksSlice", () => ({
    openConfirmModal: jest.fn((payload) => ({
        type: "OPEN_CONFIRM_MODAL",
        payload,
    })),
    closeConfirmModal: jest.fn(() => ({ type: "CLOSE_CONFIRM_MODAL" })),
}));
jest.mock("../../../store/tasks/tasksThunks", () => ({
    deleteTaskAsync: jest.fn((id) => ({
        type: "DELETE_TASK_ASYNC",
        payload: id,
    })),
    completeTaskAsync: jest.fn((id) => (dispatch) => {
        dispatch({ type: "COMPLETE_TASK_ASYNC", payload: id });

        return Promise.resolve();
    }),
}));

describe("useTaskActions", () => {
    let dispatchMock;
    let handleTaskCompletedMock;

    const tasksMock = [
        {
            _id: "1",
            text: "Task 1",
            isCompleted: false,
            difficulty: "easy",
            deadline: null,
        },
        {
            _id: "2",
            text: "Task 2",
            isCompleted: true,
            difficulty: "hard",
            deadline: "2024-01-01",
        },
    ];

    const confirmModalMock = {
        actionType: null,
        taskId: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        dispatchMock = jest.fn((action) => {
            if (typeof action === "function") {
                return action(dispatchMock);
            }

            return Promise.resolve(action);
        });

        handleTaskCompletedMock = jest.fn();

        useDispatch.mockReturnValue(dispatchMock);
        useBoss.mockReturnValue({
            handleTaskCompleted: handleTaskCompletedMock,
        });

        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    tasks: tasksMock,
                    confirmModal: confirmModalMock,
                },
            })
        );
    });

    it("onDeleteTask dispatches openConfirmModal with correct payload", () => {
        const { result } = renderHook(() => useTaskActions());

        act(() => {
            result.current.onDeleteTask("1");
        });

        expect(dispatchMock).toHaveBeenCalledWith(
            openConfirmModal({
                actionType: "delete",
                taskId: "1",
                taskText: "Task 1",
            })
        );
    });

    it("onDeleteTask does nothing if task not found", () => {
        const { result } = renderHook(() => useTaskActions());

        act(() => {
            result.current.onDeleteTask("non-existent");
        });

        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it("onCompleteTask dispatches openConfirmModal if task is not completed", () => {
        const { result } = renderHook(() => useTaskActions());

        act(() => {
            result.current.onCompleteTask("1");
        });

        expect(dispatchMock).toHaveBeenCalledWith(
            openConfirmModal({
                actionType: "complete",
                taskId: "1",
                taskText: "Task 1",
            })
        );
    });

    it("onCompleteTask does nothing if task is already completed", () => {
        const { result } = renderHook(() => useTaskActions());

        act(() => {
            result.current.onCompleteTask("2");
        });

        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it("handleDelete dispatches deleteTaskAsync if task found", () => {
        const { result } = renderHook(() => useTaskActions());

        act(() => {
            result.current.handleDelete("1");
        });

        expect(dispatchMock).toHaveBeenCalledWith(deleteTaskAsync("1"));
    });

    it("handleDelete does nothing if task not found", () => {
        const { result } = renderHook(() => useTaskActions());

        act(() => {
            result.current.handleDelete("non-existent");
        });

        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it("handleComplete dispatches completeTaskAsync and calls handleTaskCompleted", async () => {
        const { result } = renderHook(() => useTaskActions());

        await act(async () => {
            await result.current.handleComplete("1");
        });

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: "COMPLETE_TASK_ASYNC",
            payload: "1",
        });
        expect(handleTaskCompletedMock).toHaveBeenCalledWith("easy", false);
    });

    it("handleComplete does nothing if task not found", async () => {
        const { result } = renderHook(() => useTaskActions());

        await act(async () => {
            await result.current.handleComplete("non-existent");
        });

        expect(dispatchMock).not.toHaveBeenCalled();
        expect(handleTaskCompletedMock).not.toHaveBeenCalled();
    });

    it("handleGroupDelete dispatches deleteTaskAsync for filtered tasks", () => {
        const { result } = renderHook(() => useTaskActions());

        act(() => {
            result.current.handleGroupDelete((task) => task.isCompleted);
        });

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(deleteTaskAsync("2"));
    });

    describe("onConfirmAction", () => {
        it("handles delete action", () => {
            const mockState = {
                tasks: {
                    tasks: tasksMock,
                    confirmModal: { actionType: "delete", taskId: "1" },
                },
            };

            useSelector.mockImplementation((selector) => selector(mockState));

            const { result } = renderHook(() => useTaskActions());

            act(() => {
                result.current.onConfirmAction();
            });

            expect(dispatchMock).toHaveBeenNthCalledWith(
                1,
                deleteTaskAsync("1")
            );
            expect(dispatchMock).toHaveBeenNthCalledWith(
                2,
                closeConfirmModal()
            );
        });

        it("handles complete action", async () => {
            const mockState = {
                tasks: {
                    tasks: tasksMock,
                    confirmModal: { actionType: "complete", taskId: "1" },
                },
            };

            useSelector.mockImplementation((selector) => selector(mockState));

            const { result } = renderHook(() => useTaskActions());

            await act(async () => {
                await result.current.onConfirmAction();
            });

            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).toHaveBeenNthCalledWith(2, {
                type: "COMPLETE_TASK_ASYNC",
                payload: "1",
            });
            expect(dispatchMock).toHaveBeenNthCalledWith(
                3,
                closeConfirmModal()
            );
        });

        it("handles group-delete-completed action", () => {
            const mockState = {
                tasks: {
                    tasks: tasksMock,
                    confirmModal: { actionType: "group-delete-completed" },
                },
            };

            useSelector.mockImplementation((selector) => selector(mockState));

            const { result } = renderHook(() => useTaskActions());

            act(() => {
                result.current.onConfirmAction();
            });

            expect(dispatchMock).toHaveBeenNthCalledWith(
                1,
                deleteTaskAsync("2")
            );
            expect(dispatchMock).toHaveBeenNthCalledWith(
                2,
                closeConfirmModal()
            );
        });

        it("handles group-delete-overdue action", () => {
            const now = new Date();
            const overdueTask = {
                _id: "3",
                text: "Overdue Task",
                isCompleted: false,
                deadline: new Date(now.getTime() - 10000).toISOString(),
            };

            const mockState = {
                tasks: {
                    tasks: [...tasksMock, overdueTask],
                    confirmModal: { actionType: "group-delete-overdue" },
                },
            };

            useSelector.mockImplementation((selector) => selector(mockState));

            const { result } = renderHook(() => useTaskActions());

            act(() => {
                result.current.onConfirmAction();
            });

            expect(dispatchMock).toHaveBeenNthCalledWith(
                1,
                deleteTaskAsync("3")
            );
            expect(dispatchMock).toHaveBeenNthCalledWith(
                2,
                closeConfirmModal()
            );
        });

        it("warns on unknown actionType", () => {
            console.warn = jest.fn();

            const mockState = {
                tasks: {
                    tasks: tasksMock,
                    confirmModal: { actionType: "unknown-action" },
                },
            };

            useSelector.mockImplementation((selector) => selector(mockState));

            const { result } = renderHook(() => useTaskActions());

            act(() => {
                result.current.onConfirmAction();
            });

            expect(console.warn).toHaveBeenCalledWith(
                "Unknown action type:",
                "unknown-action"
            );
            expect(dispatchMock).toHaveBeenCalledWith(closeConfirmModal());
        });
    });
});
