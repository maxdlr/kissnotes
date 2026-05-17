import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import type { SignUpStepProps } from "../page";
import {
  AtSymbolIcon,
  BoldIcon,
  BoltIcon,
  ServerStackIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Button";
import { faker } from "@faker-js/faker";

const SignUpStepOne = ({
  loading,
  onNext,
  formData,
  onChange,
  errors,
}: SignUpStepProps) => {
  const router = useRouter();

  const handleGenerate = () => {
    onChange({
      target: {
        name: "username",
        value: faker.internet.displayName().toLocaleLowerCase(),
      },
    });
  };

  return (
    <FormWrapper
      title="Sign Up"
      submit={{ label: "Sign Up", onClick: onNext }}
      cancel={{ label: "Log in", onClick: () => router.push("/login") }}
      className="mt-36 sm:w-sm sm:mx-auto"
      loading={loading}
      fieldsetClassName="space-y-8"
      animated
      errors={errors}
    >
      <FormInput
        StartChild={<AtSymbolIcon className="size-6" />}
        required
        type="email"
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
        StartChild={<BoltIcon className="size-6" />}
        EndChild={
          <Button label="Generate" size="sm" onClick={handleGenerate} />
        }
      />
      <FormInput
        StartChild={<ShieldCheckIcon className="size-6" />}
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
