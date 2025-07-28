import { Container } from "../../components/ui/wrappers/Container";
import { Dashboard } from "../../components/ui/wrappers/Dashboard";
import { BossBattle } from "./components/BossBattle";
import { UserStatsView } from "../../components/stats/UserStatsView";

const BossBattlePage = () => {
    return (
        <Dashboard>
            <UserStatsView />
            <Container>
                <BossBattle />
            </Container>
        </Dashboard>
    );
};

export { BossBattlePage };
