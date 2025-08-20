import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { Container } from "@/components/ui/wrappers/Container";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { BossBattle } from "@/components/boss/BossBattle";

import backgroundImg from "@/assets/boss-fight-background.png";

import styles from "./BossBattlePage.module.css";

const BossBattlePage = () => {
  return (
    <div className={styles.bossWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
      <Wrapper>
        <Dashboard>
          <Container>
            <UserStatsView />
          </Container>
          <Container>
            <BossBattle />
          </Container>
        </Dashboard>
      </Wrapper>
    </div>
  );
};

export { BossBattlePage };
