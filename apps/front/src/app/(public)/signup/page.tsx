"use client";

import { faker } from "@faker-js/faker";
import type {
  KissFormErrors,
  SocialLinkModel,
  UserModel,
} from "@kissnotes/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import useAxios from "@/hooks/useAxios";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";
import { getProfileHref } from "@/utils/userUtils";
import SignUpStepThree from "./_components/SignUpStepThree";
import SignUpStepTwo from "./_components/SignUpStepTwo";
import SignUpStepOne from "./_components/SignupStepOne";

export type SignUpPayload = {
  email: string;
  username: string;
  password: string;
  description: string;
  socials: SocialLinkModel[];
};

export interface SignUpStepProps {
  loading?: boolean;
  onNext?: (e?: KissClickEvent) => void;
  onChange: (e: KissChangeEvent<SocialLinkModel[] | string | null>) => void;
  formData?: SignUpPayload;
  errors?: KissFormErrors;
}

const SignUpPage = () => {
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<KissFormErrors>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referrer");
  const { signUp } = useAuth();
  const { addToast } = useToasts();

  const { putData: updateUser } = useAxios("users/edit");
  const { putData: addSocials } = useAxios("social-links/edit");

  const [formData, setFormData] = useState<SignUpPayload>({
    email: `${faker.lorem.word()}@${faker.lorem.word()}.${faker.lorem.word()}`,
    username: faker.lorem.word(),
    password: "P@ssword1234",
    description: faker.lorem.paragraph(6),
    socials: [] as SocialLinkModel[],
  });

  const handleOnChange = ({
    target: { name, value },
  }: KissChangeEvent<string | SocialLinkModel[] | SocialLinkModel | null>) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmitStepOne = async (e: KissClickEvent) => {
    e?.preventDefault();
    setLoading(true);
    const error = await signUp({
      email: formData.email,
      username: formData.username,
      password: formData.password,
    });

    if (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        addToast({ type: "error", title: error.message });
      }
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep(2);
    addToast({
      type: "success",
      title: `Welcome, ${formData.username}!`,
    });
  };

  const handleSubmitStepTwo = async (e: KissClickEvent) => {
    e?.preventDefault();
    setLoading(true);

    const { data, error } = await updateUser<UserModel>({
      description: formData.description,
    });

    if (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        addToast({ type: "error", title: error.message });
      }
    }
    if (data) {
      setStep(3);
      addToast({
        type: "success",
        title: "Description enregistrée",
      });
    }
    setLoading(false);
  };

  const handleSubmitStepThree = async (e: KissClickEvent) => {
    e?.preventDefault();
    setLoading(true);

    const { data, error } = await addSocials<SocialLinkModel>({
      socials: formData.socials,
    });

    if (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        addToast({ type: "error", title: error.message });
      }
    }
    if (data) {
      router.push(referrer || getProfileHref(formData.username));
      addToast({
        type: "success",
        title: "Liens enregistrés",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {step === 1 && (
        <SignUpStepOne
          errors={errors}
          loading={loading}
          onNext={handleSubmitStepOne}
          onChange={handleOnChange}
          formData={formData}
        />
      )}
      {step === 2 && (
        <SignUpStepTwo
          errors={errors}
          loading={loading}
          onNext={handleSubmitStepTwo}
          onChange={handleOnChange}
          formData={formData}
        />
      )}
      {step === 3 && (
        <SignUpStepThree
          errors={errors}
          loading={loading}
          onNext={handleSubmitStepThree}
          onChange={handleOnChange}
        />
      )}
    </>
  );
};
export default SignUpPage;
