import useResetPassword from "../../../hooks/auth/useResetPassword";

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ResetPassword from "../../../routes/pages/reset-password/ResetPassword";

jest.mock("../../../hooks/auth/useResetPassword");

describe("ResetPassword component", () => {
    const mockHandlePasswordChange = jest.fn();
    const mockHandleConfirmPasswordChange = jest.fn();
    const mockHandleSubmit = jest.fn((e) => e.preventDefault());

    const defaultHookReturn = {
        password: "",
        confirmPassword: "",
        errors: {},
        message: "",
        serverError: "",
        isLoading: false,
        handlePasswordChange: mockHandlePasswordChange,
        handleConfirmPasswordChange: mockHandleConfirmPasswordChange,
        handleSubmit: mockHandleSubmit,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useResetPassword.mockReturnValue(defaultHookReturn);
    });

    it("renders inputs, button and no errors by default", () => {
        render(<ResetPassword />);

        expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Confirm new password")
        ).toBeInTheDocument();

        const button = screen.getByRole("button", { name: /reset password/i });

        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();

        expect(screen.queryByText(/fill all fields/i)).not.toBeInTheDocument();
    });

    it("calls handlePasswordChange on password input change", () => {
        render(<ResetPassword />);

        fireEvent.change(screen.getByPlaceholderText("New password"), {
            target: { value: "abc123" },
        });
        expect(mockHandlePasswordChange).toHaveBeenCalled();
    });

    it("calls handleConfirmPasswordChange on confirm password input change", () => {
        render(<ResetPassword />);

        fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
            target: { value: "abc123" },
        });
        expect(mockHandleConfirmPasswordChange).toHaveBeenCalled();
    });

    it("calls handleSubmit on form submission", () => {
        render(<ResetPassword />);

        fireEvent.submit(
            screen.getByRole("form") ||
                screen.getByRole("button").closest("form")
        );

        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it("displays validation and server errors", () => {
        useResetPassword.mockReturnValue({
            ...defaultHookReturn,
            errors: {
                fillAllFields: "Fill all fields",
                password: "Password too short",
                confirmPassword: "Passwords do not match",
            },
            serverError: "Server error occurred",
        });

        render(<ResetPassword />);

        expect(screen.getByText(/fill all fields/i)).toBeInTheDocument();
        expect(screen.getByText(/password too short/i)).toBeInTheDocument();
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        expect(screen.getByText(/server error occurred/i)).toBeInTheDocument();
    });

    it("displays success message when message exists", () => {
        useResetPassword.mockReturnValue({
            ...defaultHookReturn,
            message: "Password reset successfully",
        });

        render(<ResetPassword />);

        expect(
            screen.getByText(/password reset successfully/i)
        ).toBeInTheDocument();
    });

    it("disables button and shows processing text when loading", () => {
        useResetPassword.mockReturnValue({
            ...defaultHookReturn,
            isLoading: true,
        });

        render(<ResetPassword />);

        const button = screen.getByRole("button");

        expect(button).toBeDisabled();
        expect(button).toHaveTextContent(/processing/i);
    });
});
