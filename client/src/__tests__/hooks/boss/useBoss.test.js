import useBoss from "../../../hooks/boss/useBoss";

import React from "react";
import { render, act } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { $api } from "../../../http";

jest.mock("../../../http", () => ({
    $api: {
        post: jest.fn(),
    },
}));

const mockStore = configureStore([]);

const TestComponent = ({ tasks = [], forcedBossId = null }) => {
    const { boss, initBoss, loading } = useBoss(tasks);

    React.useEffect(() => {
        initBoss(forcedBossId);
    }, [initBoss, forcedBossId]);

    return (
        <div>
            <div data-testid="loading">
                {loading ? "loading" : "not loading"}
            </div>
            <div data-testid="boss-name">{boss?.name || "no boss"}</div>
        </div>
    );
};

describe("useBoss hook", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            bossBattle: {
                loading: false,
                name: null,
            },
        });

        jest.clearAllMocks();
    });

    it("dispatches loading true at the start", async () => {
        $api.post.mockResolvedValue({
            data: { boss: { id: "boss1", name: "Dragon" } },
        });

        render(
            <Provider store={store}>
                <TestComponent />
            </Provider>
        );

        const actions = store.getActions();

        expect(actions).toContainEqual({
            type: "bossBattle/setBossLoading",
            payload: true,
        });
    });

    it("calls API /boss/spawn without forcedBossId", async () => {
        $api.post.mockResolvedValue({
            data: { boss: { id: "boss1", name: "Dragon" } },
        });

        await act(async () => {
            render(
                <Provider store={store}>
                    <TestComponent />
                </Provider>
            );
        });

        expect($api.post).toHaveBeenCalledWith("/boss/spawn", {});
    });

    it("calls API /boss/spawn with forcedBossId", async () => {
        const forcedBossId = "forced123";

        $api.post.mockResolvedValue({
            data: { boss: { id: forcedBossId, name: "Forced Boss" } },
        });

        await act(async () => {
            render(
                <Provider store={store}>
                    <TestComponent forcedBossId={forcedBossId} />
                </Provider>
            );
        });

        expect($api.post).toHaveBeenCalledWith("/boss/spawn", {
            bossId: forcedBossId,
        });
    });

    it("dispatches setActiveBoss with correct overdue tasks", async () => {
        const bossData = { id: "boss1", name: "Dragon" };

        $api.post.mockResolvedValue({ data: { boss: bossData } });

        const tasks = [
            {
                id: "task1",
                isCompleted: false,
                deadline: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            },
            {
                id: "task2",
                isCompleted: false,
                deadline: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
            },
            {
                id: "task3",
                isCompleted: true,
                deadline: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            },
        ];

        await act(async () => {
            render(
                <Provider store={store}>
                    <TestComponent tasks={tasks} />
                </Provider>
            );
        });

        const actions = store.getActions();

        expect(
            actions.some(
                (action) =>
                    action.type === "bossBattle/setActiveBoss" &&
                    action.payload.initiallyOverdue.includes("task1")
            )
        ).toBe(true);

        expect(
            actions.some(
                (action) =>
                    action.type === "bossBattle/setActiveBoss" &&
                    !action.payload.initiallyOverdue.includes("task2")
            )
        ).toBe(true);

        expect(
            actions.some(
                (action) =>
                    action.type === "bossBattle/setActiveBoss" &&
                    !action.payload.initiallyOverdue.includes("task3")
            )
        ).toBe(true);
    });

    it("dispatches loading false at the end", async () => {
        $api.post.mockResolvedValue({
            data: { boss: { id: "boss1", name: "Dragon" } },
        });

        await act(async () => {
            render(
                <Provider store={store}>
                    <TestComponent />
                </Provider>
            );
        });

        const actions = store.getActions();

        expect(actions).toContainEqual({
            type: "bossBattle/setBossLoading",
            payload: false,
        });
    });

    it("handles API errors gracefully", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        $api.post.mockRejectedValue(new Error("API error"));

        await act(async () => {
            render(
                <Provider store={store}>
                    <TestComponent />
                </Provider>
            );
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});
