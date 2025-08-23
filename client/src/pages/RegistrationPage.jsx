import { ChangeLanguageBtn } from "@/components/ui/buttons/changeLanguageBtn";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { Footer } from "@/components/footer/Footer";
import { BackgroundLayout } from "../layouts/BackgroundLayout";

import styles from "./RegistrationPage.module.css";

const RegistrationPage = () => {
  return (
    <BackgroundLayout>
      <div className={styles.languageBtnWrapper}>
        <ChangeLanguageBtn />
      </div>
      <div className={styles.registrationContentWrapper}>
        <div className={styles.registrationContainer}>
          <RegistrationForm />
        </div>
      </div>
      <Footer />
    </BackgroundLayout>
  );
};

export { RegistrationPage };
