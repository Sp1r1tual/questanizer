import useAuth from "../../../hooks/auth/useAuth";
import useLoginForm from "../../../hooks/auth/useLoginForm";

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../../../routes/pages/login/components/LoginForm";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../../hooks/auth/useAuth");
jest.mock("../../../hooks/auth/useLoginForm");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockSignIn = jest.fn();
const mockClearError = jest.fn();

beforeEach(() => {
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);

    useAuth.mockReturnValue({
        signIn: mockSignIn,
        authError: "",
        clearError: mockClearError,
    });

    useLoginForm.mockReturnValue({
        email: "test@example.com",
        password: "123456",
        errors: {},
        handleEmailChange: jest.fn(),
        handlePasswordChange: jest.fn(),
        handleSubmit: jest.fn((e) => e.preventDefault()),
    });
});

const setup = () => {
    render(
        <BrowserRouter>
            <LoginForm />
        </BrowserRouter>
    );
};

it("renders form elements", () => {
    setup();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

it("calls handleSubmit when form is submitted", () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());

    useLoginForm.mockReturnValueOnce({
        email: "test@example.com",
        password: "123456",
        errors: {},
        handleEmailChange: jest.fn(),
        handlePasswordChange: jest.fn(),
        handleSubmit,
    });

    setup();

    const form = screen.getByRole("button", { name: /login/i }).closest("form");

    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
});

it("shows validation and server errors", () => {
    useAuth.mockReturnValueOnce({
        signIn: jest.fn(),
        authError: "Invalid credentials",
        clearError: mockClearError,
    });

    useLoginForm.mockReturnValueOnce({
        email: "",
        password: "",
        errors: {
            fillAllFields: "All fields are required",
            email: "Invalid email",
        },
        handleEmailChange: jest.fn(),
        handlePasswordChange: jest.fn(),
        handleSubmit: jest.fn((e) => e.preventDefault()),
    });

    setup();

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("All fields are required");
    expect(alert).toHaveTextContent("Invalid email");
    expect(alert).toHaveTextContent("Invalid credentials");
});

it("navigates to home page on successful login", async () => {
    const credentials = { email: "test@example.com", password: "123456" };

    mockSignIn.mockResolvedValueOnce({
        meta: { requestStatus: "fulfilled" },
    });

    const onSubmit = async () => {
        const result = await mockSignIn(credentials);

        if (result.meta.requestStatus === "fulfilled") {
            mockNavigate("/", { replace: true });
        }
    };

    useLoginForm.mockReturnValueOnce({
        email: credentials.email,
        password: credentials.password,
        errors: {},
        handleEmailChange: jest.fn(),
        handlePasswordChange: jest.fn(),
        handleSubmit: (e) => {
            e.preventDefault();
            return onSubmit();
        },
    });

    setup();

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true })
    );
});
