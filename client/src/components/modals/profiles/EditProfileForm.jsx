import { useUserProfileForm } from "../../../hooks/user/useUserProfileForm";

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

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.avatarSection}>
                <img
                    src={avatarPreview}
                    alt="User avatar preview"
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
                    Change Avatar
                </button>

                <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className={styles.avatarInput}
                    aria-label="Upload new avatar"
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>
                    Name:
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    className={`${styles.input} ${
                        nameError ? styles.inputError : ""
                    }`}
                    placeholder="Enter your name"
                    maxLength={50}
                    aria-required="true"
                    disabled={isSubmitting}
                />
                {nameError && <p className={styles.error}>{nameError}</p>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="bio" className={styles.label}>
                    Bio:
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={onBioChange}
                    className={`${styles.textarea} ${
                        bioError ? styles.inputError : ""
                    }`}
                    placeholder="Tell us about yourself"
                    rows={4}
                    maxLength={500}
                    aria-describedby="bio-hint"
                    disabled={isSubmitting}
                />
                {bioError && <p className={styles.error}>{bioError}</p>}
                <small id="bio-hint" className={styles.hint}>
                    {bio.length}/500 characters
                </small>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.submitBtn}
                    aria-label="Save profile changes"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={onCancel}
                    aria-label="Cancel editing"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export { EditProfileForm };
