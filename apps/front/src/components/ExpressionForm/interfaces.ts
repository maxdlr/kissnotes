import { KissChangeEvent } from "@/types/form.types";
import {
  ExpressionSymbol,
  Id,
  LayerModel,
  PropertyModel,
  UserModel,
} from "@kissnotes/types";

type ExpressionFormData = {
  id?: Id;
  title: string;
  description: string;
  layer?: LayerModel;
  property?: PropertyModel;
  codeBlock: string;
  author?: UserModel;
  symbols?: ExpressionSymbol;
};

export interface ExpressionFormProps {
  handleOnChange: (e: KissChangeEvent<unknown>) => void;
  handleOnSubmit: (publish?: boolean) => void;
  formData: ExpressionFormData;
  published: boolean;
  className?: string;
}
