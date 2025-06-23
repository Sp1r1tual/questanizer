import { render, screen, fireEvent } from "@testing-library/react";
import AddNewTaskBtn from "../../organizer/AddNewTaskBtn";

import styles from "../../organizer/AddNewTaskBtn.module.css";

describe("AddNewTaskBtn", () => {
    it("renders a button with the text 'Add New Task' and a '+' icon", () => {
        render(<AddNewTaskBtn onClick={() => {}} />);

        const buttonText = screen.getByText("Add New Task");

        expect(buttonText).toBeInTheDocument();
        expect(buttonText.tagName).toBe("SPAN");

        const buttonIcon = screen.getByText("+");

        expect(buttonIcon).toBeInTheDocument();
        expect(buttonIcon.tagName).toBe("SPAN");
    });

    it("calls onClick when the button is clicked", () => {
        const handleClick = jest.fn();

        render(<AddNewTaskBtn onClick={handleClick} />);

        const buttonElement = screen
            .getByText("Add New Task")
            .closest("button");
        expect(buttonElement).toBeInTheDocument();

        fireEvent.click(buttonElement);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("button is disabled when disabled is true", () => {
        render(<AddNewTaskBtn onClick={() => {}} disabled={true} />);

        const buttonElement = screen
            .getByText("Add New Task")
            .closest("button");
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toBeDisabled();
    });

    it("the button is not disabled by default (disabled is false)", () => {
        render(<AddNewTaskBtn onClick={() => {}} />);

        const buttonElement = screen
            .getByText("Add New Task")
            .closest("button");
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).not.toBeDisabled();
    });

    it("adds the class 'disabled' when disabled is true", () => {
        render(<AddNewTaskBtn onClick={() => {}} disabled={true} />);

        const buttonElement = screen
            .getByText("Add New Task")
            .closest("button");
        expect(buttonElement).toHaveClass(styles.disabled);
    });

    it("does not add the class 'disabled' when disabled is false", () => {
        render(<AddNewTaskBtn onClick={() => {}} disabled={false} />);

        const buttonElement = screen
            .getByText("Add New Task")
            .closest("button");
        expect(buttonElement).not.toHaveClass(styles.disabled);
    });
});
