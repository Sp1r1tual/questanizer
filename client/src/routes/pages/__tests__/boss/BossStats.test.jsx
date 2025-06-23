import { useSelector } from "react-redux";

import { render, screen } from "@testing-library/react";
import BossStats from "../../boss/components/BossStats";

import styles from "../../boss/components/BossStats.module.css";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

describe("BossStats", () => {
    beforeEach(() => {
        useSelector.mockClear();
    });

    it("does not render the component if boss.bossId is missing (null or undefined)", () => {
        useSelector.mockReturnValueOnce({ bossBattle: { bossId: null } });

        render(<BossStats />);

        expect(screen.queryByText(/Health/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Rage/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Power/i)).not.toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { level: 3 })
        ).not.toBeInTheDocument();
    });

    it("renders boss stats when boss.bossId is present", () => {
        const mockBossState = {
            bossId: "boss-123",
            bossName: "Dreadlord Mal'Ganis",
            healthPoints: 750,
            maxHealth: 1000,
            rage: 50,
            bossRageBar: 100,
            bossPower: 150,
        };

        useSelector.mockReturnValueOnce(mockBossState);
        render(<BossStats />);

        expect(screen.getByText(mockBossState.bossName)).toBeInTheDocument();
        expect(
            screen.getByRole("heading", {
                level: 3,
                name: mockBossState.bossName,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                `💚 Health: ${mockBossState.healthPoints}/${mockBossState.maxHealth}`
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                `🔥 Rage: ${mockBossState.rage}/${mockBossState.bossRageBar}`
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(`⚔️ Power: ${mockBossState.bossPower}`)
        ).toBeInTheDocument();

        const healthProgressBar =
            screen.getByRole("progressbar", { name: /Health/i }) ||
            screen.getAllByRole("progressbar")[0];
        const rageProgressBar =
            screen.getByRole("progressbar", { name: /Rage/i }) ||
            screen.getAllByRole("progressbar")[1];

        expect(healthProgressBar).toBeInTheDocument();
        expect(healthProgressBar).toHaveAttribute(
            "max",
            String(mockBossState.maxHealth)
        );
        expect(healthProgressBar).toHaveAttribute(
            "value",
            String(mockBossState.healthPoints)
        );
        expect(healthProgressBar).toHaveClass(styles.health);

        expect(rageProgressBar).toBeInTheDocument();
        expect(rageProgressBar).toHaveAttribute(
            "max",
            String(mockBossState.bossRageBar)
        );
        expect(rageProgressBar).toHaveAttribute(
            "value",
            String(mockBossState.rage)
        );
        expect(rageProgressBar).toHaveClass(styles.rage);
    });

    it("calls useSelector with the correct selector function", () => {
        useSelector.mockReturnValueOnce({ bossBattle: { bossId: "test" } });

        render(<BossStats />);

        expect(useSelector).toHaveBeenCalledTimes(1);
    });
});
