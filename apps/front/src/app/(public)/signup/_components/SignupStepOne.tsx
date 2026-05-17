import router from "next/router";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import type { SignUpStepProps } from "../page";

const SignUpStepOne = ({
  loading,
  onNext,
  formData,
  onChange,
  errors,
}: SignUpStepProps) => {
  return (
    <FormWrapper
      title="Sign Up"
      submit={{ label: "Sign Up", onClick: onNext }}
      cancel={{ label: "Log in", onClick: () => router.push("/login") }}
      className="mt-36 w-sm mx-auto"
      loading={loading}
      fieldsetClassName="space-y-8"
      animated
      errors={errors}
    >
      <FormInput
        required
        label="Email"
        name="email"
        onChange={onChange}
        value={formData?.email}
        placeholder="bruce@wayne.batcave"
      />
      <FormInput
        required
        label="Username"
        name="username"
        onChange={onChange}
        value={formData?.username}
        placeholder="batman"
      />
      <FormInput
        required
        label="Password"
        name="password"
        placeholder="imbatman"
        value={formData?.password}
        onChange={onChange}
        type="password"
      />
    </FormWrapper>
  );
};
export default SignUpStepOne;
