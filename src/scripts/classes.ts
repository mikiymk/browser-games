export const classes = (...classes: readonly (string | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
