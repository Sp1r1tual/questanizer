import { PageContainer } from "@/components/ui/wrappers/PageContainer";
import { Card } from "@/components/ui/wrappers/Card";
import { Answers } from "@/components/support/Answers";
import { Feedback } from "../components/support/Feedback";

const SupportPage = () => {
  return (
    <PageContainer>
      <Card size="large">
        <Answers />
      </Card>
      <Card size="large">
        <Feedback />
      </Card>
    </PageContainer>
  );
};

export { SupportPage };
