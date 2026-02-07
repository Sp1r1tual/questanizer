import { ChangeLanguageBtn } from "@/components/ui/buttons/ChangeLangBtn";
import { LoginImage } from "./LoginImage";
import { LoginForm } from "./LoginForm";
import { Footer } from "@/components/footer/Footer";
import { Card } from "@/components/ui/wrappers/Card";

import styles from "./LoginView.module.css";

const LoginView = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.languageBtnWrapper}>
        <ChangeLanguageBtn />
      </div>
      <div className={styles.authContentWrapper}>
        <Card size="large" className={styles.authCard}>
          <LoginImage />
          <LoginForm />
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export { LoginView };
