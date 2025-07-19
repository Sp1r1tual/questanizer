import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";

jest.mock("../../../components/navbar/NavbarDropdown", () => {
    return () => (
        <div data-testid="mock-navbar-dropdown">Mocked Navbar Dropdown</div>
    );
});

const renderWithRouter = (ui) => render(ui, { wrapper: BrowserRouter });

describe("Navbar", () => {
    it("renders logo, title, and navigation links", () => {
        renderWithRouter(<Navbar />);
        expect(screen.getByRole("navigation")).toBeInTheDocument();
        expect(screen.getByAltText("main-img")).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /Questanizer/i })
        ).toBeInTheDocument();
        expect(screen.getByText("Task Scheduler")).toBeInTheDocument();
        expect(screen.getByText("Boss Battle")).toBeInTheDocument();
        expect(screen.getByText("FAQ")).toBeInTheDocument();
    });

    it("renders NavbarDropdown", () => {
        renderWithRouter(<Navbar />);
        expect(screen.getByTestId("mock-navbar-dropdown")).toBeInTheDocument();
    });

    it("burger menu toggles open and closed", () => {
        renderWithRouter(<Navbar />);

        const burgerButton = screen.getByRole("button");

        fireEvent.click(burgerButton);
        expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();

        fireEvent.click(burgerButton);
        expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    });

    it("clicking a link in burger menu closes the menu", () => {
        renderWithRouter(<Navbar />);

        const burgerButton = screen.getByRole("button");

        fireEvent.click(burgerButton);

        const links = screen.getAllByText("Task Scheduler");
        const dropdownMenu = screen.getByTestId("dropdown-menu");
        const linkInMenu = links.find((link) => dropdownMenu.contains(link));

        fireEvent.click(linkInMenu);
        expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    });
});
