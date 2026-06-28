"use client";

import { Model } from "@kissnotes/types";
import AdminListCell from "./components/AdminListCell";
import Button from "../Button";
import FormInput from "../FormInput";
import { KissChangeEvent } from "@/types/form.types";

const adminListColumns: Record<string, { key: string; width: string }[]> = {
  "native-expressions": [
    { key: "id", width: "60px" },
    { key: "title", width: "1fr" },
    { key: "description", width: "2fr" },
  ],
  expressions: [
    { key: "id", width: "60px" },
    { key: "title", width: "1fr" },
    { key: "description", width: "2fr" },
  ],
  users: [
    { key: "id", width: "60px" },
    { key: "username", width: "1fr" },
    { key: "email", width: "2fr" },
  ],
};

const AdminList = <T extends Model>({
  entities,
  entity,
  onDelete,
  onSearch,
}: {
  entities: T[];
  entity: string;
  onDelete: (id: T["id"]) => void;
  onSearch: (e: KissChangeEvent) => void;
}) => {
  if (!entities.length) return null;

  const columns = adminListColumns[entity] || [];
  const gridTemplate = [...columns.map((c) => c.width), "auto", "auto"].join(
    " ",
  );

  return (
    <div className="space-y-4 sm:space-y-8">
      <div>
        <FormInput name="search" onChange={onSearch} />
      </div>
      <div className="flex flex-col">
        <div
          className="hidden sm:grid gap-4"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => (
            <span key={col.key} className="font-bold">
              {col.key}
            </span>
          ))}
        </div>
        {entities.map((row: T) => (
          <div
            key={row.id}
            className="flex flex-col sm:grid gap-4 border-t border-accent p-4 items-start sm:items-center group hover:bg-accent/20"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((col) => (
              <AdminListCell
                key={`${row.id}-${col.key}`}
                kkey={`${row.id}-${col.key}`}
                property={col.key as keyof T}
                value={(row as Record<string, unknown>)[col.key] as T[keyof T]}
              />
            ))}
            <div className="flex justify-center items-center gap-2">
              <Button label="Edit" href={`/admin/${entity}/${row.id}`} />
              <Button
                label="Delete"
                onClick={() => onDelete(row.id)}
                className="group-hover:bg-danger!"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminList;
