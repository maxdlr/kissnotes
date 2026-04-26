export type KissChangeEvent<T = string> = {
  target: { name: string; value: T };
};

export type KissClickEvent =
  | KeyboardEvent
  | MouseEvent
  | undefined
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  | React.KeyboardEvent<HTMLButtonElement>;
