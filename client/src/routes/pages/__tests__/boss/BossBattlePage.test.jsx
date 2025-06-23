import { render, screen } from "@testing-library/react";
import BossBattlePage from "../../boss/BossBattlePage";

jest.mock("../../../../components/ui/Container", () => {
    return ({ children }) => <div data-testid="mock-container">{children}</div>;
});

jest.mock("../../../../components/ui/Dashboard", () => {
    return ({ children }) => <div data-testid="mock-dashboard">{children}</div>;
});

jest.mock("../../boss/components/BossBattle", () => {
    return () => <div data-testid="mock-boss-battle">Mock BossBattle</div>;
});

jest.mock("../../../../components/stats/UserStatsView", () => {
    return () => (
        <div data-testid="mock-user-stats-view">Mock UserStatsView</div>
    );
});

describe("BossBattlePage", () => {
    it("renders mocked Dashboard, UserStatsView, Container, and BossBattle components", () => {
        render(<BossBattlePage />);

        const dashboardElement = screen.getByTestId("mock-dashboard");
        const userStatsViewElement = screen.getByTestId("mock-user-stats-view");
        const containerElement = screen.getByTestId("mock-container");
        const bossBattleElement = screen.getByTestId("mock-boss-battle");

        expect(dashboardElement).toBeInTheDocument();
        expect(userStatsViewElement).toBeInTheDocument();
        expect(containerElement).toBeInTheDocument();
        expect(bossBattleElement).toBeInTheDocument();

        expect(dashboardElement).toContainElement(userStatsViewElement);
        expect(dashboardElement).toContainElement(containerElement);
        expect(containerElement).toContainElement(bossBattleElement);
    });
});
