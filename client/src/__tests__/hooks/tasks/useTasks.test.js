import { useDispatch, useSelector } from "react-redux";
import useTasks from "../../../hooks/tasks/useTasks";

import { renderHook, act } from "@testing-library/react";
import { addTaskAsync } from "../../../store/tasks/tasksThunks";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock("../../../hooks/tasks/useTaskModals", () =>
    jest.fn(() => ({
        modalActive: false,
        confirmModal: { isOpen: false },
        onOpenModal: jest.fn(),
        onCloseModal: jest.fn(),
        onOpenConfirmModal: jest.fn(),
        onOpenGroupDeleteConfirmModal: jest.fn(),
        onCloseConfirmModal: jest.fn(),
    }))
);

jest.mock("../../../hooks/tasks/useTaskInput", () =>
    jest.fn(() => ({
        inputTask: "Test task",
        deadline: "2025-07-17",
        isInputInvalid: false,
        onInputChange: jest.fn(),
        onSetDeadline: jest.fn(),
    }))
);

jest.mock("../../../hooks/tasks/useTaskActions", () =>
    jest.fn(() => ({
        onDeleteTask: jest.fn(),
        onCompleteTask: jest.fn(),
        onConfirmAction: jest.fn(),
    }))
);

jest.mock("../../../hooks/tasks/useOverdueTasksChecker", () => jest.fn());

jest.mock("../../../store/tasks/tasksThunks", () => ({
    addTaskAsync: jest.fn(),
}));

describe("useTasks", () => {
    const dispatch = jest.fn();
    const openGroupDeleteMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useDispatch.mockReturnValue(dispatch);
        useSelector.mockImplementation((cb) =>
            cb({ tasks: { tasks: [{ id: 1, text: "task" }], loading: false } })
        );

        require("../../../hooks/tasks/useTaskModals").mockReturnValue({
            modalActive: false,
            confirmModal: { isOpen: false },
            onOpenModal: jest.fn(),
            onCloseModal: jest.fn(),
            onOpenConfirmModal: jest.fn(),
            onOpenGroupDeleteConfirmModal: openGroupDeleteMock,
            onCloseConfirmModal: jest.fn(),
        });

        require("../../../hooks/tasks/useTaskInput").mockReturnValue({
            inputTask: "New Task",
            deadline: "2025-07-20",
            isInputInvalid: false,
            onInputChange: jest.fn(),
            onSetDeadline: jest.fn(),
        });
    });

    it("should expose all required properties", () => {
        const { result } = renderHook(() => useTasks());

        expect(result.current.tasks).toEqual([{ id: 1, text: "task" }]);
        expect(result.current.loading).toBe(false);
        expect(typeof result.current.onAddTask).toBe("function");
        expect(typeof result.current.onGroupDeleteCompleted).toBe("function");
    });

    it("should dispatch addTaskAsync with deadline", () => {
        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.onAddTask({ hasDeadline: true, difficulty: 2 });
        });

        expect(dispatch).toHaveBeenCalledWith(
            addTaskAsync({
                text: "New Task",
                deadline: "2025-07-20",
                difficulty: 2,
            })
        );
    });

    it("should NOT dispatch if inputTask is empty or deadline is missing", () => {
        require("../../../hooks/tasks/useTaskInput").mockReturnValueOnce({
            inputTask: "     ",
            deadline: null,
            isInputInvalid: false,
            onInputChange: jest.fn(),
            onSetDeadline: jest.fn(),
        });

        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.onAddTask({ hasDeadline: true, difficulty: 1 });
        });

        expect(dispatch).not.toHaveBeenCalled();
    });

    it("should call group delete confirm modal open for completed tasks", () => {
        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.onGroupDeleteCompleted();
        });

        expect(openGroupDeleteMock).toHaveBeenCalledWith(
            "group-delete-completed"
        );
    });

    it("should call group delete confirm modal open for overdue tasks", () => {
        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.onGroupDeleteOverdue();
        });

        expect(openGroupDeleteMock).toHaveBeenCalledWith(
            "group-delete-overdue"
        );
    });
});
