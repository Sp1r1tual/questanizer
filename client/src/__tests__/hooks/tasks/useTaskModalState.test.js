import useTaskModalState from "../../../hooks/tasks/useTaskModalState";

import { renderHook, act } from "@testing-library/react";
import isDateValid from "../../../utils/validation/isDateValid";

jest.mock("../../../utils/validation/isDateValid", () => jest.fn());

describe("useTaskModalState", () => {
    let setDeadline, onSubmit, onClose;

    beforeEach(() => {
        setDeadline = jest.fn();
        onSubmit = jest.fn();
        onClose = jest.fn();
        jest.clearAllMocks();
    });

    it("should initialize with default states", () => {
        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        expect(result.current.pageModal).toBe("deadline");
        expect(result.current.isDateInvalid).toBe(false);
        expect(result.current.difficulty).toBe(null);
    });

    it("handleDateChange should update deadline and set validation state", () => {
        isDateValid.mockReturnValue(false);

        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        act(() => {
            result.current.handleDateChange({
                target: { value: "2025-01-01" },
            });
        });

        expect(setDeadline).toHaveBeenCalledWith("2025-01-01");
        expect(result.current.isDateInvalid).toBe(true);
    });

    it("handleAddWithDeadline sets invalid if no deadline or invalid date", () => {
        isDateValid.mockReturnValue(false);

        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        act(() => {
            result.current.handleAddWithDeadline();
        });

        expect(result.current.isDateInvalid).toBe(true);
        expect(result.current.pageModal).toBe("deadline");
    });

    it("handleAddWithDeadline proceeds to difficulty if date is valid", () => {
        isDateValid.mockReturnValue(true);

        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "2025-12-12",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        act(() => {
            result.current.handleAddWithDeadline();
        });

        expect(result.current.pageModal).toBe("difficulty");
        expect(result.current.isDateInvalid).toBe(false);
    });

    it("handleAddWithoutDeadline should reset and go to difficulty page", () => {
        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "2025-12-12",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        act(() => {
            result.current.handleAddWithoutDeadline();
        });

        expect(setDeadline).toHaveBeenCalledWith("");
        expect(result.current.pageModal).toBe("difficulty");
        expect(result.current.isDateInvalid).toBe(false);
    });

    it("handleBack should return to deadline page and reset difficulty", () => {
        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        act(() => {
            result.current.setDifficulty(3);
            result.current.handleBack();
        });

        expect(result.current.pageModal).toBe("deadline");
        expect(result.current.difficulty).toBe(null);
    });

    it("handleFinalSubmit should do nothing if difficulty is not set", async () => {
        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "2025-11-01",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        await act(async () => {
            await result.current.handleFinalSubmit();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("handleFinalSubmit should call onSubmit and close modal on success", async () => {
        onSubmit.mockResolvedValue({ success: true });

        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "2025-11-01",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        act(() => {
            result.current.setDifficulty(2);
        });

        await act(async () => {
            await result.current.handleFinalSubmit();
        });

        expect(onSubmit).toHaveBeenCalledWith({
            hasDeadline: true,
            difficulty: 2,
        });
        expect(onClose).toHaveBeenCalled();
    });

    it("handleFinalSubmit should not close modal on failed submit", async () => {
        onSubmit.mockResolvedValue({ success: false });

        const { result } = renderHook(() =>
            useTaskModalState({
                initialDeadline: "2025-11-01",
                setDeadline,
                onSubmit,
                onClose,
            })
        );

        act(() => {
            result.current.setDifficulty(1);
        });

        await act(async () => {
            await result.current.handleFinalSubmit();
        });

        expect(onSubmit).toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });
});
