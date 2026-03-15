/** biome-ignore-all lint/suspicious/noArrayIndexKey: dont care */

import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import type { ElementType } from "react";
import { Button } from "../Button";

interface FormSelectProps<T> {
  name: string;
  label?: string | React.ReactNode;
  className?: string;
  options: T[];
  value: T[] | T;
  onChange: (change: { name: string; value: T[] | T }) => void;
  Icon?: ElementType;
  RenderOption: (option: T) => React.ReactNode;
  SelectedRenderOption?: (option: T) => React.ReactNode;
}

const itemVariants = {
  initialDown: { opacity: 0, scale: 0.8, y: 20 },
  initialLeft: { opacity: 0, scale: 0.8, x: -20 },
  initialUp: { opacity: 0, scale: 0.8, y: -20 },
  animate: { opacity: 1, scale: 1, y: 0, x: 0 },
  exitDown: { opacity: 0, scale: 0.8, y: 20 },
  exitUp: { opacity: 0, scale: 0.8, y: -20 },
  exitLeft: { opacity: 0, scale: 0.8, x: -20 },
};

const FormSelect = <T,>({
  Icon,
  name,
  label,
  className,
  options,
  value,
  onChange,
  RenderOption,
  SelectedRenderOption,
}: FormSelectProps<T>) => {
  const multiple = Array.isArray(value);

  const handleOnSelect = (option: T) => {
    if (multiple) {
      if (!value.includes(option)) {
        onChange({ name, value: [...value, option] });
      }
    } else {
      onChange({ name, value: option });
    }
  };

  const handleOnDeselect = (option: T) => {
    if (multiple) {
      onChange({ name, value: value.filter((o) => o !== option) });
    } else {
      onChange({ name, value: null as T });
    }
  };

  return (
    <div
      className={`border border-accent p-4 rounded-3xl grid grid-flow-row gap-4 transition-all  ${className}`}
    >
      <div className="flex justify-between items-center w-full transition-all">
        <div className="font-semibold flex items-center transition-all">
          <p>{label}</p>
          {Icon && <Icon className="ms-2 size-6" />}
        </div>
        <div className="flex justify-center items-center gap-4 transition-all">
          <AnimatePresence mode="popLayout">
            {value !== null && !!(value as T[]).length && (
              <motion.div
                variants={itemVariants}
                initial="initialLeft"
                animate="animate"
                exit="exitLeft"
                className="flex justify-center items-center"
              >
                <Button
                  label="Clear"
                  variant="ghost"
                  onClick={() =>
                    onChange({ name, value: multiple ? [] : (null as T) })
                  }
                  Icon={XMarkIcon}
                  size="sm"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            variants={itemVariants}
            whileHover={{ rotate: 30 }}
            className="flex justify-center items-center"
          >
            <Button
              variant="ghost"
              size="sm"
              Icon={QuestionMarkCircleIcon}
              className="text-accent"
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {value !== null && !!(value as T[]).length && (
          <div className={`flex flex-wrap gap-2 transition-all`}>
            {multiple
              ? value.map((option: T, i: number) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    initial="initialDown"
                    animate="animate"
                    exit="exitDown"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => handleOnDeselect(option)}
                      label={
                        SelectedRenderOption?.(option) || RenderOption(option)
                      }
                    />
                  </motion.div>
                ))
              : RenderOption(value as T)}
          </div>
        )}
      </AnimatePresence>
      <div className="bg-accent h-px" />

      <div className={`flex flex-wrap gap-2`}>
        <AnimatePresence mode="popLayout">
          {options
            .filter((o) => !(value as T[]).includes(o) && o !== (value as T))
            .map((option: T, i: number) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="initialUp"
                animate="animate"
                exit="exitUp"
              >
                <Button
                  variant="ghost"
                  onClick={() => handleOnSelect(option)}
                  label={RenderOption(option)}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormSelect;
