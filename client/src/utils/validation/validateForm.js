const errorMessages = {
  fillAllFields: "validation.fillAllFields",
  invalidEmail: "validation.invalidEmail",
  invalidPassword: "validation.invalidPassword",
  passwordMismatch: "validation.passwordMismatch",
  invalidUsername: "validation.invalidUsername",
  invalidBio: "validation.invalidBio",
};

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

export {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateUsername,
  validateBio,
  errorMessages,
};
