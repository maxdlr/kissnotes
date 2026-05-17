"use client";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import type { Id } from "@kissnotes/types";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import ExpressionDetails from "@/components/ExpressionDetails";
import Modal from "@/components/Modal";

const ExpressionByIdModalPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const handleClose = () => {
    router.back();
  };
  return (
    <Modal
      onClose={handleClose}
      className="bg-dark lg:w-3/4 xl:w-2/3 2xl:w-1/2 rounded-4xl border"
      HeaderChild={
        <Button
          Icon={ArrowsPointingOutIcon}
          variant="ghost"
          onClick={() => router.push(`/exp/${id}`)}
          shortcut={{ keys: ["ENTER"] }}
        />
      }
    >
      <article className="p-4 sm:p-8">
        <ExpressionDetails id={id as Id} />
      </article>
    </Modal>
  );
};

export default ExpressionByIdModalPage;
