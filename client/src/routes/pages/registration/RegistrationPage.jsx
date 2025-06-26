import RegistrationForm from "./components/RegistrationForm";
import Footer from "../../../components/footer/Footer";

import styles from "./RegistrationPage.module.css";

const RegistrationPage = () => {
    return (
        <div className={styles.registrationPage}>
            <div className={styles.registrationContentWrapper}>
                <div className={styles.registrationContainer}>
                    <RegistrationForm />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegistrationPage;
