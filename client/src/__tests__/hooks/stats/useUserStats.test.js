import { useSelector } from "react-redux";
import useUserStats from "../../../hooks/stats/useUserStats";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

describe("useUserStats", () => {
    it("should return stats from redux store", () => {
        const mockStats = {
            experience: 150,
            level: 5,
            health: 80,
            maxHealth: 100,
        };

        useSelector.mockImplementation((selector) =>
            selector({ stats: mockStats })
        );

        const result = useUserStats();

        expect(result).toEqual(mockStats);
    });
});
