import { ChangeLanguageBtn } from "@/components/ui/buttons/changeLanguageBtn";
import { LoginImage } from "@/components/login/LoginImage";
import { LoginForm } from "@/components/login/LoginForm";
import { Footer } from "@/components/footer/Footer";

import backgroundImg from "@/assets/login-background.png";

import styles from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <div className={styles.loginWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
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
    </div>
  );
};

export { LoginPage };
