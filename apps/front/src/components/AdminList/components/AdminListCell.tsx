import { truncate } from "@/utils/stringUtils";
import { Model } from "@kissnotes/types";

const AdminListCell = <T extends Model>({
  kkey,
  property,
  value,
  className,
}: {
  kkey: string;
  property: keyof T;
  value: T[keyof T];
  className?: string;
}) => {
  const display =
    (typeof value === "string" && value.length > 30) ||
    (typeof value === "number" && String(value).length > 30)
      ? truncate(value as string, 30)
      : String(value);

  return <span className={className}>{display}</span>;
};
export default AdminListCell;
