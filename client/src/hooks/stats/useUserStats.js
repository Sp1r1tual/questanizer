import { useSelector } from "react-redux";

const useUserStats = () => {
    const { experience, level, health, maxHealth, gold } = useSelector(
        (state) => state.stats
    );

    return {
        experience,
        level,
        health,
        maxHealth,
        gold,
    };
};

export { useUserStats };
