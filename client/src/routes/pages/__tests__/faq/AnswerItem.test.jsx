import { render, screen, fireEvent } from "@testing-library/react";
import AnswerItem from "../../faq/components/AnswerItem";

describe("AnswerItem", () => {
    const questionText = "Question?";
    const answerText = "Answer to the question.";

    it("renders the question", () => {
        render(
            <AnswerItem
                question={questionText}
                answer={answerText}
                isOpen={false}
                onToggle={() => {}}
            />
        );
        expect(screen.getByText(questionText)).toBeInTheDocument();
    });

    it("shows a down arrow when isOpen=false", () => {
        render(
            <AnswerItem
                question={questionText}
                answer={answerText}
                isOpen={false}
                onToggle={() => {}}
            />
        );
        expect(screen.getByText("▼")).toBeInTheDocument();
    });

    it("shows an up arrow when isOpen=true", () => {
        render(
            <AnswerItem
                question={questionText}
                answer={answerText}
                isOpen={true}
                onToggle={() => {}}
            />
        );
        expect(screen.getByText("▲")).toBeInTheDocument();
    });

    it("shows the answer when isOpen=true", () => {
        render(
            <AnswerItem
                question={questionText}
                answer={answerText}
                isOpen={true}
                onToggle={() => {}}
            />
        );
        expect(screen.getByText(answerText)).toBeInTheDocument();
    });

    it("does not show the answer when isOpen=false", () => {
        render(
            <AnswerItem
                question={questionText}
                answer={answerText}
                isOpen={false}
                onToggle={() => {}}
            />
        );

        const answerWrapper =
            screen.getByText(answerText).parentElement.parentElement;

        expect(answerWrapper.className).not.toContain("open");
    });

    it("calls onToggle when clicking on a question", () => {
        const onToggleMock = jest.fn();

        render(
            <AnswerItem
                question={questionText}
                answer={answerText}
                isOpen={false}
                onToggle={onToggleMock}
            />
        );

        const questionElement = screen.getByText(questionText);

        fireEvent.click(questionElement);

        expect(onToggleMock).toHaveBeenCalledTimes(1);
    });
});
