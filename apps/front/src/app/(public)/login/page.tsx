"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { mutate } from "swr";
import { FormInput } from "@/components/FormInput";
import { FormWrapper } from "@/components/FormWrapper";
import useAuth from "@/hooks/AuthProvider";
import useAxios from "@/hooks/useAxios";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";

const LogIn = () => {
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referrer");

  const { postData, loading } = useAxios("/login");
  const { user } = useAuth();
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
    await postData(formData);
    await mutate({ url: "/me" });
    router.push(referrer || "/");
  };

  const cannotSubmit = !Object.values(formData).every(Boolean);

  return (
    <FormWrapper
      title="Login"
      submit={{
        disabled: cannotSubmit,
        onClick: handleSubmit,
        type: "submit",
        label: "Get in",
        loading,
        variant: cannotSubmit ? "outline" : "fill",
        className: "justify-center",
      }}
      className="mt-36 w-sm mx-auto"
      animated
    >
      <FormInput
        name="username"
        placeholder="batman"
        value={formData?.username}
        onChange={handleOnchange}
      />
      <FormInput
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
