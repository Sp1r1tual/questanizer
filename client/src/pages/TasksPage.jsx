import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { ContainerMedium } from "@/components/ui/wrappers/ContainerMedium";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { TasksView } from "@/components/organizer/TasksView";
import { ConfirmOverdueTasksModal } from "@/components/organizer/modals/ConfirmOverdueTasksModal";

import backgroundImg from "@/assets/main-background.png";

import styles from "./TasksPage.module.css";

const TasksPage = () => {
  return (
    <div className={styles.tasksWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
      <Wrapper>
        <ConfirmOverdueTasksModal />
        <Dashboard>
          <ContainerMedium>
            <UserStatsView />
          </ContainerMedium>
          <TasksView />
        </Dashboard>
      </Wrapper>
    </div>
  );
};

export { TasksPage };
