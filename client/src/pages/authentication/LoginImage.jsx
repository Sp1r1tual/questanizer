import questanizerLoginImg from "../../assets/questanizer_login.png";

import styles from "./LoginImage.module.css";

const LoginImage = () => {
    return (
        <div className={styles.imageContainer}>
            <img
                className={styles.mainImg}
                src={questanizerLoginImg}
                alt="Questanizer login scene"
            />
        </div>
    );
};

export default LoginImage;
