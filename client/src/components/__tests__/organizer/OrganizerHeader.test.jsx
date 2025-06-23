import { render, screen } from "@testing-library/react";
import TaskHeader from "../../organizer/OrganizerHeader";

describe("TaskHeader", () => {
    it("renders the correct title text", () => {
        render(<TaskHeader />);

        const headerText = screen.getByText("What epic journey begins now?");

        expect(headerText).toBeInTheDocument();
        expect(headerText.tagName).toBe("H2");
    });

    it("renders images with the correct alt attribute", () => {
        render(<TaskHeader />);

        const imageElement = screen.getByAltText("img");

        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute("src");
    });

    it("image and text are part of the same h2 heading", () => {
        render(<TaskHeader />);

        const h2Element = screen
            .getByText("What epic journey begins now?")
            .closest("h2");
        expect(h2Element).toBeInTheDocument();

        const imageElement = screen.getByAltText("img");

        expect(h2Element).toContainElement(imageElement);
    });
});
