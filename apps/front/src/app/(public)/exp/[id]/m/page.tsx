"use client";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import type { Id } from "@kissnotes/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import ExpressionDetails from "@/components/ExpressionDetails";
import Modal from "@/components/Modal";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

const ExpressionByIdModalPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const params = useSearchParams();
  const isNative = params.get("native");

  const handleClose = () => {
    router.back();
  };

  const handleExpand = () => {
    setOpen(false);
    router.push(`/exp/${id}${isNative !== null ? "?native" : ""}`);
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Modal
          onClose={handleClose}
          className="bg-dark lg:w-3/4 xl:w-2/3 2xl:w-1/2 rounded-4xl border"
          HeaderChild={
            <Button
              Icon={ArrowsPointingOutIcon}
              variant="ghost"
              onClick={handleExpand}
              shortcut={{ keys: ["ENTER"] }}
            />
          }
        >
          <article className="p-6 sm:p-8">
            <ExpressionDetails id={id as Id} native={isNative !== null} />
          </article>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ExpressionByIdModalPage;
