"use client";
import { useEffect } from "react";

const ExpressionPage = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  });
  return null;
};
export default ExpressionPage;
