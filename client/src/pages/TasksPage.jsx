import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { Container } from "@/components/ui/wrappers/Container";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { TasksView } from "@/components/organizer/TasksView";
import { ConfirmOverdueTasks } from "@/components/organizer/ConfirmOverdueTasks";

import backgroundImg from "@/assets/main-background.png";

import styles from "./TasksPage.module.css";

const TasksPage = () => {
  return (
    <div className={styles.tasksWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
      <Wrapper>
        <ConfirmOverdueTasks />
        <Dashboard>
          <Container>
            <UserStatsView />
          </Container>
          <TasksView />
        </Dashboard>
      </Wrapper>
    </div>
  );
};

export { TasksPage };
