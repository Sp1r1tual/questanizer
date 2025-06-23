import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "../../authentication/components/AuthForm";

const mockSignIn = jest.fn();
const mockNavigate = jest.fn();
const mockHandleSubmit = jest.fn((e) => e.preventDefault());
const mockHandleUsernameChange = jest.fn();
const mockHandlePasswordChange = jest.fn();

jest.mock("../../../../hooks/auth/useAuth", () => ({
    __esModule: true,
    default: () => ({
        signIn: mockSignIn,
    }),
}));

jest.mock("../../../../hooks/auth/useAuthForm", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("AuthForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        require("../../../../hooks/auth/useAuthForm").default.mockReturnValue({
            username: "",
            password: "",
            usernameError: "",
            passwordError: "",
            error: "",
            handleUsernameChange: mockHandleUsernameChange,
            handlePasswordChange: mockHandlePasswordChange,
            handleSubmit: mockHandleSubmit,
        });
    });

    it("renders a form with fields", () => {
        render(<AuthForm />);
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /login/i })
        ).toBeInTheDocument();
    });

    it("calls handleUsernameChange when username changes", () => {
        render(<AuthForm />);

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: "user1" },
        });

        expect(mockHandleUsernameChange).toHaveBeenCalledTimes(1);
    });

    it("calls handlePasswordChange when password is changed", () => {
        render(<AuthForm />);

        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: "pass1" },
        });

        expect(mockHandlePasswordChange).toHaveBeenCalledTimes(1);
    });

    it("calls handleSubmit when the form is submitted", () => {
        render(<AuthForm />);

        fireEvent.submit(screen.getByRole("form"));

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("shows errors if there are any", () => {
        require("../../../../hooks/auth/useAuthForm").default.mockReturnValue({
            username: "user",
            password: "pass",
            usernameError: "Username error",
            passwordError: "Password error",
            error: "General error",
            handleUsernameChange: mockHandleUsernameChange,
            handlePasswordChange: mockHandlePasswordChange,
            handleSubmit: mockHandleSubmit,
        });
        render(<AuthForm />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        expect(usernameInput.classList).toContain("errorInput");
        expect(passwordInput.classList).toContain("errorInput");

        expect(screen.getByText("General error")).toBeInTheDocument();
    });
});
