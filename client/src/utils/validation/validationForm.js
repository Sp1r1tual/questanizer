const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePassword = (value) =>
    value.length >= 8 &&
    value.length <= 32 &&
    /[A-Z]/.test(value) &&
    /^[A-Za-z0-9!@#$%^&*()_+\-=]+$/.test(value);

const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
};

const validateUsername = (value) =>
    typeof value === "string" &&
    value.length >= 3 &&
    value.length <= 32 &&
    /^[a-zA-Z0-9_.-]+$/.test(value);

const validateBio = (value) => typeof value === "string" && value.length <= 500;

const ERROR_MESSAGES = {
    fillAllFields: "Please fill out all fields.",
    invalidEmail: "Invalid email format.",
    invalidPassword:
        "Password must be 8-32 characters, include an uppercase letter, and be in Latin",
    passwordMismatch: "Passwords do not match.",
    invalidUsername:
        "Username must be 3-32 characters and contain only Latin letters, numbers, dashes, periods, or underscores.",
    invalidBio: "Bio must not exceed 500 characters.",
};

export {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateUsername,
    validateBio,
    ERROR_MESSAGES,
};
