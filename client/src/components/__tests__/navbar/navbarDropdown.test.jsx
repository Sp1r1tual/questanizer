import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NavbarDropdown from "../../navbar/NavbarDropdown";

jest.mock("../../navbar/NavbarAuthBtn", () => {
    return () => <div>Mocked Auth Button</div>;
});

describe("NavbarDropdown", () => {
    it("dropdown menu is initially closed", () => {
        render(<NavbarDropdown />);
        expect(
            screen.queryByText("Mocked Auth Button")
        ).not.toBeInTheDocument();
        expect(screen.getByAltText("Dropdown")).toHaveAttribute(
            "src",
            "nav-dropdown-svgrepo-com.png"
        );
    });

    it("clicking the toggle button opens the dropdown menu", () => {
        render(<NavbarDropdown />);
        const toggleButton = screen.getByRole("button", { name: /Dropdown/i });

        fireEvent.click(toggleButton);

        expect(screen.getByText("Mocked Auth Button")).toBeInTheDocument();
        expect(screen.getByAltText("Dropdown")).toHaveAttribute(
            "src",
            "nav-dropdown-active-svgrepo-com.png"
        );
    });

    it("clicking the toggle button again closes the dropdown menu", () => {
        render(<NavbarDropdown />);
        const toggleButton = screen.getByRole("button", { name: /Dropdown/i });

        fireEvent.click(toggleButton);
        expect(screen.getByText("Mocked Auth Button")).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(
            screen.queryByText("Mocked Auth Button")
        ).not.toBeInTheDocument();
        expect(screen.getByAltText("Dropdown")).toHaveAttribute(
            "src",
            "nav-dropdown-svgrepo-com.png"
        );
    });

    it("clicking outside the dropdown closes the menu", () => {
        render(<NavbarDropdown />);
        const toggleButton = screen.getByRole("button", { name: /Dropdown/i });

        fireEvent.click(toggleButton);
        expect(screen.getByText("Mocked Auth Button")).toBeInTheDocument();

        fireEvent.mouseDown(document.body);

        expect(
            screen.queryByText("Mocked Auth Button")
        ).not.toBeInTheDocument();
        expect(screen.getByAltText("Dropdown")).toHaveAttribute(
            "src",
            "nav-dropdown-svgrepo-com.png"
        );
    });
});
