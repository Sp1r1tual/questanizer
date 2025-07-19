import useLoginForm from "../../../hooks/auth/useLoginForm";

import { renderHook, act } from "@testing-library/react";
import { ERROR_MESSAGES } from "../../../utils/validation/validationForm";

jest.mock("../../../utils/validation/validationForm", () => ({
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    ERROR_MESSAGES: {
        fillAllFields: "Please fill in all fields",
        invalidEmail: "Email is invalid",
        invalidPassword: "Password is invalid",
    },
}));

describe("useLoginForm", () => {
    const mockSubmit = jest.fn();
    const clearServerError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns error when fields are empty", async () => {
        const { result } = renderHook(() =>
            useLoginForm({ onSubmit: mockSubmit, clearServerError })
        );

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(result.current.errors.fillAllFields).toBe(
            ERROR_MESSAGES.fillAllFields
        );
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("returns error on invalid email and password", async () => {
        const {
            validateEmail,
            validatePassword,
        } = require("../../../utils/validation/validationForm");

        validateEmail.mockReturnValue(false);
        validatePassword.mockReturnValue(false);

        const { result } = renderHook(() =>
            useLoginForm({ onSubmit: mockSubmit, clearServerError })
        );

        act(() => {
            result.current.handleEmailChange({ target: { value: "invalid" } });
            result.current.handlePasswordChange({ target: { value: "123" } });
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

    it("calls onSubmit with valid credentials", async () => {
        const {
            validateEmail,
            validatePassword,
        } = require("../../../utils/validation/validationForm");

        validateEmail.mockReturnValue(true);
        validatePassword.mockReturnValue(true);

        const { result } = renderHook(() =>
            useLoginForm({ onSubmit: mockSubmit, clearServerError })
        );

        act(() => {
            result.current.handleEmailChange({
                target: { value: "user@example.com" },
            });
            result.current.handlePasswordChange({
                target: { value: "StrongPass123" },
            });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(mockSubmit).toHaveBeenCalledWith({
            email: "user@example.com",
            password: "StrongPass123",
        });
        expect(result.current.errors).toEqual({});
    });
});
