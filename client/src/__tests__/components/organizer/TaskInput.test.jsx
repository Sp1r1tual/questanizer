import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskInput from "../../../components/organizer/TaskInput";

import styles from "../../../components/organizer/TaskInput.module.css";

describe("TaskInput", () => {
    it("renders input with the correct placeholder", () => {
        render(<TaskInput onChange={() => {}} value="" />);

        const inputElement = screen.getByPlaceholderText(
            "Enter what you plan to do..."
        );

        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute("type", "text");
    });

    it("displays the passed value", () => {
        render(<TaskInput onChange={() => {}} value="Test task" />);

        const inputElement = screen.getByDisplayValue("Test task");

        expect(inputElement).toBeInTheDocument();
    });

    it("calls onChange with a new value when entered", () => {
        const handleChange = jest.fn();

        render(<TaskInput onChange={handleChange} value="" />);

        const inputElement = screen.getByPlaceholderText(
            "Enter what you plan to do..."
        );

        fireEvent.change(inputElement, { target: { value: "New task text" } });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith("New task text");
    });

    it("displays an error message when isInvalid is true", () => {
        render(<TaskInput onChange={() => {}} value="" isInvalid={true} />);

        const errorMessage = screen.getByText(
            "Please enter a task description"
        );

        expect(errorMessage).toBeInTheDocument();
    });

    it("does not display an error message when isInvalid is false", () => {
        render(<TaskInput onChange={() => {}} value="" isInvalid={false} />);

        const errorMessage = screen.queryByText(
            "Please enter a task description"
        );

        expect(errorMessage).not.toBeInTheDocument();
    });

    it("adds class 'invalidInput' when isInvalid is true", () => {
        render(
            <TaskInput onChange={() => {}} value="Some text" isInvalid={true} />
        );

        const inputElement = screen.getByDisplayValue("Some text");

        expect(inputElement).toHaveClass(styles.invalidInput);
    });

    it("does not add the 'invalidInput' class when isInvalid is false", () => {
        render(
            <TaskInput
                onChange={() => {}}
                value="Some text"
                isInvalid={false}
            />
        );

        const inputElement = screen.getByDisplayValue("Some text");

        expect(inputElement).not.toHaveClass(styles.invalidInput);
    });
});
