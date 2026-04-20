import type { ButtonProps } from "../Button/interfaces";

export interface FormWrapperProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  submit?: ButtonProps;
  animHeight?: number;
  errors?: Record<string, string>;
}
