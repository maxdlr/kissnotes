"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";

const LogIn = () => {
  const searchParams = useSearchParams();

  const referrer = searchParams.get("referrer");

  const { addToast } = useToasts();
  const { user, logIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "maxdlr",
    password: "password",
  });

  const router = useRouter();
  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect when the user changes, not when the router changes
  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  const handleOnchange = ({ target: { name, value } }: KissChangeEvent) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: KissClickEvent) => {
    e?.preventDefault();
    setLoading(true);
    await logIn(formData);
    setLoading(false);
    addToast({
      type: "success",
      title: "Logged in",
      message: `Welcome back, ${formData.username}!`,
    });
    router.push(referrer || "/");
  };

  const cannotSubmit = !Object.values(formData).every(Boolean);

  return (
    <FormWrapper
      title="Login"
      submit={{
        disabled: cannotSubmit,
        onClick: handleSubmit,
        label: "Get in",
      }}
      cancel={{
        onClick: () => router.push("/signup"),
        label: "SignUp",
      }}
      className="mt-36 sm:w-sm sm:mx-auto"
      fieldsetClassName="space-y-4 sm:space-y-8"
      animated
      loading={loading}
    >
      <FormInput
        required
        name="username"
        placeholder="batman"
        value={formData?.username}
        onChange={handleOnchange}
      />
      <FormInput
        required
        name="password"
        placeholder="imbatman"
        value={formData?.password}
        onChange={handleOnchange}
        type="password"
      />
    </FormWrapper>
  );
};

const LogInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogIn />
    </Suspense>
  );
};

export default LogInPage;
