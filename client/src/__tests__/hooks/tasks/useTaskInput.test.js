import { useDispatch, useSelector } from "react-redux";
import useTaskInput from "../../../hooks/tasks/useTaskInput";

import {
    setInputTask,
    setDeadline,
    setIsInputInvalid,
} from "../../../store/tasks/tasksSlice";

import { renderHook, act } from "@testing-library/react";

jest.mock("react-redux");
jest.mock("../../../store/tasks/tasksSlice", () => ({
    setInputTask: jest.fn((payload) => ({ type: "setInputTask", payload })),
    setDeadline: jest.fn((payload) => ({ type: "setDeadline", payload })),
    setIsInputInvalid: jest.fn((payload) => ({
        type: "setIsInputInvalid",
        payload,
    })),
}));

describe("useTaskInput", () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useDispatch.mockReturnValue(dispatchMock);
    });

    it("returns inputTask, deadline, isInputInvalid from state", () => {
        const mockState = {
            tasks: {
                inputTask: "Test task",
                deadline: "2025-12-31",
                isInputInvalid: false,
            },
        };

        useSelector.mockImplementation((selector) => selector(mockState));

        const { result } = renderHook(() => useTaskInput());

        expect(result.current.inputTask).toBe("Test task");
        expect(result.current.deadline).toBe("2025-12-31");
        expect(result.current.isInputInvalid).toBe(false);
    });

    it("dispatches setInputTask on onInputChange", () => {
        useSelector.mockReturnValue({
            inputTask: "",
            deadline: "",
            isInputInvalid: false,
        });

        const { result } = renderHook(() => useTaskInput());

        act(() => {
            result.current.onInputChange("New task");
        });

        expect(dispatchMock).toHaveBeenCalledWith(setInputTask("New task"));
    });

    it("dispatches setIsInputInvalid(false) if isInputInvalid was true and input is non-empty", () => {
        useSelector.mockReturnValue({
            inputTask: "",
            deadline: "",
            isInputInvalid: true,
        });

        const { result } = renderHook(() => useTaskInput());

        act(() => {
            result.current.onInputChange("Non empty");
        });

        expect(dispatchMock).toHaveBeenCalledWith(setInputTask("Non empty"));
        expect(dispatchMock).toHaveBeenCalledWith(setIsInputInvalid(false));
    });

    it("does not dispatch setIsInputInvalid if input is empty", () => {
        useSelector.mockReturnValue({
            inputTask: "",
            deadline: "",
            isInputInvalid: true,
        });

        const { result } = renderHook(() => useTaskInput());

        act(() => {
            result.current.onInputChange("   ");
        });

        expect(dispatchMock).toHaveBeenCalledWith(setInputTask("   "));
        expect(dispatchMock).not.toHaveBeenCalledWith(setIsInputInvalid(false));
    });

    it("dispatches setDeadline on onSetDeadline", () => {
        useSelector.mockReturnValue({
            inputTask: "",
            deadline: "",
            isInputInvalid: false,
        });

        const { result } = renderHook(() => useTaskInput());

        act(() => {
            result.current.onSetDeadline("2025-12-31");
        });

        expect(dispatchMock).toHaveBeenCalledWith(setDeadline("2025-12-31"));
    });
});
