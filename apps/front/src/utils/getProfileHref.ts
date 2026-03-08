import type { UserModel } from "@kissnotes/types";
import type { ParamValue } from "next/dist/server/request/params";

const getProfileHref = (username: string) => {
  const handle = `@${username}`;
  return `/u/${handle}`;
};
const getHandle = (usernameOrParam: string | ParamValue) => {
  const decoded = decodeURIComponent(usernameOrParam as string);
  const handle: UserModel["username"] = decoded.includes("@")
    ? decoded
    : `@${decoded}`;
  return handle;
};
const getUsername = (handleOrParam: string | ParamValue) => {
  const decoded = decodeURIComponent(handleOrParam as string);
  return decoded.replace("@", "");
};
export { getProfileHref, getHandle, getUsername };
