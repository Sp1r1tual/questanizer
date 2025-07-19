import { useSelector } from "react-redux";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

jest.mock("../../components/navbar/Navbar", () => () => <div>Navbar</div>);
jest.mock("../../components/footer/Footer", () => () => <div>Footer</div>);
jest.mock(
    "../../components/ui/Loader",
    () =>
        ({ visible }) =>
            visible ? <div>Loading...</div> : null
);

const DummyOutlet = () => <div>Outlet Content</div>;

function renderWithRouter() {
    return render(
        <MemoryRouter initialEntries={["/protected"]}>
            <Routes>
                <Route element={<AuthenticatedLayout />}>
                    <Route path="/protected" element={<DummyOutlet />} />
                </Route>
                <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

describe("AuthenticatedLayout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows Loader while auth is not checked", () => {
        useSelector.mockImplementation((selector) =>
            selector({ auth: { isAuthenticated: false, isAuthChecked: false } })
        );

        renderWithRouter();

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("redirects to /login if not authenticated", () => {
        useSelector.mockImplementation((selector) =>
            selector({ auth: { isAuthenticated: false, isAuthChecked: true } })
        );

        renderWithRouter();

        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("renders navbar, outlet and footer if authenticated", () => {
        useSelector.mockImplementation((selector) =>
            selector({ auth: { isAuthenticated: true, isAuthChecked: true } })
        );

        renderWithRouter();

        expect(screen.getByText("Navbar")).toBeInTheDocument();
        expect(screen.getByText("Outlet Content")).toBeInTheDocument();
        expect(screen.getByText("Footer")).toBeInTheDocument();
    });
});
