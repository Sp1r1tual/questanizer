import { useSelector } from "react-redux";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BossStats from "../../../routes/pages/boss/components/BossStats";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

describe("BossStats", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns null if bossId is missing", () => {
        useSelector.mockImplementation((selector) =>
            selector({
                bossBattle: {
                    bossId: null,
                },
            })
        );

        const { container } = render(<BossStats />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders boss stats correctly when bossId is present", () => {
        const mockBossState = {
            bossId: "boss-001",
            bossName: "Big Bad Boss",
            healthPoints: 80,
            maxHealthPoints: 100,
            rage: 30,
            bossRageBar: 50,
            bossPower: 999,
        };

        useSelector.mockImplementation((selector) =>
            selector({
                bossBattle: mockBossState,
            })
        );

        render(<BossStats />);

        expect(screen.getByText("Big Bad Boss")).toBeInTheDocument();

        expect(
            screen.getByText(
                `💚 Health: ${mockBossState.healthPoints}/${mockBossState.maxHealthPoints}`
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

        const healthBar = screen.getByLabelText("Health");

        expect(healthBar).toHaveAttribute(
            "max",
            String(mockBossState.maxHealthPoints)
        );
        expect(healthBar).toHaveAttribute(
            "value",
            String(mockBossState.healthPoints)
        );

        const rageBar = screen.getByLabelText("Rage");

        expect(rageBar).toHaveAttribute(
            "max",
            String(mockBossState.bossRageBar)
        );
        expect(rageBar).toHaveAttribute("value", String(mockBossState.rage));
    });
});
