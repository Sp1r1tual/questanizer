import { Dashboard } from "../components/ui/wrappers/Dashboard";
import { BossBattle } from "../components/boos/BossBattle";
import { UserStatsView } from "../components/stats/UserStatsView";
import { ContainerMedium } from "../components/ui/wrappers/ContainerMedium";
import { Wrapper } from "../components/ui/wrappers/Wrapper";

import backgroundImg from "../assets/boss-fight-background.png";

import styles from "./BossBattlePage.module.css";

const BossBattlePage = () => {
    return (
        <div
            className={styles.bossWrapper}
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <Wrapper>
                <Dashboard>
                    <ContainerMedium>
                        <UserStatsView />
                    </ContainerMedium>
                    <ContainerMedium>
                        <BossBattle />
                    </ContainerMedium>
                </Dashboard>
            </Wrapper>
        </div>
    );
};

export { BossBattlePage };
