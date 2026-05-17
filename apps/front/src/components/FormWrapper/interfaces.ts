import type { KissFormErrors } from "@kissnotes/types";
import type { ButtonProps } from "@/components/Button/interfaces";

export interface FormWrapperProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  fieldsetClassName?: string;
  animated?: boolean;
  submit?: ButtonProps;
  cancel?: ButtonProps;
  animHeight?: number;
  loading?: boolean;
  errors?: KissFormErrors;
}
