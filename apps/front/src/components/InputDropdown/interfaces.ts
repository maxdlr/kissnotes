import { KissChangeEvent } from "@/types/form.types";
import { ReactNode } from "react";

export interface FormDropdownProps<T> {
  label?: string | ReactNode;
  name?: string;
  required?: boolean;
  placeholder?: string | ReactNode;
  className?: string;
  property?: keyof T;
  options?: T[];
  value?: T;
  disabled?: boolean;
  onChange?: (e: KissChangeEvent<T>) => void;
}
