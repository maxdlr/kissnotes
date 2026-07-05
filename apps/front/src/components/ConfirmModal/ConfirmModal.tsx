import Button from "../Button";
import { ButtonProps } from "../Button/interfaces";
import Modal from "../Modal";
import { ConfirmModalProps } from "./interfaces";

const ConfirmModal = ({
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
}: ConfirmModalProps) => {
  return (
    <Modal onClose={onCancel} className="bg-darker p-8 max-w-sm" isCentered>
      <div className="space-y-4">
        <p className="font-bold text-xl">Confirm delete ?</p>
        <div className="w-fit mx-auto flex justify-center items-center gap-4">
          {(
            [
              {
                label: cancelLabel,
                onClick: onCancel,
                variant: "outline",
              },
              {
                label: confirmLabel,
                onClick: onConfirm,
                variant: "fill",
              },
            ] as ButtonProps[]
          ).map((button) => (
            <Button key={button.label} {...button} />
          ))}
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmModal;
