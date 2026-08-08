import type { UserModel } from "@kissnotes/types";

/** Fetches all users for the sitemap's profile page entries. */
export const fetchAllUsers = async (): Promise<UserModel[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/browse`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};
