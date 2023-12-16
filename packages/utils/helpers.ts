export const errorMessage = (error: unknown) => {
  const { message } = error as Error;
  return message ?? 'An error occurred. Please try again';
};
