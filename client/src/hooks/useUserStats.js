import { useSelector, useDispatch } from "react-redux";

import {
    gainExperience,
    takeDamage,
    heal,
} from "../store/stats/userStatsSlice";

const useUserStats = () => {
    const dispatch = useDispatch();
    const { experience, level, health, maxHealth } = useSelector(
        (state) => state.stats
    );

    const addXP = (amount) => dispatch(gainExperience(amount));
    const damage = (amount) => dispatch(takeDamage(amount));
    const recover = (amount) => dispatch(heal(amount));

    return {
        experience,
        level,
        health,
        maxHealth,
        addXP,
        damage,
        recover,
    };
};

export { useUserStats };
