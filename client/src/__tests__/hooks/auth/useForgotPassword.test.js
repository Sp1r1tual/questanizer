import useForgotPassword from "../../../hooks/auth/useForgotPassword";

import { renderHook, act } from "@testing-library/react";
import { AuthService } from "../../../services/authService";
import { ERROR_MESSAGES } from "../../../utils/validation/validationForm";

jest.mock("../../../services/authService");

describe("useForgotPassword", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("validates email: empty and invalid email", () => {
        const { result } = renderHook(() => useForgotPassword());

        act(() => {
            result.current.handleEmailChange({ target: { value: "" } });
        });
        act(() => {
            result.current.handleSubmit({ preventDefault: () => {} });
        });
        expect(result.current.errors.email).toBe(ERROR_MESSAGES.fillAllFields);

        act(() => {
            result.current.handleEmailChange({
                target: { value: "invalidemail" },
            });
        });
        act(() => {
            result.current.handleSubmit({ preventDefault: () => {} });
        });
        expect(result.current.errors.email).toBe(ERROR_MESSAGES.invalidEmail);
    });

    it("submits successfully and sets message", async () => {
        const successMessage = "Reset email sent";

        AuthService.requestPasswordReset.mockResolvedValue({
            data: { message: successMessage },
        });

        const { result } = renderHook(() => useForgotPassword());

        act(() => {
            result.current.handleEmailChange({
                target: { value: "test@example.com" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(AuthService.requestPasswordReset).toHaveBeenCalledWith(
            "test@example.com"
        );
        expect(result.current.message).toBe(successMessage);
        expect(result.current.serverError).toBe("");
        expect(result.current.isLoading).toBe(false);
    });

    it("handles server error with errors array", async () => {
        const errorResponse = {
            response: {
                data: {
                    message: "Validation failed",
                    errors: [{ msg: "Email not found" }, { msg: "Try again" }],
                },
            },
        };
        AuthService.requestPasswordReset.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => useForgotPassword());

        act(() => {
            result.current.handleEmailChange({
                target: { value: "test@example.com" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.serverError).toBe(
            "Validation failed:\nEmail not found\nTry again"
        );
        expect(result.current.message).toBe("");
        expect(result.current.isLoading).toBe(false);
    });

    it("handles server error without errors array", async () => {
        const errorResponse = {
            response: {
                data: {
                    message: "Internal server error",
                },
            },
        };
        AuthService.requestPasswordReset.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => useForgotPassword());

        act(() => {
            result.current.handleEmailChange({
                target: { value: "test@example.com" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.serverError).toBe("Internal server error");
        expect(result.current.message).toBe("");
        expect(result.current.isLoading).toBe(false);
    });

    it("handles server error with no response data", async () => {
        AuthService.requestPasswordReset.mockRejectedValue(
            new Error("Network error")
        );

        const { result } = renderHook(() => useForgotPassword());

        act(() => {
            result.current.handleEmailChange({
                target: { value: "test@example.com" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.serverError).toBe("Failed to send reset email");
        expect(result.current.message).toBe("");
        expect(result.current.isLoading).toBe(false);
    });
});
