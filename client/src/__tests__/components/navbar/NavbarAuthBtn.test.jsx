import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NavbarAuthBtn from "../../../components/navbar/NavbarAuthBtn";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockUseAuth = jest.fn();

jest.mock("../../../hooks/auth/useAuth", () => ({
    __esModule: true,
    default: () => mockUseAuth(),
}));

describe("NavbarAuthBtn", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("when user is not authenticated", () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: false,
                signOut: jest.fn(),
            });
        });

        it('displays "Login" text', () => {
            render(<NavbarAuthBtn />);
            expect(screen.getByText("Login")).toBeInTheDocument();
            expect(screen.queryByText("Logout")).not.toBeInTheDocument();
        });

        it("displays login image", () => {
            render(<NavbarAuthBtn />);

            const authImage = screen.getByAltText("auth-img");

            expect(authImage).toBeInTheDocument();
            expect(authImage).toHaveAttribute("src", "mocked-image");
        });

        it("navigates to /authentication on click", () => {
            render(<NavbarAuthBtn />);

            const button = screen.getByRole("button", { name: /Login/i });

            fireEvent.click(button);
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith("/authentication");
        });
    });

    describe("when user is authenticated", () => {
        const mockSignOut = jest.fn();

        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: true,
                signOut: mockSignOut,
            });
        });

        it('displays "Logout" text', () => {
            render(<NavbarAuthBtn />);
            expect(screen.getByText("Logout")).toBeInTheDocument();
            expect(screen.queryByText("Login")).not.toBeInTheDocument();
        });

        it("displays logged in image", () => {
            render(<NavbarAuthBtn />);

            const authImage = screen.getByAltText("auth-img");

            expect(authImage).toBeInTheDocument();
            expect(authImage).toHaveAttribute("src", "mocked-image");
        });

        it("calls signOut on click", () => {
            render(<NavbarAuthBtn />);

            const button = screen.getByRole("button", { name: /Logout/i });

            fireEvent.click(button);
            expect(mockSignOut).toHaveBeenCalledTimes(1);
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
