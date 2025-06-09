import headerImg from "../../assets/questanizer_header.png";

import styles from "./OrganizerHeader.module.css";

const TaskHeader = () => {
    return (
        <h2 className={styles.h2}>
            <img className={styles.mainImg} src={headerImg} alt="img" />
            What epic journey begins now?
        </h2>
    );
};

export default TaskHeader;
