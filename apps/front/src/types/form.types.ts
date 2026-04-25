export type FormChangeEvent<T = string> = {
  target: { name: string; value: T };
};
