import { Metadata } from "next";
import ProfilePage from "./_components/ProfilePage";
import { fetchUserByHandle } from "./_utils/fetchUserByHandle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const user = await fetchUserByHandle(handle);

  return {
    title: `Kissnotes • ${user.username}`,
    description:
      user.description ||
      `Browse expressions shared by ${user.username} on Kissnotes.`,
  };
}

export default function ProfilePageWrapper() {
  return <ProfilePage />;
}
