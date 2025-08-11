import { useTranslation } from "react-i18next";

import { useUserProfileForm } from "@/hooks/user/useUserProfileForm";

import styles from "./EditProfileForm.module.css";

const EditProfileForm = ({ onCancel, onSave }) => {
    const {
        name,
        bio,
        onNameChange,
        onBioChange,
        avatarPreview,
        handleAvatarChange,
        handleSubmit,
        isSubmitting,
        nameError,
        bioError,
        error,
    } = useUserProfileForm(onSave);

    const { t } = useTranslation();

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.avatarSection}>
                <img
                    src={avatarPreview}
                    alt="avatar"
                    className={styles.avatar}
                    loading="lazy"
                />

                <button
                    type="button"
                    className={styles.changeAvatarBtn}
                    onClick={() =>
                        document.getElementById("avatarInput").click()
                    }
                >
                    {t("profile.changeAvatar")}
                </button>

                <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className={styles.avatarInput}
                    aria-label={t("profile.changeAvatar")}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>
                    {t("shared.nameLabel")}
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    className={`${styles.input} ${
                        nameError ? styles.inputError : ""
                    }`}
                    placeholder={t("profile.namePlaceholder")}
                    maxLength={50}
                    aria-required="true"
                    disabled={isSubmitting}
                />
                {nameError && <p className={styles.error}>{nameError}</p>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="bio" className={styles.label}>
                    {t("shared.bio")}
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={onBioChange}
                    className={`${styles.textarea} ${
                        bioError ? styles.inputError : ""
                    }`}
                    placeholder={t("profile.bioPlaceholder")}
                    rows={4}
                    maxLength={500}
                    aria-describedby="bio-hint"
                    disabled={isSubmitting}
                />
                {bioError && <p className={styles.error}>{bioError}</p>}
                <small id="bio-hint" className={styles.hint}>
                    {bio.length}/500 {t("profile.characters")}
                </small>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.submitBtn}
                    aria-label={t("shared.save")}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t("shared.saving") : t("shared.save")}
                </button>
                <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={onCancel}
                    aria-label={t("shared.cancel")}
                    disabled={isSubmitting}
                >
                    {t("shared.cancel")}
                </button>
            </div>
        </form>
    );
};

export { EditProfileForm };
