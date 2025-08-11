import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { ContainerMedium } from "@/components/ui/wrappers/ContainerMedium";
import { Answers } from "@/components/faq/Answers";

import backgroundImg from "@/assets/support-background.png";

import styles from "./AnswersPage.module.css";

const AnswersPage = () => {
    return (
        <div
            className={styles.supportWrapper}
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <Wrapper>
                <Dashboard>
                    <ContainerMedium>
                        <Answers />
                    </ContainerMedium>
                </Dashboard>
            </Wrapper>
        </div>
    );
};

export { AnswersPage };
