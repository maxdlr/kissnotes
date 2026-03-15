"use client";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { UserModel } from "@kissnotes/types";
import { useParams } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import useSearcher from "@/components/Searcher/hooks/useSearcher";
import { UserHandle } from "@/components/UserHandle";
import useAuth from "@/hooks/AuthProvider";
import useRead from "@/hooks/bread/useRead";
import { getProfileHref, getUsername } from "@/utils/getProfileHref";
import SectionTitle from "./_components/Subtitle";

interface ProfileSettingsPageProps {
  className?: string;
}

const ProfileSettingsPage = ({ className }: ProfileSettingsPageProps) => {
  const { handle } = useParams();
  const username = getUsername(handle);

  const { user: authUser, isAuthUser } = useAuth();
  const { data: unAuthUser } = useRead<UserModel>(
    "users",
    { username },
    !isAuthUser({ username }),
  );

  const user: UserModel | undefined = unAuthUser || authUser;

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

  const handleLogout = () => {

  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={`sm:max-w-200 w-full h-fit sm:max-h-125 border border-secondary rounded-4xl grid sm:grid-cols-5 items-start gap-x-4 sm:gap-x-8 sm:gap-y-4 gap-y-2 p-4 sm:p-8`}
      >
        <div className="flex justify-between items-center col-span-full">
          <div><UserHandle /><Button label="Logout" onClick={handleLogout} /></div>
          <Button
            Icon={XMarkIcon}
            shortcut={{ keys: ["ESC"], blockers: [isOpen] }}
            href={getProfileHref(username)}
            variant="ghost"
          />
        </div>
        <SectionTitle
          title="Profile"
          subtitle="Personal information"
          className="col-span-full"
        />
        <Button
          className="place-self-end self-center col-span-full"
          label="Edit"
          Icon={PencilIcon}
          shortcut={{ keys: ["cmd", "E"], blockers: [isOpen] }}
          onClick={() => setIsEdit((v) => !v)}
          variant="ghost"
        />
        <FormInput
          className="sm:col-span-2 place-self-start"
          name="username"
          label="Username"
          value={formData?.username}
          placeholder="batman"
          onChange={handleOnchange}
          variant={isEdit ? "fill" : "ghost"}
          disabled={!isEdit}
        />
        <FormInput
          className="sm:col-span-2"
          type="email"
          name="email"
          label="Email"
          value={formData?.email}
          placeholder="batman@batcave.gc"
          onChange={handleOnchange}
          variant={isEdit ? "fill" : "ghost"}
          disabled={!isEdit}
        />

        <SectionTitle
          title="Notifications"
          subtitle="Receive emails"
          className="col-span-full"
        />
        <FormInput
          labelIn
          type="checkbox"
          className="sm:col-span-2 pe-8"
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
          className="sm:col-span-2 pe-8"
          name="notifyShare"
          label="Shares"
          value={formData?.notifyShare}
          onChange={handleOnchange}
          variant="ghost"
          disabled={!isEdit}
        />
      </div>
    </div>
  );
};
export default ProfileSettingsPage;
