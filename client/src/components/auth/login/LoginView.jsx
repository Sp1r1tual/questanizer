import { ChangeLanguageBtn } from "@/components/ui/buttons/ChangeLangBtn";
import { LoginImage } from "./LoginImage";
import { LoginForm } from "./LoginForm";
import { Footer } from "@/components/footer/Footer";

import styles from "./LoginView.module.css";

const LoginView = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.languageBtnWrapper}>
        <ChangeLanguageBtn />
      </div>
      <div className={styles.authContentWrapper}>
        <div className={styles.authContainer}>
          <LoginImage />
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { LoginView };
