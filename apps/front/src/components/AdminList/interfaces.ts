import { KissChangeEvent } from "@/types/form.types";
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

export interface AdminListProps<T extends Model> {
  entities: T[];
  entity: string;
  onDelete?: (id: T["id"]) => void;
  onSearch?: (e: KissChangeEvent) => void;
  dense?: boolean;
}

export interface AdminListCellProps<T extends Model> {
  property: keyof T;
  value: T[keyof T];
  className?: string;
}
