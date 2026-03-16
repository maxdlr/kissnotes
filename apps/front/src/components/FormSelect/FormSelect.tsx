/** biome-ignore-all lint/suspicious/noArrayIndexKey: dont care */

import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import {
  type ChangeEvent,
  type ElementType,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../Button";
import InputText from "../FormInput/_components/InputText";
import Pill from "../Pill/Pill";

interface FormSelectProps<T> {
  name: string;
  label?: string | React.ReactNode;
  className?: string;
  options: T[];
  value: T[] | (T | null);
  onChange: (change: { name: string; value: T[] | T }) => void;
  Icon?: ElementType;
  RenderOption?: (option: T) => React.ReactNode;
  SelectedRenderOption?: (option: T) => React.ReactNode;
  property: keyof T;
  searchable?: boolean;
  useHovering?: boolean;
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
  property,
  searchable = true,
  useHovering = true,
}: FormSelectProps<T>) => {
  const multiple = Array.isArray(value);
  const [prompt, setPrompt] = useState("");
  const filterOptions = useCallback(
    (opts: T[]) => {
      const lowerPrompt = prompt.toLocaleLowerCase();
      return opts.filter((option) => {
        const optionValue = (option[property] as string).toLocaleLowerCase();

        const isPromptMatch = !prompt || optionValue.includes(lowerPrompt);

        const isUnselected = multiple
          ? !(value as T[]).map((v) => v[property]).includes(option[property])
          : value?.[property] !== option[property];

        return isPromptMatch && isUnselected;
      });
    },
    [prompt, property, multiple, value],
  );
  const [localOptions, setLocalOptions] = useState<T[]>(() =>
    filterOptions(options),
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLocalOptions(filterOptions(options));
    if (prompt && searchable) {
      inputRef.current?.focus();
    }
  }, [prompt, options, searchable, filterOptions]);

  if (!options.length) return <div>Loading...</div>;

  const handleOnSelect = (option: T) => {
    if (multiple) {
      if (!value.includes(option)) {
        onChange({ name, value: [...value, option] });
      }
    } else {
      onChange({ name, value: option });
    }
    if (searchable) {
      inputRef.current?.focus();
    }
  };

  const handleOnDeselect = (option: T) => {
    if (multiple) {
      onChange({ name, value: value.filter((o) => o !== option) });
    } else {
      onChange({ name, value: null as T });
    }
    if (searchable) {
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    onChange({ name, value: multiple ? [] : (null as T) });
    setPrompt("");
    if (searchable) {
      inputRef.current?.focus();
    }
  };

  const isValue = (!multiple && !!value) || (multiple && !!value.length);

  const handlePrompt = (e: ChangeEvent<HTMLInputElement>) => {
    const promptValue = e.target.value;
    setPrompt(promptValue);
  };

  return (
    <div
      className={`border border-accent p-4 rounded-3xl grid grid-flow-row items-start gap-4 transition-all h-fit min-h-36 w-full ${className}`}
    >
      {/* HEADER */}

      <div className="flex justify-between items-center w-full transition-all">
        <div className="font-semibold flex items-center transition-all">
          {label &&
            ((multiple && searchable) || (!multiple && value === null) ? (
              <InputText
                value={prompt}
                ref={inputRef}
                name={name}
                placeholder={label as string}
                onChange={handlePrompt}
                className="ps-1.5"
              />
            ) : (
              <p className="ps-1.5 w-full">{label}</p>
            ))}
          {(multiple && searchable) || (!multiple && value === null) ? (
            <MagnifyingGlassIcon className="ms-2 size-6" />
          ) : (
            Icon && <Icon className="ms-2 size-6" />
          )}
        </div>
        <div className="flex justify-center items-center gap-4 transition-all">
          <AnimatePresence mode="popLayout">
            {(isValue || prompt) && (
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
                  onClick={handleClear}
                  Icon={XMarkIcon}
                  size="sm"
                  shortcut={{ keys: ["ESC"], ignoreInputs: false }}
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

      {/* RESULT */}

      {multiple && (
        <AnimatePresence mode="popLayout">
          {!!value.length && (
            <div className={`flex flex-wrap gap-2 transition-all`}>
              {value.map((valueOption: T, i: number) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  initial="initialDown"
                  animate="animate"
                  exit="exitDown"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOnDeselect(valueOption)}
                    label={
                      SelectedRenderOption?.(valueOption) || (
                        <Pill
                          label={valueOption[property] as string}
                          className="bg-accent! text-white! border-0! py-2! px-3!"
                        />
                      )
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}

      {!multiple && (
        <AnimatePresence mode="popLayout">
          {!!value && (
            <div className={`flex flex-wrap gap-2 transition-all`}>
              <motion.div
                variants={itemVariants}
                initial="initialDown"
                animate="animate"
                exit="exitDown"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOnDeselect(value)}
                  label={
                    SelectedRenderOption?.(value) || (
                      <Pill
                        label={value?.[property] as string}
                        className="bg-accent! text-white! border-0! py-2! px-3!"
                      />
                    )
                  }
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}

      <div className="bg-accent h-px" />

      {/* OPTIONS */}

      <div className={`flex flex-wrap gap-2`}>
        <AnimatePresence mode="popLayout">
          {localOptions.map((option: T, i: number) => (
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
                label={
                  RenderOption?.(option) || (
                    <Pill
                      useHovering={useHovering}
                      label={option[property] as string}
                    />
                  )
                }
                shortcut={
                  localOptions.length === 1
                    ? { keys: ["enter"], ignoreInputs: false }
                    : undefined
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormSelect;
