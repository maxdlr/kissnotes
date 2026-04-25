"use client";
import { PencilIcon } from "@heroicons/react/24/outline";
import { type ChangeEvent, useState } from "react";
import { FormInput } from "@/components/FormInput";
import useSearcher from "@/components/Searcher/hooks/useSearcher";
import useAuth from "@/hooks/AuthProvider";
import SettingsSection from "./_components/SettingsSection";

const ProfileSettingsPage = () => {
  const { user } = useAuth();
  const { isOpen } = useSearcher();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    notifyLike: true,
    notifyShare: false,
  });

  if (!user) {
    return null;
  }

  const handleOnchange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={`sm:max-w-200 w-full h-fit sm:max-h-125 rounded-4xl p-4 sm:p-8`}
      >
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
            variant={isEdit ? "fill" : "ghost"}
            disabled={!isEdit}
          />
          <FormInput
            type="email"
            name="email"
            label="Email"
            value={formData?.email}
            placeholder="batman@batcave.gc"
            onChange={handleOnchange}
            variant={isEdit ? "fill" : "ghost"}
            disabled={!isEdit}
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
