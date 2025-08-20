import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal } from "../ui/modals/Modal";

import { resetBoss } from "@/store/boss/bossBattleSlice";

import { resetStats } from "@/store/stats/userStatsThunks";

import styles from "./DefeatUserView.module.css";

const DefeatUserView = ({ isOpen, onRestart }) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleRestart = async () => {
    await dispatch(resetStats()).unwrap();
    dispatch(resetBoss());
    onRestart();
  };

  return (
    <Modal isOpen={isOpen} size="medium" closeBtn={false}>
      <h2>{t("defeat.title")}</h2>
      <p>{t("defeat.message")}</p>
      <button onClick={handleRestart} className={styles.button}>
        {t("defeat.restartButton")}
      </button>
    </Modal>
  );
};

export { DefeatUserView };
