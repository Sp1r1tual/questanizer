import { useDispatch } from "react-redux";
import useAuth from "../../../hooks/auth/useAuth";
import useTasks from "../../../hooks/tasks/useTasks";
import useTaskFilters from "../../../hooks/tasks/useTaskFilters";

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TasksView from "../../../components/organizer/TasksView";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../hooks/tasks/useTasks");
jest.mock("../../../hooks/auth/useAuth");
jest.mock("../../../hooks/tasks/useTaskFilters");

const mockDispatch = jest.fn();
const mockOnOpenModal = jest.fn();
const mockOnInputChange = jest.fn();

describe("TasksView", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useDispatch.mockReturnValue(mockDispatch);

        useAuth.mockReturnValue({
            user: { id: "user123" },
        });

        useTasks.mockReturnValue({
            tasks: [],
            inputTask: "",
            isInputInvalid: false,
            modalActive: false,
            deadline: null,
            confirmModal: { isOpen: false, actionType: "", taskText: "" },
            onInputChange: mockOnInputChange,
            onOpenModal: mockOnOpenModal,
            onAddTask: jest.fn(),
            onCloseModal: jest.fn(),
            onDeleteTask: jest.fn(),
            onCompleteTask: jest.fn(),
            onGroupDeleteCompleted: jest.fn(),
            onGroupDeleteOverdue: jest.fn(),
            onSetDeadline: jest.fn(),
            onCloseConfirmModal: jest.fn(),
            onConfirmAction: jest.fn(),
            loading: false,
        });

        useTaskFilters.mockReturnValue({
            getFilteredTasks: jest.fn(() => []),
        });
    });

    it("renders base components", () => {
        render(<TasksView />);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /\+ add new task/i })
        ).toBeInTheDocument();
    });

    it("calls onOpenModal when AddNewTaskBtn is clicked", () => {
        render(<TasksView />);
        fireEvent.click(
            screen.getByRole("button", { name: /\+ add new task/i })
        );
        expect(mockOnOpenModal).toHaveBeenCalled();
    });

    it("renders TaskModal when modalActive is true", () => {
        useTasks.mockReturnValueOnce({
            ...useTasks(),
            modalActive: true,
        });

        render(<TasksView />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders ConfirmChoiceModal when confirmModal.isOpen is true", () => {
        useTasks.mockReturnValueOnce({
            ...useTasks(),
            confirmModal: {
                isOpen: true,
                actionType: "delete",
                taskText: "Test Task",
            },
        });

        render(<TasksView />);
        expect(
            screen.getByText(/are you sure you want to delete the task/i)
        ).toBeInTheDocument();
    });

    it("dispatches fetchTasks if user.id exists", () => {
        render(<TasksView />);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
});
