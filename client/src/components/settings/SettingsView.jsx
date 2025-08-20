import { useTranslation } from "react-i18next";

import { Modal } from "../ui/modals/Modal";
import { SettingsList } from "./SettingsList";

const SettingsView = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{t("settings.settingsHeader")}</h2>
      <SettingsList />
    </Modal>
  );
};

export { SettingsView };
