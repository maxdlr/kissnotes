import { KissChangeEvent } from "@/types/form.types";
import { Model } from "@kissnotes/types";

export interface AdminEntityDetailsProps<T extends Model> {
  saved: boolean;
  onChange: (e: KissChangeEvent<T> | KissChangeEvent) => void;
  formData: T;
  recursive?: boolean;
  entity?: string;
}

export const stringInputs = [
  "title",
  "name",
  "label",
  "description",
  "email",
  "username",
];

export const dateInputs = ["createdAt", "updatedAt", "deletedAt"];

export const codeInputs = ["code"];
