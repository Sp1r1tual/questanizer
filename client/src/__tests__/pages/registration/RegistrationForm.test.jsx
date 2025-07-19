import useAuth from "../../../hooks/auth/useAuth";
import useRegistrationForm from "../../../hooks/auth/useRegistrationForm";

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import RegistrationForm from "../../../routes/pages/registration/components/RegistrationForm";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("../../../hooks/auth/useAuth");
jest.mock("../../../hooks/auth/useRegistrationForm");

describe("RegistrationForm", () => {
    const mockNavigate = jest.fn();
    const mockRegisterUser = jest.fn();
    const mockClearError = jest.fn();
    const mockAlert = jest.fn();

    beforeAll(() => {
        global.alert = mockAlert;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        useNavigate.mockReturnValue(mockNavigate);

        useAuth.mockReturnValue({
            registerUser: mockRegisterUser,
            authError: null,
            clearError: mockClearError,
        });
    });

    it("navigates to login page on successful registration", async () => {
        const email = "test@example.com";
        const password = "123456";

        mockRegisterUser.mockResolvedValueOnce({
            meta: { requestStatus: "fulfilled" },
        });

        useRegistrationForm.mockReturnValue({
            email,
            password,
            confirmPassword: password,
            errors: {},
            handleEmailChange: jest.fn(),
            handlePasswordChange: jest.fn(),
            handleConfirmPasswordChange: jest.fn(),
            handleSubmit: (e) => {
                e.preventDefault();
                return mockRegisterUser({ email, password }).then((result) => {
                    if (result.meta.requestStatus === "fulfilled") {
                        alert(`Activation link was sent to ${email}💌`);
                        mockNavigate("/login", { replace: true });
                    }
                });
            },
        });

        render(
            <MemoryRouter>
                <RegistrationForm />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /register/i }));

        await waitFor(() => {
            expect(mockRegisterUser).toHaveBeenCalledWith({ email, password });
            expect(mockAlert).toHaveBeenCalledWith(
                `Activation link was sent to ${email}💌`
            );
            expect(mockNavigate).toHaveBeenCalledWith("/login", {
                replace: true,
            });
        });
    });

    describe("UI and validation errors", () => {
        beforeEach(() => {
            useRegistrationForm.mockReturnValue({
                email: "",
                password: "",
                confirmPassword: "",
                errors: {},
                handleEmailChange: jest.fn(),
                handlePasswordChange: jest.fn(),
                handleConfirmPasswordChange: jest.fn(),
                handleSubmit: jest.fn((e) => e.preventDefault()),
            });
        });

        it("renders all inputs and button", () => {
            render(
                <MemoryRouter>
                    <RegistrationForm />
                </MemoryRouter>
            );

            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
            expect(
                screen.getByLabelText(/confirm password/i)
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /register/i })
            ).toBeInTheDocument();
        });

        it("displays validation errors correctly", () => {
            useRegistrationForm.mockReturnValueOnce({
                email: "",
                password: "",
                confirmPassword: "",
                errors: {
                    fillAllFields: "Fill all fields",
                    email: "Invalid email",
                    password: "Password too short",
                    confirmPassword: "Passwords do not match",
                },
                handleEmailChange: jest.fn(),
                handlePasswordChange: jest.fn(),
                handleConfirmPasswordChange: jest.fn(),
                handleSubmit: jest.fn((e) => e.preventDefault()),
            });

            render(
                <MemoryRouter>
                    <RegistrationForm />
                </MemoryRouter>
            );

            const alert = screen.getByRole("alert");

            expect(alert).toHaveTextContent(/fill all fields/i);
            expect(alert).toHaveTextContent(/invalid email/i);
            expect(alert).toHaveTextContent(/password too short/i);
            expect(alert).toHaveTextContent(/passwords do not match/i);
        });
    });
});
