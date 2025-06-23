import { render, screen, fireEvent } from "@testing-library/react";
import BossBattle from "../../boss/components/BossBattle";

jest.mock("../../../../hooks/boss/useBoss");
jest.mock("../../boss/components/BossBattleStartBtn", () => ({ onClick }) => (
    <button onClick={onClick}>Mock Start Button</button>
));
jest.mock("../../boss/components/BossStats", () => () => (
    <div>Mock BossStats</div>
));
jest.mock("../../boss/components/BossView", () => () => (
    <div>Mock BossView</div>
));

import { useBoss } from "../../../../hooks/boss/useBoss";

describe("BossBattle", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the start button if bossId is missing, and calls initBoss on click", () => {
        const initBoss = jest.fn();

        useBoss.mockReturnValue({
            boss: { bossId: null },
            initBoss,
        });

        render(<BossBattle />);

        const button = screen.getByRole("button", {
            name: /mock start button/i,
        });

        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        expect(initBoss).toHaveBeenCalledTimes(1);
    });

    it("renders BossStats and BossView if bossId is present", () => {
        useBoss.mockReturnValue({
            boss: { bossId: "boss-001" },
            initBoss: jest.fn(),
        });

        render(<BossBattle />);

        expect(screen.getByText("Mock BossStats")).toBeInTheDocument();
        expect(screen.getByText("Mock BossView")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /mock start button/i })
        ).not.toBeInTheDocument();
    });
});
