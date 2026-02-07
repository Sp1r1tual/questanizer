import { PageContainer } from "@/components/ui/wrappers/PageContainer";
import { Card } from "@/components/ui/wrappers/Card";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { BossBattle } from "@/components/boss/BossBattle";

const BossBattlePage = () => {
  return (
    <PageContainer>
      <Card size="large">
        <UserStatsView />
      </Card>
      <Card size="large">
        <BossBattle />
      </Card>
    </PageContainer>
  );
};

export { BossBattlePage };
