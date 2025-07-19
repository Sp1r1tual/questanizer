import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundaryWrapper from "../../../components/errors/ErrorBoundaryWrapper";

const ProblematicComponent = () => {
    throw new Error("Test error message");
};

describe("ErrorBoundaryWrapper", () => {
    it("renders fallback UI on error", () => {
        render(
            <ErrorBoundaryWrapper>
                <ProblematicComponent />
            </ErrorBoundaryWrapper>
        );

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/test error message/i)).toBeInTheDocument();
    });

    it("calls onReset when 'Try again' is clicked", () => {
        const consoleLogSpy = jest

            .spyOn(console, "log")
            .mockImplementation(() => {});

        render(
            <ErrorBoundaryWrapper>
                <ProblematicComponent />
            </ErrorBoundaryWrapper>
        );

        fireEvent.click(screen.getByText(/try again/i));

        expect(consoleLogSpy).toHaveBeenCalledWith("Reset triggered");

        consoleLogSpy.mockRestore();
    });
});
