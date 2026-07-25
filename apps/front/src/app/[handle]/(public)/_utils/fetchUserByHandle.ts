import type { UserModel } from "@kissnotes/types";
import { getUsername } from "@/utils/userUtils";

export const fetchUserByHandle = async (handle: string): Promise<UserModel> => {
  const username = getUsername(handle);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/read?username=${username}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
};
