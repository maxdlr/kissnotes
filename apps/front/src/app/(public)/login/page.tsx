"use client";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import { mutate } from "swr";
import { FormInput } from "@/components/FormInput";
import { FormWrapper } from "@/components/FormWrapper";
import useAuth from "@/hooks/AuthProvider";
import useAxios from "@/hooks/useAxios";

const logIn = () => {
  const { postData, loading } = useAxios("/login");
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "caca",
  });

  const router = useRouter();
  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect when the user changes, not when the router changes
  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  const handleOnchange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    await postData(formData);
    await mutate({ url: "/me" });
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
      }}
      className="h-full w-full mt-36"
      animated
    >
      <FormInput
        name="username"
        placeholder="batman"
        value={formData?.username}
        onChange={handleOnchange}
      />
      <FormInput
        password
        name="password"
        placeholder="imbatman"
        value={formData?.password}
        onChange={handleOnchange}
      />
    </FormWrapper>
  );
};

export default logIn;
