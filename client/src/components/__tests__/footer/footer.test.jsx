import { render, screen } from "@testing-library/react";
import Footer from "../../footer/Footer";

describe("Footer", () => {
    const mockYear = 2025;
    let RealDate;

    beforeAll(() => {
        RealDate = global.Date;

        global.Date = class extends RealDate {
            constructor(daitring) {
                if (daitring) {
                    return new RealDate(daitring);
                }
                return {
                    getFullYear: () => mockYear,
                };
            }
        };
    });

    afterAll(() => {
        global.Date = RealDate;
    });

    it("renders without errors", () => {
        render(<Footer />);
        expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("displays the current year in the copyright", () => {
        render(<Footer />);
        const copyrightText = screen.getByText(new RegExp(`© ${mockYear}`));

        expect(copyrightText).toBeInTheDocument();
    });

    it('displays the name "Questanizer"', () => {
        render(<Footer />);
        const questanizerLink = screen.getByText("Questanizer");

        expect(questanizerLink).toBeInTheDocument();
        expect(questanizerLink).toHaveAttribute("href", "/");
    });

    it('displays the "About" link with the correct href', () => {
        render(<Footer />);
        const aboutLink = screen.getByRole("link", { name: /About/i });

        expect(aboutLink).toBeInTheDocument();
        expect(aboutLink).toHaveAttribute(
            "href",
            "https://github.com/Sp1r1tual/questanizer-pet-project"
        );
        expect(aboutLink).toHaveAttribute("target", "_blank");
        expect(aboutLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it('displays the "Privacy Policy" link with the correct href', () => {
        render(<Footer />);
        const privacyLink = screen.getByRole("link", {
            name: /Privacy Policy/i,
        });

        expect(privacyLink).toBeInTheDocument();
        expect(privacyLink).toHaveAttribute("href", "/");
        expect(privacyLink).toHaveAttribute("target", "_blank");
        expect(privacyLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it('displays the "Licensing" link with the correct href', () => {
        render(<Footer />);
        const licensingLink = screen.getByRole("link", { name: /Licensing/i });

        expect(licensingLink).toBeInTheDocument();
        expect(licensingLink).toHaveAttribute("href", "/");
        expect(licensingLink).toHaveAttribute("target", "_blank");
        expect(licensingLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it('displays the "Contact" link with the correct href', () => {
        render(<Footer />);
        const contactLink = screen.getByRole("link", { name: /Contact/i });

        expect(contactLink).toBeInTheDocument();
        expect(contactLink).toHaveAttribute("href", "/");
        expect(contactLink).toHaveAttribute("target", "_blank");
        expect(contactLink).toHaveAttribute("rel", "noopener noreferrer");
    });
});
