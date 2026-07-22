"use client";

import { asTitle } from "@/utils/stringUtils";
import { Model } from "@kissnotes/types";
import FormInput from "../FormInput";
import AdminListRow from "./components/AdminListRow";
import { AdminListProps } from "./interfaces";

export const adminListColumns: Record<
  string,
  { key: string; width: string }[]
> = {
  "native-expressions": [
    { key: "id", width: ".5fr" },
    { key: "title", width: "1fr" },
    { key: "description", width: "3fr" },
  ],
  expressions: [
    { key: "id", width: ".5fr" },
    { key: "title", width: "1fr" },
    { key: "description", width: "3fr" },
    { key: "saves", width: ".5fr" },
    { key: "shares", width: ".5fr" },
    { key: "views", width: ".5fr" },
  ],
  users: [
    { key: "id", width: ".5fr" },
    { key: "username", width: "1fr" },
    { key: "email", width: "2fr" },
    { key: "saves", width: ".5fr" },
    { key: "expressions", width: ".75fr" },
  ],
};

const AdminList = <T extends Model>({
  entities,
  entity,
  onDelete,
  onSearch,
  dense = false,
}: AdminListProps<T>) => {
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
          className="hidden md:grid gap-4 px-4 py-4 bg-darker sticky top-0"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => (
            <span key={col.key} className="w-full font-bold">
              {asTitle(col.key)}
            </span>
          ))}
        </div>

        {entities.map((row: T) => (
          <AdminListRow<T>
            style={{ gridTemplateColumns: gridTemplate }}
            key={row.id}
            row={row}
            columns={columns}
            dense={dense}
            deleteEndpoint={`/${entity}/delete?id=${row.id}`}
            editHref={`/admin/${entity}/${row.id}`}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
export default AdminList;
