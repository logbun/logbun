export const errorMessage = (error: unknown) => {
  const { message } = error as Error;
  return message ?? 'An error occurred. Please try again';
};

export const find = <T, P>(items: T[], method: [keyof T, P]) => {
  const [key, search] = method;
  return items.find((item) => item[key] === search);
};
