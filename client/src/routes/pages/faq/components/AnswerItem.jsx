import styles from "./AnswerItem.module.css";

const AnswerItem = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className={styles.faqItem}>
            <div className={styles.faqQuestion} onClick={onToggle}>
                <span>{question}</span>
                <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
            </div>
            <div
                className={`${styles.faqAnswerWrapper} ${
                    isOpen ? styles.open : ""
                }`}
            >
                <div className={styles.faqAnswer}>{answer}</div>
            </div>
        </div>
    );
};

export default AnswerItem;
