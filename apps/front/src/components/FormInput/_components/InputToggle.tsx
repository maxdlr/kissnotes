import { motion } from "framer-motion";
import type { ChangeEvent } from "react";

interface InputToggleProps {
  value: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
}

const InputToggle = ({ value, onChange, name, disabled }: InputToggleProps) => {
  const handleOnClick = () => {
    if (disabled) return;
    onChange?.({
      target: { name, value: !value },
    } as unknown as ChangeEvent<HTMLInputElement>);
  };

  return (
    <motion.button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      animate={{
        backgroundColor: value ? "var(--color-accent)" : "var(--color-darker)",
        opacity: disabled ? 0.4 : 1,
      }}
      className="relative h-6 w-12 px-px border border-accent rounded-full disabled:cursor-not-allowed cursor-pointer"
      aria-checked={value}
      role="switch"
    >
      <motion.div
        className="absolute top-px h-5 w-5 bg-secondary rounded-full shadow-sm"
        animate={{ left: value ? "calc(100% - 21px)" : "1px" }}
      />
    </motion.button>
  );
};

export default InputToggle;
