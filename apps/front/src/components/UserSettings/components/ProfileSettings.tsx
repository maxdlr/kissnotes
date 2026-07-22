"use client";
import SettingsSection from "@/app/[handle]/(protected)/settings/_components/SettingsSection";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import useForm from "@/components/FormWrapper/hooks/useForm";
import Loading from "@/components/Loading";
import useSearcher from "@/components/Searcher/hooks/SearcherProvider";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import useAxios from "@/hooks/useAxios";
import { KissChangeEvent } from "@/types/form.types";
import { getProfileHref } from "@/utils/userUtils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileSettingsFormData } from "../interfaces";

const ProfileSettings = () => {
  const { user, loading: userLoading, logOut, refreshMe } = useAuth();
  const { isOpen } = useSearcher();
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<ProfileSettingsFormData>();
  const router = useRouter();
  const { errors, setErrors } = useForm();
  const [loading, setLoading] = useState(false);

  const { putData: updateUser } = useAxios("users/edit");

  useEffect(() => {
    if (!userLoading && user) {
      // Seeds the local edit form from the user once it has loaded; this is
      // a one-time sync from async data, not a derived-state duplication.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        username: user.username,
        email: user.email,
        description: user.description || "",
      });
    }
  }, [user, userLoading]);

  const handleLogout = async () => {
    setLoading(true);
    await logOut();
    addToast({
      type: "success",
      title: "Logged out",
      message: "You have been logged out successfully.",
    });
    setLoading(false);
  };

  if (!user) {
    return <Loading />;
  }

  const handleOnchange = ({ target: { name, value } }: KissChangeEvent) => {
    setFormData((f) => ({ ...f, [name]: value }) as ProfileSettingsFormData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await updateUser(formData);

    if (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        addToast({ type: "error", title: error.message });
      }
    }

    if (data) {
      setIsEdit(false);
      await refreshMe();
      router.push(`${getProfileHref(formData?.username as string)}/settings`);
      addToast({
        type: "success",
        title: "Profile updated",
      });
    }

    setLoading(false);
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={`sm:max-w-200 w-full h-fit sm:max-h-125 rounded-4xl p-4 sm:p-8`}
      >
        <div className="flex justify-end items-center">
          <Button
            className="ms-auto"
            label="Logout"
            onClick={handleLogout}
            disabled={loading}
            danger
            shortcut={{ keys: ["cmd", "shift", "ESC"] }}
            variant="outline-accent"
            size="sm"
          />
        </div>
        <SettingsSection
          title="Profile"
          subtitle="Personal information"
          className="pt-8"
          action={{
            shortcut: { keys: ["cmd", "E"], blockers: [isOpen] },
            onClick: () => setIsEdit((v) => !v),
            label: "Edit",
            Icon: PencilIcon,
          }}
        >
          <FormWrapper
            errors={errors}
            className="py-8"
            fieldsetClassName="grid grid-cols-1 sm:grid-cols-2 flex gap-4"
            submit={
              isEdit
                ? {
                    label: "Save",
                    onClick: handleSubmit,
                    loading,
                    shortcut: { keys: ["Enter"] },
                  }
                : undefined
            }
          >
            <FormInput
              name="username"
              label="Username"
              value={formData?.username}
              placeholder="batman"
              onChange={handleOnchange}
              variant={isEdit ? "outline" : "ghost"}
              disabled={!isEdit}
              containerClassName="border-dashed!"
              required
            />
            <FormInput
              type="email"
              name="email"
              label="Email"
              value={formData?.email}
              placeholder="batman@batcave.gc"
              onChange={handleOnchange}
              variant={isEdit ? "outline" : "ghost"}
              disabled={!isEdit}
              containerClassName="border-dashed!"
              required
            />
            <FormInput
              type="textarea"
              name="description"
              label="Description"
              value={formData?.description}
              placeholder="Your description"
              onChange={handleOnchange}
              variant={isEdit ? "outline" : "ghost"}
              disabled={!isEdit}
              containerClassName="border-dashed!"
              className="col-span-1 sm:col-span-2 h-fit"
              required
            />
          </FormWrapper>
        </SettingsSection>
      </div>
    </div>
  );
};
export default ProfileSettings;
