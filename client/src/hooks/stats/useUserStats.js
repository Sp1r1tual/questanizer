import { useSelector } from "react-redux";

const useUserStats = () => {
    const { experience, level, health, maxHealth } = useSelector(
        (state) => state.stats
    );

    return {
        experience,
        level,
        health,
        maxHealth,
    };
};

export { useUserStats };
