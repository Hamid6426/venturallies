// validationHelpers.js

export const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
};
