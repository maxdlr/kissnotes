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

type DataModel = NativeExpressionModel | ExpressionModel | UserModel;

const AdminDetailsById = () => {
  const { entity, id } = useParams();
  const { data, loading, mutate } = useRead(entity as string, {
    id: id as string,
  });
  const { putData } = useAxios(`/${entity}/edit`);
  const { addToast } = useToasts();

  const handleChange = async ({
    target: { name, value },
  }: KissChangeEvent<DataModel> | KissChangeEvent) => {
    await putData({ ...data, [name]: value })
      .then((response) => {
        console.log({ response });

        if (!response.data) {
          addToast({
            type: "error",
            title: "Error",
            message: `Can't update ${entity} with id ${id}: No data returned`,
          });
          return;
        }
        mutate();
      })
      .catch((error) => {
        addToast({
          type: "error",
          title: "Error",
          message: `Error updating ${entity} with id ${id}: ${error.message}`,
        });
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    data && (
      <AdminEntityDetails<DataModel>
        entity={entity as string}
        formData={data as DataModel}
        onChange={handleChange}
      />
    )
  );
};
export default AdminDetailsById;
