import { render, screen, fireEvent } from "@testing-library/react";
import Answers from "../../faq/components/Answers";
import faqs from "../../../../data/faqs";

jest.mock(
    "../../faq/components/AnswerItem",
    () =>
        ({ question, answer, isOpen, onToggle }) =>
            (
                <div>
                    <button onClick={onToggle}>{question}</button>
                    {isOpen && <div data-testid="answer">{answer}</div>}
                </div>
            )
);

describe("Answers component", () => {
    it("renders the page title", () => {
        render(<Answers />);
        expect(screen.getByText("Часті запитання")).toBeInTheDocument();
    });

    it("renders all FAQ questions", () => {
        render(<Answers />);
        faqs.forEach((faq) => {
            expect(screen.getByText(faq.question)).toBeInTheDocument();
        });
    });

    it("toggles answer visibility when question is clicked", () => {
        render(<Answers />);

        const questionBtn = screen.getByText("What is Rage?");

        expect(screen.queryByText(faqs[4].answer)).not.toBeInTheDocument();

        fireEvent.click(questionBtn);

        expect(screen.getByText(faqs[4].answer)).toBeInTheDocument();

        fireEvent.click(questionBtn);

        expect(screen.queryByText(faqs[4].answer)).not.toBeInTheDocument();
    });

    it("allows multiple answers to be open independently", () => {
        render(<Answers />);

        const q1 = screen.getByText(
            "How do task difficulty levels affect the game?"
        );
        const q2 = screen.getByText("What happens when I lose all my health?");

        fireEvent.click(q1);
        fireEvent.click(q2);

        expect(screen.getByText(faqs[0].answer)).toBeInTheDocument();
        expect(screen.getByText(faqs[5].answer)).toBeInTheDocument();
    });
});
