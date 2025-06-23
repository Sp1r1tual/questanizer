import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../navbar/Navbar";

import styles from "../../navbar/Navbar.module.css";

jest.mock("../../navbar/NavbarDropdown", () => {
    return () => (
        <div data-testid="mock-navbar-dropdown">Mocked Navbar Dropdown</div>
    );
});

describe("Navbar", () => {
    const renderWithRouter = (ui, { route = "/" } = {}) => {
        window.history.pushState({}, "Test page", route);
        return render(ui, { wrapper: BrowserRouter });
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithRouter(<Navbar />);
        expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it('displays the "Questanizer" title and main image', () => {
        renderWithRouter(<Navbar />);
        expect(
            screen.getByRole("heading", { name: /Questanizer/i })
        ).toBeInTheDocument();
        expect(screen.getByAltText("main-img")).toBeInTheDocument();
        expect(screen.getByAltText("main-img")).toHaveAttribute(
            "src",
            "questanizer_header.png"
        );
    });

    it("renders NavbarDropdown", () => {
        renderWithRouter(<Navbar />);
        expect(screen.getByTestId("mock-navbar-dropdown")).toBeInTheDocument();
    });

    it("burger menu is initially closed and main navigation links are visible", () => {
        renderWithRouter(<Navbar />);
        expect(
            screen.getByRole("link", {
                name: "Task Scheduler",
                selector: `.${styles.navigationButtons} a`,
            })
        ).toBeInTheDocument();
        expect(
            screen.queryByText("Task Scheduler", {
                selector: `.${styles.dropdownMenu} a`,
            })
        ).not.toBeInTheDocument();
        expect(screen.getByAltText("Menu")).toHaveAttribute(
            "src",
            "burger-menu-svgrepo-com.png"
        );
    });

    it("clicking burger icon opens the menu and changes icon", () => {
        renderWithRouter(<Navbar />);
        const burgerButton = screen.getByRole("button", { name: /Menu/i });

        fireEvent.click(burgerButton);

        const dropdownMenu = screen.getByTestId("dropdown-menu");

        expect(
            within(dropdownMenu).getByText("Task Scheduler")
        ).toBeInTheDocument();
        expect(
            within(dropdownMenu).getByText("Boss Battle")
        ).toBeInTheDocument();
        expect(within(dropdownMenu).getByText("FAQ")).toBeInTheDocument();

        expect(screen.getByAltText("Menu")).toHaveAttribute(
            "src",
            "burger-menu-active-svgrepo-com.png"
        );
    });

    it("clicking burger icon again closes the menu and changes icon back", () => {
        renderWithRouter(<Navbar />);
        const burgerButton = screen.getByRole("button", { name: /Menu/i });

        fireEvent.click(burgerButton);

        const dropdownMenu = screen.getByTestId("dropdown-menu");

        expect(
            within(dropdownMenu).getByText("Task Scheduler")
        ).toBeInTheDocument();

        fireEvent.click(burgerButton);

        expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
        expect(screen.getByAltText("Menu")).toHaveAttribute(
            "src",
            "burger-menu-svgrepo-com.png"
        );
    });

    it("clicking a NavLink inside the burger menu closes the menu", async () => {
        renderWithRouter(<Navbar />);
        const burgerButton = screen.getByRole("button", { name: /Menu/i });

        fireEvent.click(burgerButton);

        const dropdownMenu = screen.getByTestId("dropdown-menu");

        expect(
            within(dropdownMenu).getByText("Task Scheduler")
        ).toBeInTheDocument();

        const taskSchedulerLinkInDropdown = within(dropdownMenu).getByRole(
            "link",
            { name: "Task Scheduler" }
        );

        fireEvent.click(taskSchedulerLinkInDropdown);

        expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
        expect(screen.getByAltText("Menu")).toHaveAttribute(
            "src",
            "burger-menu-svgrepo-com.png"
        );
    });

    it('NavLink for "Task Scheduler" in main navigation has correct href and active class', async () => {
        renderWithRouter(<Navbar />, { route: "/" });
        const taskSchedulerLink = screen.getByRole("link", {
            name: "Task Scheduler",
            selector: `.${styles.navigationButtons} a`,
        });

        expect(taskSchedulerLink).toBeInTheDocument();
        expect(taskSchedulerLink).toHaveAttribute("href", "/");
        expect(taskSchedulerLink).toHaveClass(styles.active);

        const bossBattleLink = screen.getByRole("link", {
            name: "Boss Battle",
            selector: `.${styles.navigationButtons} a`,
        });

        expect(bossBattleLink).not.toHaveClass(styles.active);
    });

    it('NavLink for "Boss Battle" in main navigation has correct href and active class', () => {
        renderWithRouter(<Navbar />, { route: "/boss" });
        const bossBattleLink = screen.getByRole("link", {
            name: "Boss Battle",
            selector: `.${styles.navigationButtons} a`,
        });

        expect(bossBattleLink).toBeInTheDocument();
        expect(bossBattleLink).toHaveAttribute("href", "/boss");
        expect(bossBattleLink).toHaveClass(styles.active);

        const taskSchedulerLink = screen.getByRole("link", {
            name: "Task Scheduler",
            selector: `.${styles.navigationButtons} a`,
        });

        expect(taskSchedulerLink).not.toHaveClass(styles.active);
    });

    it('NavLink for "FAQ" in main navigation has correct href and active class', () => {
        renderWithRouter(<Navbar />, { route: "/faq" });
        const faqLink = screen.getByRole("link", {
            name: "FAQ",
            selector: `.${styles.navigationButtons} a`,
        });

        expect(faqLink).toBeInTheDocument();
        expect(faqLink).toHaveAttribute("href", "/faq");
        expect(faqLink).toHaveClass(styles.active);

        const taskSchedulerLink = screen.getByRole("link", {
            name: "Task Scheduler",
            selector: `.${styles.navigationButtons} a`,
        });

        expect(taskSchedulerLink).not.toHaveClass(styles.active);
    });
});
