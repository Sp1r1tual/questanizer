import { Dashboard } from "../../components/ui/wrappers/Dashboard";
import { BossBattle } from "./components/BossBattle";
import { UserStatsView } from "../../components/stats/UserStatsView";
import { ContainerMedium } from "../../components/ui/wrappers/ContainerMedium";

const BossBattlePage = () => {
    return (
        <Dashboard>
            <ContainerMedium>
                <UserStatsView />
            </ContainerMedium>
            <ContainerMedium>
                <BossBattle />
            </ContainerMedium>
        </Dashboard>
    );
};

export { BossBattlePage };
