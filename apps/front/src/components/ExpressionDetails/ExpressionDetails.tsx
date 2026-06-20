"use client";
import Loading from "@/components/Loading";
import useAuth from "@/contexts/AuthContext/useAuth";
import useRead from "@/hooks/bread/useRead";
import useAxios from "@/hooks/useAxios";
import type { ExpressionModel, Id } from "@kissnotes/types";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import ExpressionDetailsContent from "./components/ExpressionDetailsContent";

export interface ExpressionDetailsProps {
  id: Id;
}

const ExpressionDetails = ({ id }: ExpressionDetailsProps) => {
  const { data: expression, mutate } = useRead<ExpressionModel>("expressions", {
    id: id as Id,
  });

  const { postData: postSave } = useAxios("users/cmd/save-expression");
  const { putData: putPublish } = useAxios("expressions/edit");
  const { user, refreshMe } = useAuth();
  const { mutate: globalMutate } = useSWRConfig();
  const router = useRouter();

  const revalidateExpressionsList = () => {
    globalMutate(
      (key: unknown) =>
        typeof key === "object" &&
        key !== null &&
        (key as Record<string, unknown>).url === "/expressions/browse",
      undefined,
      { revalidate: true },
    );
  };

  const handleSave = () => {
    if (!user || !expression) return;
    postSave({ expressionId: expression.id }).then((r) => {
      if (r.error) return;
      mutate();
      refreshMe();
    });
  };

  const handlePublish = () => {
    if (!user || !expression) return;
    putPublish({ ...expression, published: true }).then((r) => {
      if (r.error) return;
      mutate();
      revalidateExpressionsList();
    });
  };

  const handleUnpublish = () => {
    if (!user || !expression) return;
    putPublish({ ...expression, published: false }).then((r) => {
      if (r.error) return;
      mutate();
      revalidateExpressionsList();
    });
  };

  const handleEdit = () => {
    if (!user || !expression) return;
    router.push("/form/" + expression.id);
  };

  return expression ? (
    <ExpressionDetailsContent
      expression={expression}
      onSave={handleSave}
      onPublish={handlePublish}
      onUnpublish={handleUnpublish}
      onEdit={handleEdit}
    />
  ) : (
    <Loading className="mt-64" />
  );
};

export default ExpressionDetails;
