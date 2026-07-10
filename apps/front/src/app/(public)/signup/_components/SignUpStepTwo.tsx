import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import type { SignUpStepProps } from "../page";
import useFocus from "@/hooks/bread/useFocus";
import { useEffect, useState } from "react";
import { KissChangeEvent } from "@/types/form.types";
import { KissFormErrors } from "@kissnotes/types";

const TOO_LONG_MESSAGE = "This description is too long.";

const SignUpStepTwo = ({
  loading,
  onNext,
  formData,
  onChange,
  errors,
}: SignUpStepProps) => {
  const { ref, focus } = useFocus<HTMLTextAreaElement>();
  const [valueCount, setValueCount] = useState<number>(0);

  const valueMax = 2000;

  useEffect(() => {
    window.addEventListener("load", () => focus?.());
  }, [focus]);

  const handleChange = (e: KissChangeEvent<string>) => {
    setValueCount(e.target.value.length);
    onChange?.(e);
  };

  const localErrors: KissFormErrors = [
    ...(errors || []).filter((e) => !e.messages.includes(TOO_LONG_MESSAGE)),
    ...(valueCount > valueMax
      ? [{ property: "description", messages: [TOO_LONG_MESSAGE] }]
      : []),
  ];

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
