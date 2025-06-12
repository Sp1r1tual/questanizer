import { useUserStats } from "../../hooks/useUserStats";

import UserExperience from "./UserExperience";
import UserHealth from "./UserHealth";
import Container from "../ui/Container";

const UserStatsManager = () => {
    const { experience, level } = useUserStats();
    const { health, maxHealth } = useUserStats();

    return;
};

export default UserStatsManager;
