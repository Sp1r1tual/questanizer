import useResetPasswordForm from "../../../hooks/auth/useResetPassword";

import { renderHook, act } from "@testing-library/react";
import { AuthService } from "../../../services/authService";
import { ERROR_MESSAGES } from "../../../utils/validation/validationForm";

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock("../../../services/authService", () => ({
    AuthService: {
        resetPassword: jest.fn(),
    },
}));

jest.mock("../../../utils/validation/validationForm", () => ({
    validatePassword: jest.fn(),
    validateConfirmPassword: jest.fn(),
    ERROR_MESSAGES: {
        fillAllFields: "Please fill in all fields",
        invalidPassword: "Password is invalid",
        passwordMismatch: "Passwords do not match",
    },
}));

describe("useResetPasswordForm", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        require("react-router-dom").useNavigate.mockReturnValue(navigateMock);
        require("react-router-dom").useParams.mockReturnValue({
            token: "dummy-token",
        });
    });

    it("returns error when fields are empty", async () => {
        const { result } = renderHook(() => useResetPasswordForm());

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.errors.fillAllFields).toBe(
            ERROR_MESSAGES.fillAllFields
        );
        expect(AuthService.resetPassword).not.toHaveBeenCalled();
    });

    it("returns validation errors for password and confirmPassword", async () => {
        const {
            validatePassword,
            validateConfirmPassword,
        } = require("../../../utils/validation/validationForm");

        validatePassword.mockReturnValue(false);
        validateConfirmPassword.mockReturnValue(false);

        const { result } = renderHook(() => useResetPasswordForm());

        act(() => {
            result.current.handlePasswordChange({ target: { value: "short" } });
            result.current.handleConfirmPasswordChange({
                target: { value: "wrong" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.errors.password).toBe(
            ERROR_MESSAGES.invalidPassword
        );
        expect(result.current.errors.confirmPassword).toBe(
            ERROR_MESSAGES.passwordMismatch
        );
        expect(AuthService.resetPassword).not.toHaveBeenCalled();
    });

    it("calls resetPassword on valid input", async () => {
        const {
            validatePassword,
            validateConfirmPassword,
        } = require("../../../utils/validation/validationForm");

        validatePassword.mockReturnValue(true);
        validateConfirmPassword.mockReturnValue(true);
        AuthService.resetPassword.mockResolvedValue({});

        const { result } = renderHook(() => useResetPasswordForm());

        act(() => {
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

        expect(AuthService.resetPassword).toHaveBeenCalledWith(
            "dummy-token",
            "StrongPass123"
        );
        expect(result.current.message).toBe(
            "Password has been reset. Redirecting to login..."
        );

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(navigateMock).toHaveBeenCalledWith("/login");
    });

    it("sets server error if reset fails", async () => {
        const {
            validatePassword,
            validateConfirmPassword,
        } = require("../../../utils/validation/validationForm");

        validatePassword.mockReturnValue(true);
        validateConfirmPassword.mockReturnValue(true);
        AuthService.resetPassword.mockRejectedValue({
            response: { data: { message: "Token expired" } },
        });

        const { result } = renderHook(() => useResetPasswordForm());

        act(() => {
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

        expect(result.current.serverError).toBe("Token expired");
        expect(navigateMock).not.toHaveBeenCalled();
    });
});
