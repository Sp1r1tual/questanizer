import useRegistrationForm from "../../../hooks/auth/useRegistrationForm";

import { renderHook, act } from "@testing-library/react";

import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    ERROR_MESSAGES,
} from "../../../utils/validation/validationForm";

jest.mock("../../../utils/validation/validationForm", () => ({
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    validateConfirmPassword: jest.fn(),
    ERROR_MESSAGES: {
        fillAllFields: "Please fill in all fields",
        invalidEmail: "Email is invalid",
        invalidPassword: "Password is invalid",
        passwordMismatch: "Passwords do not match",
    },
}));

describe("useRegistrationForm", () => {
    const mockSubmit = jest.fn();
    const clearServerError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns error when fields are empty", async () => {
        const { result } = renderHook(() =>
            useRegistrationForm({ onSubmit: mockSubmit, clearServerError })
        );

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.errors.fillAllFields).toBe(
            ERROR_MESSAGES.fillAllFields
        );
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("returns errors for invalid email and password", async () => {
        validateEmail.mockReturnValue(false);
        validatePassword.mockReturnValue(false);

        const { result } = renderHook(() =>
            useRegistrationForm({ onSubmit: mockSubmit, clearServerError })
        );

        act(() => {
            result.current.handleEmailChange({ target: { value: "invalid" } });
            result.current.handlePasswordChange({ target: { value: "short" } });
            result.current.handleConfirmPasswordChange({
                target: { value: "short" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.errors.email).toBe(ERROR_MESSAGES.invalidEmail);
        expect(result.current.errors.password).toBe(
            ERROR_MESSAGES.invalidPassword
        );
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("returns error for mismatched confirmPassword", async () => {
        validateEmail.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateConfirmPassword.mockReturnValue(false);

        const { result } = renderHook(() =>
            useRegistrationForm({ onSubmit: mockSubmit, clearServerError })
        );

        act(() => {
            result.current.handleEmailChange({
                target: { value: "user@example.com" },
            });
            result.current.handlePasswordChange({
                target: { value: "StrongPass123" },
            });
            result.current.handleConfirmPasswordChange({
                target: { value: "WrongPass123" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.errors.confirmPassword).toBe(
            ERROR_MESSAGES.passwordMismatch
        );
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("submits successfully with valid data", async () => {
        validateEmail.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateConfirmPassword.mockReturnValue(true);

        const { result } = renderHook(() =>
            useRegistrationForm({ onSubmit: mockSubmit, clearServerError })
        );

        act(() => {
            result.current.handleEmailChange({
                target: { value: "user@example.com" },
            });
            result.current.handlePasswordChange({
                target: { value: "StrongPass123" },
            });
            result.current.handleConfirmPasswordChange({
                target: { value: "StrongPass123" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(mockSubmit).toHaveBeenCalledWith({
            email: "user@example.com",
            password: "StrongPass123",
            confirmPassword: "StrongPass123",
        });

        expect(result.current.errors).toEqual({});
    });
});
