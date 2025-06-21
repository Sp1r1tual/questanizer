import { useTaskActions } from "../../tasks/useTaskActions";

import React from "react";
import { render } from "@testing-library/react";
import {
    addTask,
    deleteTask,
    completeTask,
    openConfirmModal,
    setDeadline,
} from "../../../store/tasks/tasksSlice";
import { gainExperience } from "../../../store/stats/userStatsSlice";

jest.mock("../../boss/useBoss", () => ({
    useBoss: () => ({
        handleTaskCompleted: jest.fn(),
    }),
}));

const mockDispatch = jest.fn();

const TestComponent = ({ action, payload, state }) => {
    const {
        tasks = [],
        confirmModal = {},
        dispatch = mockDispatch,
    } = state || {};

    const {
        onAddTask,
        onDeleteTask,
        onCompleteTask,
        onSetDeadline,
        onConfirmAction,
    } = useTaskActions({ tasks, confirmModal, dispatch });

    React.useEffect(() => {
        switch (action) {
            case "add":
                onAddTask(payload);
                break;
            case "delete":
                onDeleteTask(payload);
                break;
            case "complete":
                onCompleteTask(payload);
                break;
            case "deadline":
                onSetDeadline(payload);
                break;
            case "confirm":
                onConfirmAction();
                break;
            default:
                break;
        }
    }, [action]);

    return <div>Test</div>;
};

describe("useTaskActions", () => {
    beforeEach(() => {
        mockDispatch.mockClear();
    });

    it("adds a task", () => {
        render(
            <TestComponent
                action="add"
                payload={{ hasDeadline: true, difficulty: "hard" }}
            />
        );

        expect(mockDispatch).toHaveBeenCalledWith(
            addTask({ hasDeadline: true, difficulty: "hard" })
        );
    });

    it("opens a modal when deleting a task", () => {
        render(
            <TestComponent
                action="delete"
                payload="1"
                state={{
                    tasks: [{ id: "1", text: "Test Task", isCompleted: false }],
                    confirmModal: {},
                }}
            />
        );

        expect(mockDispatch).toHaveBeenCalledWith(
            openConfirmModal({
                actionType: "delete",
                taskId: "1",
                taskText: "Test Task",
            })
        );
    });

    it("opens a modal when deleting a task", () => {
        render(
            <TestComponent
                action="confirm"
                state={{
                    tasks: [{ id: "1", text: "Test Task", isCompleted: false }],
                    confirmModal: {
                        isOpen: true,
                        actionType: "delete",
                        taskId: "1",
                        taskText: "Test Task",
                    },
                }}
            />
        );

        expect(mockDispatch).toHaveBeenCalledWith(deleteTask("1"));
    });

    it("opens a modal when an incomplete task is completed", () => {
        render(
            <TestComponent
                action="complete"
                payload="1"
                state={{
                    tasks: [{ id: "1", text: "Test Task", isCompleted: false }],
                    confirmModal: {},
                }}
            />
        );

        expect(mockDispatch).toHaveBeenCalledWith(
            openConfirmModal({
                actionType: "complete",
                taskId: "1",
                taskText: "Test Task",
            })
        );
    });

    it("sets a deadline", () => {
        render(<TestComponent action="deadline" payload="2025-06-30" />);

        expect(mockDispatch).toHaveBeenCalledWith(setDeadline("2025-06-30"));
    });

    it("confirms task completion and earns experience", () => {
        render(
            <TestComponent
                action="confirm"
                state={{
                    tasks: [
                        {
                            id: "1",
                            text: "Test Task",
                            isCompleted: false,
                            deadline: "2025-01-01T00:00:00Z",
                            difficulty: "medium",
                        },
                    ],
                    confirmModal: {
                        isOpen: true,
                        actionType: "complete",
                        taskId: "1",
                        taskText: "Test Task",
                    },
                }}
            />
        );

        expect(mockDispatch).toHaveBeenCalledWith(gainExperience(20));
        expect(mockDispatch).toHaveBeenCalledWith(completeTask("1"));
    });
});
