"use client";
import Loading from "@/components/Loading";
import useRead from "@/hooks/bread/useRead";
import useAxios from "@/hooks/useAxios";
import type { ExpressionModel, Id } from "@kissnotes/types";
import ExpressionDetailsContent from "./components/ExpressionDetailsContent";
import useAuth from "@/contexts/AuthContext/useAuth";

export interface ExpressionDetailsProps {
  id: Id;
}

const ExpressionDetails = ({ id }: ExpressionDetailsProps) => {
  const { data: expression, mutate } = useRead<ExpressionModel>("expressions", {
    id: id as Id,
  });

  const { postData: postSave } = useAxios("users/cmd/save-expression");
  const { user } = useAuth();

  const handleSave = () => {
    if (!user || !expression) return;
    postSave({ expressionId: expression.id }).then(() => mutate());
  };

  return expression ? (
    <ExpressionDetailsContent
      expression={expression}
      onSave={handleSave}
      user={user}
    />
  ) : (
    <Loading className="mt-64" />
  );
};

export default ExpressionDetails;
