import { AbstractEntity } from "@/entities/AbstractEntity";
import { validateOrReject, ValidationError } from "class-validator";

const validateCrudPayload = async (
  entity: AbstractEntity,
  extraErrors: ValidationError[] = [],
  options?: { property: string },
): Promise<void> => {
  const entityErrors: ValidationError[] =
    (await validateOrReject(entity).catch((err: ValidationError[]) => err)) ??
    [];

  const allErrors = [
    ...(Array.isArray(entityErrors) ? entityErrors : []),
    ...extraErrors,
  ];

  if (allErrors.length) {
    const errors: TValidationError["validation"] = allErrors.map((e) => ({
      property: options?.property || e.property,
      messages: e.constraints ? Object.values(e.constraints) : [],
    }));
    throw BadValidation(errors);
  }
};
export default validateCrudPayload;
