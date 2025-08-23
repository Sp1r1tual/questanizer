import { BackgroundLayout } from "../layouts/BackgroundLayout";
import { LoginView } from "../components/auth/login/LoginView";

const LoginPage = () => {
  return (
    <BackgroundLayout>
      <LoginView />
    </BackgroundLayout>
  );
};

export { LoginPage };
