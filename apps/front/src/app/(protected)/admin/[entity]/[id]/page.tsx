"use client";
import { AdminEntityDetails } from "@/components/AdminEntityDetails";
import Loading from "@/components/Loading";
import useToasts from "@/contexts/ToastsContext";
import useRead from "@/hooks/bread/useRead";
import useAxios from "@/hooks/useAxios";
import { KissChangeEvent } from "@/types/form.types";
import {
  ExpressionModel,
  NativeExpressionModel,
  UserModel,
} from "@kissnotes/types";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

type DataModel = NativeExpressionModel | ExpressionModel | UserModel;

const AdminDetailsById = () => {
  const { entity, id } = useParams();
  const { putData } = useAxios(`/${entity}/edit`);
  const { addToast } = useToasts();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [saved, setSaved] = useState(false);
  const { data, loading, mutate } = useRead(entity as string, {
    id: id as string,
  });

  const handleChange = ({
    target: { name, value },
  }: KissChangeEvent<DataModel> | KissChangeEvent) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await putData({ ...data, [name]: value });
        if (!response.data) {
          addToast({
            type: "error",
            title: "Error",
            message: `Can't update ${entity} with id ${id}: No data returned`,
          });
          return;
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        mutate();
      } catch (error) {
        addToast({
          type: "error",
          title: "Error",
          message: `Error updating ${entity} with id ${id}: ${(error as Error).message}`,
        });
      }
    }, 1000);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    data && (
      <AdminEntityDetails<DataModel>
        saved={saved}
        entity={entity as string}
        formData={data as DataModel}
        onChange={handleChange}
      />
    )
  );
};
export default AdminDetailsById;
