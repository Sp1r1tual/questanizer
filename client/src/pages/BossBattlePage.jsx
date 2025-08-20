import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { ContainerMedium } from "@/components/ui/wrappers/ContainerMedium";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { BossBattle } from "@/components/boss/BossBattle";

import backgroundImg from "@/assets/boss-fight-background.png";

import styles from "./BossBattlePage.module.css";

const BossBattlePage = () => {
  return (
    <div className={styles.bossWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
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
