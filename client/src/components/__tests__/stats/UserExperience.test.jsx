import { render, screen } from "@testing-library/react";
import UserExperience from "../../stats/UserExperience";

describe("UserExperience", () => {
    it("renders current level, experience, and required experience", () => {
        const experience = 50;
        const level = 1;

        render(<UserExperience experience={experience} level={level} />);

        expect(
            screen.getByText(`Level ${level}, XP: ${experience}/${level * 100}`)
        ).toBeInTheDocument();
    });

    it("displays the correct percentage of progress on the scale", () => {
        const experience = 75;
        const level = 1;
        const expToNext = level * 100;
        const expectedProgressPercent = Math.round(
            (experience / expToNext) * 100
        );

        render(<UserExperience experience={experience} level={level} />);

        const progressBarFill = screen.getByTestId("progress-bar-fill");

        expect(progressBarFill).toHaveStyle(
            `width: ${expectedProgressPercent}%`
        );
    });

    it("processes 0 experience correctly (0% progress)", () => {
        const experience = 0;
        const level = 1;
        render(<UserExperience experience={experience} level={level} />);

        expect(
            screen.getByText(`Level ${level}, XP: ${experience}/${level * 100}`)
        ).toBeInTheDocument();

        const progressBarFill = screen.getByTestId("progress-bar-fill");

        expect(progressBarFill).toHaveStyle("width: 0%");
    });

    it("processes full experience to the next level (100% progress)", () => {
        const experience = 100;
        const level = 1;

        render(<UserExperience experience={experience} level={level} />);

        expect(
            screen.getByText(`Level ${level}, XP: ${experience}/${level * 100}`)
        ).toBeInTheDocument();

        const progressBarFill = screen.getByTestId("progress-bar-fill");

        expect(progressBarFill).toHaveStyle("width: 100%");
    });

    it("processes experience beyond what is required for the next level (can be more than 100%)", () => {
        const experience = 150;
        const level = 1;
        const expToNext = level * 100;
        const expectedProgressPercent = Math.round(
            (experience / expToNext) * 100
        );

        render(<UserExperience experience={experience} level={level} />);

        expect(
            screen.getByText(`Level ${level}, XP: ${experience}/${level * 100}`)
        ).toBeInTheDocument();

        const progressBarFill = screen.getByTestId("progress-bar-fill");

        expect(progressBarFill).toHaveStyle(
            `width: ${expectedProgressPercent}%`
        );
    });
});
