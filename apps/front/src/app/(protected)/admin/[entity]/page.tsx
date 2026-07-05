"use client";
import AdminList from "@/components/AdminList";
import useToasts from "@/contexts/ToastsContext";
import useBrowse from "@/hooks/bread/useBrowse";
import { asTitle } from "@/utils/stringUtils";
import {
  ExpressionModel,
  Id,
  Model,
  NativeExpressionModel,
  UserModel,
} from "@kissnotes/types";
import { useParams } from "next/navigation";

type Types = NativeExpressionModel | ExpressionModel | UserModel;

const AdminListPage = () => {
  const { entity } = useParams();
  const { data: entities, mutate } = useBrowse<Model[]>(entity as string);
  const { addToast } = useToasts();

  const title = asTitle((entity as string).replaceAll("-", " ") || "");
  const handleDelete = async (id: Id) => {
    addToast({
      message: `${asTitle(entity as string)} ${id} deleted successfully`,
      type: "success",
    });
    mutate();
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <h1 className="text-3xl font-black text-center">{title}</h1>
      <AdminList<Types>
        entities={(entities as Types[]) || []}
        entity={entity as string}
        onDelete={handleDelete}
      />
    </div>
  );
};
export default AdminListPage;
