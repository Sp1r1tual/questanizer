import useAuthForm from "../../auth/useAuthForm";

import { renderHook, act } from "@testing-library/react";

describe("useAuthForm", () => {
    const mockSubmit = jest.fn();

    beforeEach(() => {
        mockSubmit.mockClear();
    });

    it("has an initial state of empty fields without errors", () => {
        const { result } = renderHook(() =>
            useAuthForm({ onSubmit: mockSubmit })
        );

        expect(result.current.username).toBe("");
        expect(result.current.password).toBe("");
        expect(result.current.error).toBe("");
        expect(result.current.usernameError).toBe(false);
        expect(result.current.passwordError).toBe(false);
    });

    it("sets an error if fields are empty on submit", () => {
        const { result } = renderHook(() =>
            useAuthForm({ onSubmit: mockSubmit })
        );

        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() });
        });

        expect(result.current.error).toBe(
            "Please enter both username and password."
        );
        expect(result.current.usernameError).toBe(true);
        expect(result.current.passwordError).toBe(true);
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("rejects invalid login", () => {
        const { result } = renderHook(() =>
            useAuthForm({ onSubmit: mockSubmit })
        );

        act(() => {
            result.current.handleUsernameChange({ target: { value: "usr" } });
        });

        act(() => {
            result.current.handlePasswordChange({
                target: { value: "ValidPass1" },
            });
        });

        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() });
        });

        expect(result.current.error).toMatch(/Username must be between/);
        expect(result.current.usernameError).toBe(true);
        expect(result.current.passwordError).toBe(false);
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("rejects incorrect password", () => {
        const { result } = renderHook(() =>
            useAuthForm({ onSubmit: mockSubmit })
        );

        act(() => {
            result.current.handleUsernameChange({
                target: { value: "validUser" },
            });
        });

        act(() => {
            result.current.handlePasswordChange({ target: { value: "short" } });
        });

        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() });
        });

        expect(result.current.error).toMatch(/Password must be between/);
        expect(result.current.passwordError).toBe(true);
        expect(result.current.usernameError).toBe(false);
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit on valid fields", () => {
        const { result } = renderHook(() =>
            useAuthForm({ onSubmit: mockSubmit })
        );

        act(() => {
            result.current.handleUsernameChange({
                target: { value: "validUser" },
            });
        });

        act(() => {
            result.current.handlePasswordChange({
                target: { value: "ValidPass1" },
            });
        });

        act(() => {
            result.current.handleSubmit({ preventDefault: jest.fn() });
        });

        expect(result.current.error).toBe("");
        expect(result.current.usernameError).toBe(false);
        expect(result.current.passwordError).toBe(false);
        expect(mockSubmit).toHaveBeenCalledWith({
            username: "validUser",
            password: "ValidPass1",
        });
    });
});
