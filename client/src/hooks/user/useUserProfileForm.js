import { useState } from "react";
import { useDispatch } from "react-redux";

import {
    validateUsername,
    validateBio,
    ERROR_MESSAGES,
} from "../../utils/validation/validationForm";
import {
    updateUserProfile,
    fetchUserProfile,
} from "../../store/user/userThunks";

import defaultUserAvatarIcon from "../../assets/avatar-people-user-svgrepo-com.png";
import getAvatarUrl from "../../utils/user/getAvatarUrl";

const useUserProfileForm = (user, onSave) => {
    const dispatch = useDispatch();

    const [name, setName] = useState(user.name || "");
    const [bio, setBio] = useState(user.bio || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        user.photoUrl ? getAvatarUrl(user.photoUrl) : defaultUserAvatarIcon
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [nameError, setNameError] = useState("");
    const [bioError, setBioError] = useState("");

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Image size must be less than 2MB");
                return;
            }

            setAvatarFile(file);
            setError("");

            const reader = new FileReader();

            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setNameError("");
        setBioError("");

        const trimmedName = name.trim();
        const trimmedBio = bio.trim();

        let hasError = false;

        if (!validateUsername(trimmedName)) {
            setNameError(ERROR_MESSAGES.invalidUsername);
            hasError = true;
        }

        if (!validateBio(trimmedBio)) {
            setBioError(ERROR_MESSAGES.invalidBio);
            hasError = true;
        }

        if (hasError) return;

        setIsSubmitting(true);

        let formData;

        if (avatarFile) {
            formData = new FormData();
            formData.append("username", trimmedName);
            formData.append("bio", trimmedBio);
            formData.append("photo", avatarFile);
        } else {
            formData = { username: trimmedName, bio: trimmedBio };
        }

        try {
            await dispatch(updateUserProfile(formData)).unwrap();
            await dispatch(fetchUserProfile());
            onSave();
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onNameChange = (event) => {
        setName(event.target.value);

        if (nameError) setNameError("");
    };

    const onBioChange = (event) => {
        setBio(event.target.value);

        if (bioError) setBioError("");
    };

    return {
        name,
        setName,
        bio,
        setBio,
        onNameChange,
        onBioChange,
        avatarPreview,
        handleAvatarChange,
        handleSubmit,
        isSubmitting,
        error,
        nameError,
        bioError,
    };
};

export default useUserProfileForm;
