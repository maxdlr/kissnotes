"use client";
import { PencilIcon } from "@heroicons/react/24/outline";
import type { KissFormErrors } from "@kissnotes/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import Loading from "@/components/Loading";
import useSearcher from "@/components/Searcher/hooks/useSearcher";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import useAxios from "@/hooks/useAxios";
import type { KissChangeEvent } from "@/types/form.types";
import { getProfileHref } from "@/utils/userUtils";
import SettingsSection from "./_components/SettingsSection";

interface ProfileSettingsFormData {
  username: string;
  email: string;
  notifyLike: boolean;
  notifyShare: boolean;
}

interface ProfileSettingsPasswordFormData {
  password: string;
}

const ProfileSettingsPage = () => {
  const { user, loading: userLoading, logOut, refreshMe } = useAuth();
  const { isOpen } = useSearcher();
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<ProfileSettingsFormData>();
  const router = useRouter();
  const [errors, setErrors] = useState<KissFormErrors>([]);
  const [loading, setLoading] = useState(false);

  const { putData: updateUser } = useAxios("users/edit");

  useEffect(() => {
    if (!userLoading && user) {
      setFormData({
        username: user.username,
        email: user.email,
        notifyLike: true,
        notifyShare: false,
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
      router.push(`${getProfileHref(formData?.username as string)}/settings`);
      addToast({
        type: "success",
        title: "Profile updated",
      });
      refreshMe();
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
            className="grid! grid-cols-5 gap-8"
            fieldsetClassName="col-span-4 flex gap-4 py-8"
            submit={
              isEdit
                ? {
                    label: "Save",
                    onClick: handleSubmit,
                    loading,
                    shortcut: { keys: ["Enter"] },
                    size: "sm",
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
              className="col-span-2"
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
              className="col-span-2"
            />
          </FormWrapper>
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          subtitle="Receive emails"
          className="col-span-full"
        >
          <div className="grid grid-cols-2 gap-8 py-8">
            <FormInput
              labelIn
              type="checkbox"
              name="notifyLike"
              label="Likes"
              value={formData?.notifyLike}
              onChange={handleOnchange}
              variant="ghost"
              disabled={!isEdit}
            />
            <FormInput
              labelIn
              type="checkbox"
              name="notifyShare"
              label="Shares"
              value={formData?.notifyShare}
              onChange={handleOnchange}
              variant="ghost"
              disabled={!isEdit}
            />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};
export default ProfileSettingsPage;
