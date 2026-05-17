"use client";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Loading from "@/components/Loading";
import useSearcher from "@/components/Searcher/hooks/useSearcher";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import type { KissChangeEvent } from "@/types/form.types";
import SettingsSection from "./_components/SettingsSection";

interface ProfileSettingsFormData {
  username: string;
  email: string;
  password: string;
  notifyLike: boolean;
  notifyShare: boolean;
}

const ProfileSettingsPage = () => {
  const { user, loading, logOut } = useAuth();
  const { isOpen } = useSearcher();
  const { addToast } = useToasts();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<ProfileSettingsFormData>();

  useEffect(() => {
    if (!loading && user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
        notifyLike: true,
        notifyShare: false,
      });
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await logOut();
    addToast({
      type: "success",
      title: "Logged out",
      message: "You have been logged out successfully.",
    });
  };

  if (!user) {
    return <Loading />;
  }

  const handleOnchange = ({ target: { name, value } }: KissChangeEvent) => {
    setFormData((f) => ({ ...f, [name]: value }) as ProfileSettingsFormData);
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
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          subtitle="Receive emails"
          className="col-span-full"
        >
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
        </SettingsSection>
      </div>
    </div>
  );
};
export default ProfileSettingsPage;
