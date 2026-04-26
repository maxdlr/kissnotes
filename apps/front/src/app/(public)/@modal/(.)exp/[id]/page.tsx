"use client";
import { useRouter } from "next/navigation";
import ExpressionById from "@/app/(public)/exp/[id]/page";
import { Modal } from "@/components/Modal";

const ProfileExpressionDetailsPage = () => {
  const router = useRouter();
  const handleClose = () => {
    router.replace("/");
  };
  return (
    <Modal
      onClose={handleClose}
      className="bg-dark lg:w-3/4 xl:w-2/3 2xl:w-1/2 rounded-4xl border"
    >
      <ExpressionById />
    </Modal>
  );
};

export default ProfileExpressionDetailsPage;
