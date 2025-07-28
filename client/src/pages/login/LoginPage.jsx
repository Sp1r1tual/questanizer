import { LoginForm } from "./components/LoginForm";
import { LoginImage } from "./components/LoginImage";
import { Footer } from "../../components/footer/Footer";

import styles from "./LoginPage.module.css";

const LoginPage = () => {
    return (
        <div className={styles.authPage}>
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

export { LoginPage };
