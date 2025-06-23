import { useSelector } from "react-redux";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";

jest.mock("../../components/navbar/Navbar", () => () => (
    <div>Mocked Navbar</div>
));
jest.mock("../../components/footer/Footer", () => () => (
    <div>Mocked Footer</div>
));
jest.mock("react-router-dom", () => {
    const original = jest.requireActual("react-router-dom");
    return {
        ...original,
        Outlet: () => <div>Mocked Outlet</div>,
        useLocation: () => ({ pathname: "/protected" }),
    };
});

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
}));

describe("AuthenticatedLayout", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows 'Loading...' when isLoading = true", () => {
        useSelector.mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
        });

        render(
            <MemoryRouter>
                <AuthenticatedLayout />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("redirect to /login if the user is not authenticated", () => {
        useSelector.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <AuthenticatedLayout />
            </MemoryRouter>
        );

        expect(screen.queryByText("Mocked Navbar")).not.toBeInTheDocument();
        expect(screen.queryByText("Mocked Outlet")).not.toBeInTheDocument();
        expect(screen.queryByText("Mocked Footer")).not.toBeInTheDocument();
    });

    it("renders Navbar, Outlet, Footer if user is authenticated", () => {
        useSelector.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <AuthenticatedLayout />
            </MemoryRouter>
        );

        expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();
        expect(screen.getByText("Mocked Outlet")).toBeInTheDocument();
        expect(screen.getByText("Mocked Footer")).toBeInTheDocument();
    });
});
