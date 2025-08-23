import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { Container } from "@/components/ui/wrappers/Container";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { BossBattle } from "@/components/boss/BossBattle";
import { BackgroundLayout } from "@/layouts/BackgroundLayout";

const BossBattlePage = () => {
  return (
    <BackgroundLayout>
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
    </BackgroundLayout>
  );
};

export { BossBattlePage };
