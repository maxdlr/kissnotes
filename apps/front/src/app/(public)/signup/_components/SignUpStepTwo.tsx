import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import type { SignUpStepProps } from "../page";

const SignUpStepTwo = ({
  loading,
  onNext,
  formData,
  onChange,
  errors,
}: SignUpStepProps) => {
  return (
    <FormWrapper
      title="Say something about yourself"
      submit={{ label: "Save", onClick: onNext }}
      className="mt-36 sm:w-sm sm:mx-auto"
      loading={loading}
      animated
      errors={errors}
    >
      <FormInput
        type="textarea"
        required
        label="Description"
        name="description"
        onChange={onChange}
        value={formData?.description}
        placeholder="My name is..."
      />
    </FormWrapper>
  );
};
export default SignUpStepTwo;
