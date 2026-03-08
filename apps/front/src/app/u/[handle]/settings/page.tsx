"use client";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { UserModel } from "@kissnotes/types";
import { useParams } from "next/navigation";
import { Button } from "@/components/Button";
import { UserHandle } from "@/components/UserHandle";
import useAuth from "@/hooks/AuthProvider";
import useRead from "@/hooks/bread/useRead";
import { getUsername } from "@/utils/getProfileHref";
import Subtitle from "./_components/Subtitle";
import { FormInput } from "@/components/FormInput";
import { ChangeEvent, useState } from "react";

interface ProfileSettingsPageProps {
  className?: string;
}

const ProfileSettingsPage = ({ className }: ProfileSettingsPageProps) => {
  const { handle: rawHandle } = useParams();
  const username = getUsername(rawHandle);

  const { user: authUser, isAuthUser } = useAuth();
  const { data: unAuthUser } = useRead<UserModel>(
    "users",
    { username },
    !isAuthUser({ username }),
  );

  const user: UserModel | undefined = unAuthUser || authUser;

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  if (!user) {
    return null;
  }

  const handleOnchange = ({ target: { name, value } }: ChangeEvent) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="w-full h-lvh flex justify-center items-center">
      <div
        className={`w-200 h-fit max-h-125 border border-secondary rounded-4xl grid grid-cols-5 items-start gap-4 p-8`}
      >
        <div className="flex justify-between items-center col-span-full">
          <UserHandle />
          <Button
            Icon={XMarkIcon}
            shortcut={["ESC"]}
            href="/"
            variant="ghost"
          />
        </div>
        <Subtitle subtitle="Profile" className="col-span-full" />
        <Button
          className="place-self-end self-center col-span-full"
          label="Edit"
          Icon={PencilIcon}
          shortcut={["cmd", "E"]}
          onClick={() => setIsEdit(true)}
          variant="ghost"
        />
        <FormInput
          className="col-span-2"
          name="username"
          label="Username"
          value={formData?.username}
          placeholder="batman"
          onChange={handleOnchange}
          variant={isEdit ? "fill" : "ghost"}
          disabled={!isEdit}
        />
        <FormInput
          className="col-span-2"
          name="email"
          label="Email"
          value={formData?.email}
          placeholder="batman@batcave.gc"
          onChange={handleOnchange}
          variant={isEdit ? "fill" : "ghost"}
          disabled={!isEdit}
        />
        <Subtitle subtitle="Notifications" className="col-span-full" />
      </div>
    </div>
  );
};
export default ProfileSettingsPage;
