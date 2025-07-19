import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskFilters from "../../../components/organizer/TaskFilters";

describe("TaskFilters", () => {
    const mockOnFilterChange = jest.fn();

    beforeEach(() => {
        mockOnFilterChange.mockClear();
        render(<TaskFilters onFilterChange={mockOnFilterChange} />);
    });

    it("renders all filter selects", () => {
        expect(
            screen.getByLabelText(/filter tasks by status/i)
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(/filter tasks by deadline/i)
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(/filter tasks by difficulty/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/sort tasks by/i)).toBeInTheDocument();
    });

    it("calls onFilterChange with correct values on status change", () => {
        fireEvent.change(screen.getByLabelText(/filter tasks by status/i), {
            target: { value: "completed" },
        });
        expect(mockOnFilterChange).toHaveBeenCalledWith(
            expect.objectContaining({ status: "completed" })
        );
    });

    it("calls onFilterChange with correct values on deadline change", () => {
        fireEvent.change(screen.getByLabelText(/filter tasks by deadline/i), {
            target: { value: "overdue" },
        });
        expect(mockOnFilterChange).toHaveBeenCalledWith(
            expect.objectContaining({ deadline: "overdue" })
        );
    });

    it("calls onFilterChange with correct values on difficulty change", () => {
        fireEvent.change(screen.getByLabelText(/filter tasks by difficulty/i), {
            target: { value: "hard" },
        });
        expect(mockOnFilterChange).toHaveBeenCalledWith(
            expect.objectContaining({ difficulty: "hard" })
        );
    });

    it("calls onFilterChange with correct values on sortBy change", () => {
        fireEvent.change(screen.getByLabelText(/sort tasks by/i), {
            target: { value: "deadline" },
        });
        expect(mockOnFilterChange).toHaveBeenCalledWith(
            expect.objectContaining({ sortBy: "deadline" })
        );
    });
});
