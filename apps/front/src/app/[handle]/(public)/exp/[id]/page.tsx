"use client";
import type { Id } from "@kissnotes/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ExpressionDetails from "@/components/ExpressionDetails";
import Modal from "@/components/Modal";

const UserExpressionById = () => {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };

  const { id } = useParams();

  const params = useSearchParams();
  const isNative = params.has("native");

  return (
    <Modal
      onClose={handleClose}
      className="bg-dark lg:w-3/4 xl:w-2/3 2xl:w-1/2 rounded-4xl border"
    >
      <article className="p-8">
        <ExpressionDetails id={id as Id} native={isNative} />
      </article>
    </Modal>
  );
};

export default UserExpressionById;
