import { useState } from "react";

import AnswerItem from "./AnswerItem";
import faqs from "../../data/faqs";

import styles from "./Answers.module.css";

const Answers = () => {
    const [openIndices, setOpenIndices] = useState([]);

    const toggleFAQ = (index) => {
        setOpenIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className={styles.answersPage}>
            <h1 className={styles.title}>Часті запитання</h1>
            <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                    <AnswerItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndices.includes(index)}
                        onToggle={() => toggleFAQ(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Answers;
