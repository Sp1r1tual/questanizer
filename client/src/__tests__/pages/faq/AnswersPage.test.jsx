import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AnswersPage from "../../../routes/pages/faq/AnswersPage";

jest.mock("../../../routes/pages/faq/components/Answers", () => () => (
    <div data-testid="mock-answers">Mock Answers Component</div>
));

jest.mock("../../../components/ui/Container", () => ({ children }) => (
    <div data-testid="mock-container">{children}</div>
));

describe("AnswersPage", () => {
    it("renders Container and Answers component", () => {
        render(<AnswersPage />);

        const container = screen.getByTestId("mock-container");
        const answers = screen.getByTestId("mock-answers");

        expect(container).toBeInTheDocument();
        expect(answers).toBeInTheDocument();
    });
});
