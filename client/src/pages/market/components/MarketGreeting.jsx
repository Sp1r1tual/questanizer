import { useEffect, useState } from "react";

import { GREETINGS } from "../../../data/greetings";

import styles from "./MarketGreeting.module.css";

const MarketGreeting = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const shouldShow = Math.random() < 0.5;

        if (shouldShow) {
            const randomMsg =
                GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

            setMessage(randomMsg);
        }
    }, []);

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;

    return <div className={styles.greeting}>{message}</div>;
};

export { MarketGreeting };
