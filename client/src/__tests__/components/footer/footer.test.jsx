import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "../../../components/footer/Footer";

describe("Footer", () => {
    it("renders the current year in the copyright notice", () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();

        expect(
            screen.getByText(new RegExp(`© ${currentYear}`))
        ).toBeInTheDocument();
    });

    it('renders the "Questanizer" link and it points to the home page', () => {
        render(<Footer />);

        const questanizerLink = screen.getByRole("link", {
            name: /Questanizer/i,
        });

        expect(questanizerLink).toBeInTheDocument();
        expect(questanizerLink).toHaveAttribute("href", "/");
    });

    it('renders the "About us" link and it points to the GitHub repository', () => {
        render(<Footer />);

        const aboutUsLink = screen.getByRole("link", { name: /About us/i });

        expect(aboutUsLink).toBeInTheDocument();
        expect(aboutUsLink).toHaveAttribute(
            "href",
            "https://github.com/Sp1r1tual/questanizer-pet-project"
        );
        expect(aboutUsLink).toHaveAttribute("target", "_blank");
        expect(aboutUsLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it('renders the "Contact us" link and it is a mailto link', () => {
        render(<Footer />);

        const contactUsLink = screen.getByRole("link", { name: /Contact us/i });

        expect(contactUsLink).toBeInTheDocument();
        expect(contactUsLink).toHaveAttribute(
            "href",
            "mailto:questanizer@gmail.com"
        );
    });

    it("ensures all necessary text elements are present", () => {
        render(<Footer />);
        expect(screen.getByText(/Questanizer/i)).toBeInTheDocument();
        expect(screen.getByText(/About us/i)).toBeInTheDocument();
        expect(screen.getByText(/Contact us/i)).toBeInTheDocument();
    });

    it("checks that CSS classes are applied to elements", () => {
        render(<Footer />);
        expect(screen.getByRole("contentinfo")).toHaveClass("footer");
    });
});
