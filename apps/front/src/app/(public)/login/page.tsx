"use client";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import useForm from "@/components/FormWrapper/hooks/useForm";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";
import { BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const LogIn = () => {
  const searchParam = useSearchParams();
  const referrer = searchParam.get("referrer");

  const { addToast } = useToasts();
  const { errors, setErrors } = useForm();

  const { user, logIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();
  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect when the user changes, not when the router changes
  useEffect(() => {
    if (user && !referrer) router.push("/");
  }, [user]);

  const handleOnchange = ({ target: { name, value } }: KissChangeEvent) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: KissClickEvent) => {
    e?.preventDefault();
    setLoading(true);
    await logIn(formData).then((r) => {
      if (r?.errors || r?.error) {
        setErrors(r?.errors);
        addToast({
          type: "error",
          title: "Something went wrong",
          message:
            r.error?.message || "Please check your credentials and try again.",
        });
        return;
      }
      addToast({
        type: "success",
        title: "Logged in",
        message: `Welcome back, ${formData.username}!`,
      });
      router.push(referrer || "/");
    });
    setLoading(false);
  };

  const cannotSubmit = !Object.values(formData).every(Boolean);

  return (
    <FormWrapper
      errors={errors}
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
        StartChild={<BoltIcon className="size-6" />}
        label="Username"
        required
        name="username"
        placeholder="batman"
        value={formData?.username}
        onChange={handleOnchange}
      />
      <FormInput
        StartChild={<ShieldCheckIcon className="size-6" />}
        label="Password"
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
