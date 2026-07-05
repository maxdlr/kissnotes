import type { KissFormErrors } from "@kissnotes/types";
import type { ButtonProps } from "@/components/Button/interfaces";
import { ReactNode } from "react";

export interface FormWrapperProps {
  title?: string | ReactNode;
  children: ReactNode;
  className?: string;
  fieldsetClassName?: string;
  animated?: boolean;
  submit?: ButtonProps;
  cancel?: ButtonProps;
  animHeight?: number;
  loading?: boolean;
  errors?: KissFormErrors;
}
