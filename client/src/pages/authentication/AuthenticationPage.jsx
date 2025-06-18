import AuthForm from "./AuthForm";
import LoginImage from "./LoginImage";
import Footer from "../../components/layout/Footer";

import styles from "./AuthenticationPage.module.css";

const AuthenticationPage = () => {
    return (
        <div className={styles.authPage}>
            <div className={styles.authContentWrapper}>
                <div className={styles.authContainer}>
                    <LoginImage />
                    <AuthForm />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AuthenticationPage;
