import UserSettings from "@/components/UserSettings/UserSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your profile settings",
};

const ProfileSettingsPage = () => {
  return <UserSettings className="pt-8" />;
};
export default ProfileSettingsPage;
