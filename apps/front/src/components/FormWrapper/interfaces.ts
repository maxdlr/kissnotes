import type { ButtonProps } from "@/components/Button/interfaces";

export interface FormWrapperProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  submit?: ButtonProps;
  cancel?: ButtonProps;
  animHeight?: number;
  errors?: Record<string, string>;
}
