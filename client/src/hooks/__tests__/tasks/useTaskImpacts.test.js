import { useTaskImpacts } from "../../tasks/useTaskImpacts";

import React from "react";
import { render } from "@testing-library/react";
import {
    gainExperience,
    takeDamage,
} from "../../../store/stats/userStatsSlice";
import { markDamageTaken } from "../../../store/tasks/tasksSlice";

jest.mock("../../../config/statsConfig", () => ({
    DIFFICULTY_REWARDS: {
        easy: { xp: 10, damage: 5 },
        medium: { xp: 20, damage: 10 },
        hard: { xp: 40, damage: 20 },
    },
}));

const mockDispatch = jest.fn();

const TestComponent = ({ action }) => {
    const now = new Date().toISOString();

    const tasks = [
        {
            id: "1",
            isCompleted: false,
            deadline: new Date(Date.now() - 3600000).toISOString(),
            difficulty: "easy",
            damageTaken: false,
        },
        {
            id: "2",
            isCompleted: false,
            deadline: now,
            difficulty: "hard",
            damageTaken: true,
        },
    ];

    const { awardExperience, applyOverdueDamage, checkOverdueTasks } =
        useTaskImpacts({ tasks, dispatch: mockDispatch });

    React.useEffect(() => {
        if (action === "award") awardExperience("hard", true);
        if (action === "awardNoDeadline") awardExperience("hard", false);
        if (action === "applyDamage") applyOverdueDamage("medium");
        if (action === "checkOverdue") checkOverdueTasks();
    }, [action]);

    return <div>ImpactTest</div>;
};

describe("useTaskImpacts", () => {
    beforeEach(() => {
        mockDispatch.mockClear();
    });

    it("gains experience with deadlines", () => {
        render(<TestComponent action="award" />);
        expect(mockDispatch).toHaveBeenCalledWith(gainExperience(40));
    });

    it("earns less experience without a deadline", () => {
        render(<TestComponent action="awardNoDeadline" />);
        expect(mockDispatch).toHaveBeenCalledWith(gainExperience(8));
    });

    it("damages for delay", () => {
        render(<TestComponent action="applyDamage" />);
        expect(mockDispatch).toHaveBeenCalledWith(takeDamage(10));
    });

    it("detects overdue tasks and punishes", () => {
        render(<TestComponent action="checkOverdue" />);
        expect(mockDispatch).toHaveBeenCalledWith(takeDamage(5));
        expect(mockDispatch).toHaveBeenCalledWith(markDamageTaken("1"));
        expect(mockDispatch).not.toHaveBeenCalledWith(markDamageTaken("2"));
    });
});
