import { Model } from "@kissnotes/types";

export interface AdminListRowProps<T extends Model> {
  row: T;
  columns: { key: string; width: string }[];
  dense?: boolean;
  editHref?: string;
  onDelete?: (id: T["id"]) => void;
  style?: React.CSSProperties;
  deleteEndpoint: string;
}
