"use client";
import Loading from "@/components/Loading";
import useRead from "@/hooks/bread/useRead";
import type { ExpressionModel, Id } from "@kissnotes/types";
import ExpressionDetailsContent from "./components/ExpressionDetailsContent";

export interface ExpressionDetailsProps {
  id: Id;
}

const ExpressionDetails = ({ id }: ExpressionDetailsProps) => {
  const { data: expression } = useRead<ExpressionModel>("expressions", {
    id: id as Id,
  });

  return expression ? (
    <ExpressionDetailsContent expression={expression} />
  ) : (
    <Loading className="mt-64" />
  );
};

export default ExpressionDetails;
