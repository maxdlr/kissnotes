"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";
import { getProfileHref } from "@/utils/userUtils";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referrer");
  const { signUp } = useAuth();
  const { addToast } = useToasts();
  const [formData, setFormData] = useState({
    email: "something@something.com",
    username: "something",
    password: "password",
  });

  const handleOnChange = ({ target: { name, value } }: KissChangeEvent) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: KissClickEvent) => {
    e?.preventDefault();
    setLoading(true);
    const error = await signUp(formData);
    if (error) {
      addToast({
        type: "error",
        title: error,
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    router.push(getProfileHref(formData.username));

    addToast({
      type: "success",
      title: `Welcome, ${formData.username}!`,
    });
  };

  return (
    <FormWrapper
      title="Sign Up"
      submit={{ label: "Sign Up", onClick: handleSubmit }}
      cancel={{ label: "Log in", onClick: () => router.push("/login") }}
      className="mt-36 w-sm mx-auto"
      loading={loading}
    >
      <FormInput
        required
        label="Email"
        name="email"
        onChange={handleOnChange}
        value={formData?.email}
        placeholder="bruce@wayne.batcave"
      />
      <FormInput
        required
        label="Username"
        name="username"
        onChange={handleOnChange}
        value={formData?.username}
        placeholder="batman"
      />
      <FormInput
        required
        label="Password"
        name="password"
        placeholder="imbatman"
        value={formData?.password}
        onChange={handleOnChange}
        type="password"
      />
    </FormWrapper>
  );
};
export default SignUpPage;
