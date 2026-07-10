import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import useAxios from "@/hooks/useAxios";
import { Model } from "@kissnotes/types";
import { useState } from "react";
import { AdminListRowProps } from "../interfaces";
import AdminListCell from "./AdminListCell";

const AdminListRow = <T extends Model>({
  row,
  columns,
  dense,
  style,
  editHref,
  onDelete,
  deleteEndpoint,
}: AdminListRowProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteData } = useAxios(deleteEndpoint ?? null);

  const handleDelete = async () => {
    await deleteData().then((r) => {
      if (!r?.error) {
        onDelete?.(row.id);
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <ConfirmModal onCancel={handleCloseModal} onConfirm={handleDelete} />
      )}
      <div
        key={row.id}
        className={`flex flex-col sm:grid gap-4 border-t border-accent ${dense ? "py-2" : "py-4"} px-4 items-start sm:items-center group hover:bg-accent/20`}
        style={style}
      >
        {columns.map((col) => (
          <AdminListCell
            key={`${row.id}-${col.key}`}
            property={col.key as keyof T}
            value={(row as Record<string, unknown>)[col.key] as T[keyof T]}
            className="w-full"
          />
        ))}
        <div className="flex justify-start items-center gap-2">
          <Button
            label="Edit"
            href={editHref}
            size={dense ? "sm" : undefined}
            variant="outline"
          />
          {!dense && (
            <Button
              label="Delete"
              onClick={() => setIsModalOpen(true)}
              className="group-hover:bg-danger!"
              size={dense ? "sm" : undefined}
              variant="outline"
            />
          )}
        </div>
      </div>
    </>
  );
};
export default AdminListRow;
