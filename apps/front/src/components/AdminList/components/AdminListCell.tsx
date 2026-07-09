import { truncate } from "@/utils/stringUtils";
import { Model } from "@kissnotes/types";
import { adminListColumns } from "../AdminList";
import { AdminListCellProps } from "../interfaces";

const AdminListCell = <T extends Model>({
  property,
  value,
  className,
}: AdminListCellProps<T>) => {
  const allowedKeys = Array.from(
    new Set(
      Object.values(adminListColumns).flatMap((cols) =>
        cols.map((col) => col.key),
      ),
    ),
  );

  if (!allowedKeys.includes(property as string)) {
    return null;
  }

  if (
    ["saves", "shares", "views", "expressions"].includes(property as string) &&
    Array.isArray(value)
  ) {
    return <span className={className}>{value.length}</span>;
  }

  if (
    ["title", "description", "username", "email"].includes(
      property as string,
    ) &&
    typeof value === "string"
  ) {
    return (
      <span className={`truncate ${className}`}>
        {truncate(value || "", 30)}
      </span>
    );
  }

  if (["string"].includes(typeof value)) {
    return (
      <span className={className}>{truncate((value as string) || "", 30)}</span>
    );
  }

  if (["number"].includes(typeof value)) {
    return <span className={className}>{value as number}</span>;
  }

  return property;
};
export default AdminListCell;
