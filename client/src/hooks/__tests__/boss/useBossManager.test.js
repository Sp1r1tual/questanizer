import { useBossManager } from "../../boss/useBossManager";

import React from "react";
import { render } from "@testing-library/react";
import { setActiveBoss, resetBoss } from "../../../store/boss/bossBattleSlice";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

import { useDispatch, useSelector } from "react-redux";

jest.mock("../../../data/bosses", () => [
    {
        bossId: 1,
        bossName: "Boss One",
        healthPoints: 100,
        bossPower: 20,
        bossRewardExp: 50,
        bossRageBar: 10,
        bossImg: "boss1.png",
    },
]);

const TestComponent = ({ action }) => {
    const { initBoss, resetCurrentBoss } = useBossManager();

    React.useEffect(() => {
        if (action === "init") initBoss();
        if (action === "reset") resetCurrentBoss(true);
    }, [action, initBoss, resetCurrentBoss]);

    return <div>BossManagerTest</div>;
};

describe("useBossManager", () => {
    let dispatchMock;

    beforeEach(() => {
        dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        window.alert = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("initializes the boss if it is not already activated", () => {
        const mockState = {
            bossBattle: {
                bossId: null,
                currentBossIndex: 0,
            },
            tasks: {
                tasks: [
                    {
                        id: "task1",
                        isCompleted: false,
                        deadline: new Date(Date.now() - 10000).toISOString(),
                    },
                    {
                        id: "task2",
                        isCompleted: true,
                    },
                ],
            },
        };

        useSelector.mockImplementation((selector) => selector(mockState));

        render(<TestComponent action="init" />);

        expect(dispatchMock).toHaveBeenCalledWith(
            setActiveBoss({
                bossId: 1,
                bossName: "Boss One",
                healthPoints: 100,
                bossPower: 20,
                bossRewardExp: 50,
                bossRageBar: 10,
                bossImg: "boss1.png",
                initiallyOverdue: ["task1"],
            })
        );
    });

    it("does not call dispatch if the boss is already activated", () => {
        const mockState = {
            bossBattle: {
                bossId: 1,
                currentBossIndex: 0,
            },
            tasks: {
                tasks: [],
            },
        };

        useSelector.mockImplementation((selector) => selector(mockState));

        render(<TestComponent action="init" />);

        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it("shows alert if there are no more bosses", () => {
        const mockState = {
            bossBattle: {
                bossId: null,
                currentBossIndex: 999,
            },
            tasks: {
                tasks: [],
            },
        };

        useSelector.mockImplementation((selector) => selector(mockState));

        render(<TestComponent action="init" />);

        expect(window.alert).toHaveBeenCalledWith(
            "🎉 You have defeated all available bosses!"
        );
        expect(dispatchMock).not.toHaveBeenCalled();
    });

    it("resets the boss with defeated = true", () => {
        const mockState = {
            bossBattle: {},
            tasks: {
                tasks: [],
            },
        };

        useSelector.mockImplementation((selector) => selector(mockState));

        render(<TestComponent action="reset" />);

        expect(dispatchMock).toHaveBeenCalledWith(
            resetBoss({ defeated: true })
        );
    });
});
