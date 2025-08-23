import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { Container } from "@/components/ui/wrappers/Container";
import { Answers } from "@/components/support/Answers";
import { Feedback } from "../components/support/Feedback";
import { BackgroundLayout } from "../layouts/BackgroundLayout";

const SupportPage = () => {
  return (
    <BackgroundLayout>
      <Wrapper>
        <Dashboard>
          <Container>
            <Answers />
          </Container>
          <Container>
            <Feedback />
          </Container>
        </Dashboard>
      </Wrapper>
    </BackgroundLayout>
  );
};

export { SupportPage };
