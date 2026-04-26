"use client";
import type { Id } from "@kissnotes/types";
import { useParams, useRouter } from "next/navigation";
import { ExpressionDetails } from "@/components/ExpressionDetails";
import { Modal } from "@/components/Modal";
import { getProfileHref, getUsername } from "@/utils/getProfileHref";

const ProfileExpressionDetailsPage = () => {
  const router = useRouter();
  const { handle } = useParams();
  const handleClose = () => {
    router.push(getProfileHref(getUsername(handle as string)));
  };
  const { id } = useParams();
  return (
    <Modal
      onClose={handleClose}
      className="bg-dark lg:w-3/4 xl:w-2/3 2xl:w-1/2 rounded-4xl border"
    >
      <article className="p-8">
        <ExpressionDetails id={id as Id} />
      </article>
    </Modal>
  );
};

export default ProfileExpressionDetailsPage;
