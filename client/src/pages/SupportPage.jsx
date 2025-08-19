import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { ContainerMedium } from "@/components/ui/wrappers/ContainerMedium";
import { Answers } from "@/components/support/Answers";
import { Feedback } from "../components/support/Feedback";

import backgroundImg from "@/assets/support-background.png";

import styles from "./SupportPage.module.css";

const SupportPage = () => {
  return (
    <div className={styles.supportWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
      <Wrapper>
        <Dashboard>
          <ContainerMedium>
            <Answers />
          </ContainerMedium>
          <ContainerMedium>
            <Feedback />
          </ContainerMedium>
        </Dashboard>
      </Wrapper>
    </div>
  );
};

export { SupportPage };
