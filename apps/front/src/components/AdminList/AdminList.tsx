"use client";

import { Model } from "@kissnotes/types";
import AdminListCell from "./components/AdminListCell";
import Button from "../Button";
import FormInput from "../FormInput";
import { KissChangeEvent } from "@/types/form.types";
import { asTitle } from "@/utils/stringUtils";

export const adminListColumns: Record<
  string,
  { key: string; width: string }[]
> = {
  "native-expressions": [
    { key: "id", width: "60px" },
    { key: "title", width: "1fr" },
    { key: "description", width: "2fr" },
  ],
  expressions: [
    { key: "id", width: "60px" },
    { key: "title", width: "1fr" },
    { key: "description", width: "2fr" },
    { key: "saves", width: ".5fr" },
    { key: "shares", width: ".5fr" },
    { key: "views", width: ".5fr" },
  ],
  users: [
    { key: "id", width: "60px" },
    { key: "username", width: "1fr" },
    { key: "email", width: "2fr" },
    { key: "saves", width: ".5fr" },
  ],
};

const AdminList = <T extends Model>({
  entities,
  entity,
  onDelete,
  onSearch,
  dense = false,
}: {
  entities: T[];
  entity: string;
  onDelete?: (id: T["id"]) => void;
  onSearch?: (e: KissChangeEvent) => void;
  dense?: false;
}) => {
  if (!entities.length) return null;

  const columns = [
    ...adminListColumns[entity],
    { key: "actions", width: "1.5fr" },
  ];
  const gridTemplate = [...columns.map((c) => c.width), "auto", "auto"].join(
    " ",
  );

  return (
    <div className="space-y-4 sm:space-y-8">
      {onSearch && (
        <div>
          <FormInput name="search" onChange={onSearch} />
        </div>
      )}
      <div className="flex flex-col">
        <div
          className="hidden sm:grid gap-4 px-4"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => (
            <span key={col.key} className="font-bold">
              {asTitle(col.key)}
            </span>
          ))}
        </div>
        {entities.map((row: T) => (
          <div
            key={row.id}
            className={`flex flex-col sm:grid gap-4 border-t border-accent ${dense ? "py-2" : "py-4"} px-4 items-start sm:items-center group hover:bg-accent/20`}
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((col) => (
              <AdminListCell
                key={`${row.id}-${col.key}`}
                property={col.key as keyof T}
                value={(row as Record<string, unknown>)[col.key] as T[keyof T]}
              />
            ))}
            <div className="flex justify-start items-center gap-2">
              <Button
                label="Edit"
                href={`/admin/${entity}/${row.id}`}
                size={dense ? "sm" : undefined}
                variant="outline"
              />
              {!dense && onDelete && (
                <Button
                  label="Delete"
                  onClick={() => onDelete(row.id)}
                  className="group-hover:bg-danger!"
                  size={dense ? "sm" : undefined}
                  variant="outline"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminList;
