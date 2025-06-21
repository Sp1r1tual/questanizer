import { useTasks } from "../../tasks/useTasks";

import { renderHook } from "@testing-library/react";

jest.mock("../../../hooks/tasks/useTaskState");
jest.mock("../../../hooks/tasks/useTaskModals");
jest.mock("../../../hooks/tasks/useTaskActions");
jest.mock("../../../hooks/tasks/useTaskImpacts");

import { useTaskState } from "../../tasks/useTaskState";
import { useTaskModals } from "../../tasks/useTaskModals";
import { useTaskActions } from "../../tasks/useTaskActions";
import { useTaskImpacts } from "../../tasks/useTaskImpacts";

describe("useTasks", () => {
    const mockDispatch = jest.fn();

    const mockStateReturn = {
        tasks: [{ id: "t1", text: "Task 1" }],
        selectedTask: "t1",
        inputTask: "New Task",
        confirmModal: { isOpen: true },
        dispatch: mockDispatch,
    };

    const mockModalsFunctions = {
        onInputChange: jest.fn(),
        onOpenModal: jest.fn(),
        onCloseModal: jest.fn(),
        onOpenConfirmModal: jest.fn(),
        onCloseConfirmModal: jest.fn(),
        openTaskModal: jest.fn(),
    };

    const mockActionsFunctions = {
        onAddTask: jest.fn(),
        onDeleteTask: jest.fn(),
        onCompleteTask: jest.fn(),
        onSetDeadline: jest.fn(),
        onConfirmAction: jest.fn(),
        createTask: jest.fn(),
        completeTask: jest.fn(),
    };

    const mockImpactsFunctions = {
        awardExperience: jest.fn(),
        applyOverdueDamage: jest.fn(),
        checkOverdueTasks: jest.fn(),
        applyTaskEffects: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useTaskState.mockReturnValue(mockStateReturn);
        useTaskModals.mockReturnValue(mockModalsFunctions);
        useTaskActions.mockReturnValue(mockActionsFunctions);
        useTaskImpacts.mockReturnValue(mockImpactsFunctions);
    });

    it("combines all values ​​and functions from sub-hooks and correctly passes state", () => {
        const { result } = renderHook(() => useTasks());

        expect(useTaskState).toHaveBeenCalledTimes(1);
        expect(useTaskModals).toHaveBeenCalledTimes(1);
        expect(useTaskActions).toHaveBeenCalledTimes(1);
        expect(useTaskImpacts).toHaveBeenCalledTimes(1);

        expect(useTaskModals).toHaveBeenCalledWith(mockStateReturn);
        expect(useTaskActions).toHaveBeenCalledWith(mockStateReturn);
        expect(useTaskImpacts).toHaveBeenCalledWith(mockStateReturn);

        expect(result.current).toEqual({
            ...mockStateReturn,
            ...mockModalsFunctions,
            ...mockActionsFunctions,
            ...mockImpactsFunctions,
        });
        const testTaskId = "test-task-123";

        result.current.onDeleteTask(testTaskId);

        expect(mockActionsFunctions.onDeleteTask).toHaveBeenCalledTimes(1);
        expect(mockActionsFunctions.onDeleteTask).toHaveBeenCalledWith(
            testTaskId
        );

        const newInputValue = "Updated task text";

        result.current.onInputChange(newInputValue);

        expect(mockModalsFunctions.onInputChange).toHaveBeenCalledTimes(1);
        expect(mockModalsFunctions.onInputChange).toHaveBeenCalledWith(
            newInputValue
        );

        result.current.awardExperience(100);

        expect(mockImpactsFunctions.awardExperience).toHaveBeenCalledTimes(1);
        expect(mockImpactsFunctions.awardExperience).toHaveBeenCalledWith(100);
    });
});
