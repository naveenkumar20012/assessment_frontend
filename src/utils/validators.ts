export const validateEmail = (email: string) => {
  return Boolean(email.match(/\S+@\S+\.\S+/));
};
