import { ChangeLanguageBtn } from "@/components/ui/buttons/changeLanguageBtn";
import { RegistrationForm } from "./RegistrationForm";
import { Footer } from "@/components/footer/Footer";

import styles from "./RegistrationView.module.css";

const RegistrationView = () => {
  return (
    <div className={styles.registrationPage}>
      <div className={styles.languageBtnWrapper}>
        <ChangeLanguageBtn />
      </div>
      <div className={styles.registrationContentWrapper}>
        <div className={styles.registrationContainer}>
          <RegistrationForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { RegistrationView };
