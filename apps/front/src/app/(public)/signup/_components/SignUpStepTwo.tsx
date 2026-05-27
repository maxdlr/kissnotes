import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import type { SignUpStepProps } from "../page";
import { faker } from "@faker-js/faker";
import useFocus from "@/hooks/bread/useFocus";
import { useEffect, useState } from "react";
import { KissChangeEvent } from "@/types/form.types";
import { KissFormErrors } from "@kissnotes/types";

const SignUpStepTwo = ({
  loading,
  onNext,
  formData,
  onChange,
  errors,
}: SignUpStepProps) => {
  const { ref, focus } = useFocus<HTMLTextAreaElement>();
  const [valueCount, setValueCount] = useState<number>(0);
  const [localErrors, setLocalErrors] = useState<KissFormErrors>(errors || []);

  const valueMax = 2000;

  useEffect(() => {
    window.addEventListener("load", () => focus?.());
  }, [focus]);

  const handleChange = (e: KissChangeEvent<string>) => {
    setValueCount(e.target.value.length);
    onChange?.(e);
  };

  useEffect(() => {
    const message = "This description is too long.";

    if (
      valueCount > 2000 &&
      !localErrors?.find((e) => e.messages.includes(message))
    ) {
      setLocalErrors((e) => [
        ...(e || []),
        {
          property: "description",
          messages: [message],
        },
      ]);
    }

    if (
      valueCount <= valueMax &&
      localErrors?.find((e) => e.messages.includes(message))
    ) {
      setLocalErrors((e) => [
        ...(e || []).filter((err) => !err.messages.includes(message)),
      ]);
    }
  }, [localErrors, valueCount]);

  return (
    <FormWrapper
      title="Say something about yourself"
      submit={{
        label: "Save",
        onClick: onNext,
        disabled: !!localErrors?.length,
      }}
      className="mt-36 sm:w-sm sm:mx-auto"
      loading={loading}
      animated
      errors={localErrors}
    >
      <FormInput
        ref={ref}
        type="textarea"
        required
        label="Description"
        name="description"
        onChange={handleChange}
        value={formData?.description}
        placeholder="My name is..."
        className=""
      />
      <div
        className={`font-semibold py-2 text-end ${valueCount > valueMax ? "text-danger" : "text-accent"}`}
      >
        {valueCount} / {valueMax}
      </div>
    </FormWrapper>
  );
};
export default SignUpStepTwo;
