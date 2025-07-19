import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UserHealth from "../../../components/stats/UserHealth";

describe("UserHealth", () => {
    it("renders current and maximum health", () => {
        const health = 75;
        const maxHealth = 100;

        render(<UserHealth health={health} maxHealth={maxHealth} />);

        expect(
            screen.getByText(`HP: ${health}/${maxHealth}`)
        ).toBeInTheDocument();
    });

    it("displays the correct health percentage on the panel", () => {
        const health = 50;
        const maxHealth = 200;
        const expectedHealthPercent = Math.round((health / maxHealth) * 100);

        render(<UserHealth health={health} maxHealth={maxHealth} />);

        const healthBarFill = screen.getByTestId("health-bar-fill");

        expect(healthBarFill).toHaveStyle(`width: ${expectedHealthPercent}%`);
    });

    it("handles 0 health correctly (0% fill)", () => {
        const health = 0;
        const maxHealth = 100;

        render(<UserHealth health={health} maxHealth={maxHealth} />);

        expect(
            screen.getByText(`HP: ${health}/${maxHealth}`)
        ).toBeInTheDocument();

        const healthBarFill = screen.getByTestId("health-bar-fill");

        expect(healthBarFill).toHaveStyle("width: 0%");
    });

    it("handles full health (100% fill)", () => {
        const health = 100;
        const maxHealth = 100;

        render(<UserHealth health={health} maxHealth={maxHealth} />);

        expect(
            screen.getByText(`HP: ${health}/${maxHealth}`)
        ).toBeInTheDocument();

        const healthBarFill = screen.getByTestId("health-bar-fill");

        expect(healthBarFill).toHaveStyle("width: 100%");
    });

    it("handles health when it exceeds maximum (limited to 100% visually, but calculation can be higher)", () => {
        const health = 150;
        const maxHealth = 100;
        const expectedHealthPercent = Math.round((health / maxHealth) * 100);

        render(<UserHealth health={health} maxHealth={maxHealth} />);

        expect(
            screen.getByText(`HP: ${health}/${maxHealth}`)
        ).toBeInTheDocument();

        const healthBarFill = screen.getByTestId("health-bar-fill");

        expect(healthBarFill).toHaveStyle(`width: ${expectedHealthPercent}%`);
    });
});
