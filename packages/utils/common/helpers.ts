import { customAlphabet } from 'nanoid';

export const errorMessage = (error: unknown) => {
  const { message } = error as Error;
  return message ?? 'An error occurred. Please try again';
};

export const find = <T, P>(items: T[], method: [keyof T, P]) => {
  const [key, search] = method;
  return items.find((item) => item[key] === search);
};

export const shortid = (number = 18) => {
  return customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', number);
};

export const isValidHttpUrl = (url: string) => {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};
