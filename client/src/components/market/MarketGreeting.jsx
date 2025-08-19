import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { greetings } from "@/data/greetings";

import styles from "./MarketGreeting.module.css";

const MarketGreeting = () => {
  const [message, setMessage] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const shouldShow = Math.random() < 0.5;

    if (shouldShow) {
      const randomMsg = greetings[Math.floor(Math.random() * greetings.length)];

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

  return <div className={styles.greeting}>{t(message)}</div>;
};

export { MarketGreeting };
