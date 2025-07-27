import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AnswerItem } from "./AnswerItem";
import { fetchFaqs } from "../../../../store/support/faqThunks";
import { Loader } from "../../../../components/ui/Loader";

import styles from "./Answers.module.css";

const Answers = () => {
    const dispatch = useDispatch();

    const [openIndices, setOpenIndices] = useState([]);

    const { data: faqs, loading, error } = useSelector((state) => state.faq);

    useEffect(() => {
        if (!faqs.length) {
            dispatch(fetchFaqs());
        }
    }, [dispatch, faqs.length]);

    const toggleFAQ = (index) => {
        setOpenIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    if (error) return <p className={styles.status}>Error: {error}</p>;

    return (
        <div className={styles.answersPage}>
            <h1 className={styles.title}>Frequently asked questions</h1>
            <Loader visible={loading} />
            <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                    <AnswerItem
                        key={faq._id || index}
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

export { Answers };
