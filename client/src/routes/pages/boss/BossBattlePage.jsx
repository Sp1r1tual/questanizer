import Container from "../../../components/ui/Container";
import Dashboard from "../../../components/ui/Dashboard";
import BossBattle from "./components/BossBattle";
import UserStatsView from "../../../components/stats/UserStatsView";

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

export default BossBattlePage;
