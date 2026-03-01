"use client";
import type { ExpressionModel } from "@kissnotes/types";
import { useParams } from "next/navigation";
import useRead from "../../hooks/bread/useRead";

const ExpressionDetails = () => {
  const { id } = useParams();
  const { expression } = useRead<ExpressionModel>("expressions", id);
  return expression?.title;
};

export default ExpressionDetails;
