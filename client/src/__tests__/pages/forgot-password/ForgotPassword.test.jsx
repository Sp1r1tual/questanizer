import useForgotPassword from "../../../hooks/auth/useForgotPassword";

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ForgotPassword from "../../../routes/pages/forgot-password/ForgotPassword";

jest.mock("../../../hooks/auth/useForgotPassword");

describe("ForgotPassword component", () => {
    const mockHandleSubmit = jest.fn((e) => e.preventDefault());
    const mockHandleEmailChange = jest.fn();

    const setup = (override = {}) => {
        useForgotPassword.mockReturnValue({
            email: "test@example.com",
            message: "",
            errors: {},
            serverError: "",
            isLoading: false,
            handleEmailChange: mockHandleEmailChange,
            handleSubmit: mockHandleSubmit,
            ...override,
        });

        render(<ForgotPassword />);
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders input and button", () => {
        setup();

        expect(
            screen.getByPlaceholderText(/enter your email/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /send reset link/i })
        ).toBeInTheDocument();
    });

    it("calls handleEmailChange on input change", () => {
        setup();

        const input = screen.getByPlaceholderText(/enter your email/i);

        fireEvent.change(input, { target: { value: "new@example.com" } });

        expect(mockHandleEmailChange).toHaveBeenCalled();
    });

    it("calls handleSubmit on form submit", () => {
        setup();

        const form = screen.getByRole("button").closest("form");

        fireEvent.submit(form);

        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it("displays success message", () => {
        setup({ message: "Reset link sent!" });

        expect(screen.getByText(/reset link sent/i)).toBeInTheDocument();
    });

    it("displays email validation error", () => {
        setup({ errors: { email: "Invalid email" } });

        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    it("displays server error", () => {
        setup({ serverError: "Server down" });

        expect(screen.getByText(/server down/i)).toBeInTheDocument();
    });

    it("shows loader when loading", () => {
        setup({ isLoading: true });

        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
});
