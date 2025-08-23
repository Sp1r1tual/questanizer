import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { Container } from "@/components/ui/wrappers/Container";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { TasksView } from "@/components/organizer/TasksView";
import { ConfirmOverdueTasks } from "@/components/organizer/ConfirmOverdueTasks";
import { BackgroundLayout } from "../layouts/BackgroundLayout";

const TasksPage = () => {
  return (
    <BackgroundLayout>
      <Wrapper>
        <ConfirmOverdueTasks />
        <Dashboard>
          <Container>
            <UserStatsView />
          </Container>
          <TasksView />
        </Dashboard>
      </Wrapper>
    </BackgroundLayout>
  );
};

export { TasksPage };
