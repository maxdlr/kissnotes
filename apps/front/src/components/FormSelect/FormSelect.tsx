/** biome-ignore-all lint/suspicious/noArrayIndexKey: dont care */

import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import {
  type ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import useOnClickOutside from "@/hooks/useClickOutside";
import Button from "../Button";
import Collapsible from "../Collapsible/Collapsible";
import InputText from "../FormInput/_components/InputText";
import Pill from "../Pill/Pill";
import type { FormSelectProps } from "./interfaces";

// ---------------------------------------------------------------------------
// Sub-component: selected value pill row
// ---------------------------------------------------------------------------

interface SelectedOptionProps<T> {
  option: T;
  property: keyof T;
  SelectedRenderOption?: (option: T) => React.ReactNode;
  onDeselect: (option: T) => void;
}

const SelectedOption = <T,>({
  option,
  property,
  SelectedRenderOption,
  onDeselect,
}: SelectedOptionProps<T>) => (
  <div key={String(option[property])}>
    <Button
      animDirection="up"
      variant="fill"
      size="sm"
      onClick={() => onDeselect(option)}
      label={SelectedRenderOption?.(option) || (option[property] as string)}
    />
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

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
  placeholder,
  multiple: multipleProp,
  maxOptions = 10,
  tooltip,
}: FormSelectProps<T>) => {
  const multiple = multipleProp ?? Array.isArray(value);

  const [prompt, setPrompt] = useState("");
  const [max, setMax] = useState(10);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formSelectRef = useRef<HTMLDivElement | null>(null);
  const [focus, setFocus] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const refocus = useCallback(() => {
    if (searchable) {
      inputRef.current?.focus();
      setFocus(true);
    }
  }, [searchable]);

  useOnClickOutside<HTMLDivElement>(formSelectRef, () => {
    setFocus(false);
    if (prompt === "" && selectedValues.length === 0) {
      setCollapsed(true);
    }
  });

  const filterOptions = useCallback(
    (opts: T[]) => {
      const lowerPrompt = prompt.toLocaleLowerCase();
      return opts
        .filter((option) => {
          const optionValue = (option[property] as string).toLocaleLowerCase();
          const isPromptMatch = !prompt || optionValue.includes(lowerPrompt);

          const selectedKeys = multiple
            ? (value as T[]).map((v) => v[property])
            : value
              ? [(value as T)[property]]
              : [];
          const isUnselected = !selectedKeys.includes(option[property]);
          return isPromptMatch && isUnselected;
        })
        .sort((a, b) => {
          return (a[property] as string).localeCompare(
            b[property] as string,
            "en",
            {
              sensitivity: "base",
            },
          );
        });
    },
    [prompt, property, multiple, value],
  );

  const localOptions = useMemo(
    () => filterOptions(options),
    [filterOptions, options],
  );

  if (!options.length) return;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleOnSelect = (option: T) => {
    if (multiple) {
      const alreadySelected = (value as T[])
        .map((v) => v[property])
        .includes(option[property]);
      if (!alreadySelected) {
        onChange({ target: { name, value: [...(value as T[]), option] } });
      }
    } else {
      onChange({ target: { name, value: option } });
    }
    setPrompt("");
    refocus();
  };

  const handleOnDeselect = (option: T) => {
    if (multiple) {
      onChange({
        target: {
          name,
          value: (value as T[]).filter((o) => o[property] !== option[property]),
        },
      });
    } else {
      onChange({ target: { name, value: null } });
    }
    refocus();
  };

  const handleClear = () => {
    onChange({ target: { name, value: multiple ? [] : null } });
    setPrompt("");
    refocus();
  };

  const handlePrompt = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleFocus = () => {
    setFocus(true);
    setCollapsed(false);
  };

  const isValue =
    (!multiple && value !== null && value !== undefined) ||
    (multiple && (value as T[]).length > 0);

  const selectedValues = multiple ? (value as T[]) : value ? [value as T] : [];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const showSearch =
    (searchable && multiple && options.length) ||
    (searchable && !multiple && !isValue && options.length);

  return (
    <AnimatePresence mode="popLayout">
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: dont care */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions:  dont care */}
      <div
        onClick={refocus}
        ref={formSelectRef}
        className={`border ${focus ? "border-secondary" : "border-accent"} p-5 rounded-4xl grid grid-flow-row items-start h-fit ${!collapsed && localOptions.length ? "min-h-36" : ""} ${className}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          {label && (
            <div className="font-semibold flex items-center">
              {showSearch ? (
                <InputText
                  value={prompt}
                  ref={inputRef}
                  name={name}
                  placeholder={label as string}
                  onChange={handlePrompt}
                  className="ps-1"
                  onFocus={handleFocus}
                  Icon={
                    !isValue && Icon !== null
                      ? Icon || MagnifyingGlassIcon
                      : undefined
                  }
                />
              ) : (
                <p className="ps-1.5 w-full">{label}</p>
              )}
            </div>
          )}

          <div className="flex justify-center items-center gap-2">
            {(isValue || prompt) && (
              <div className="flex justify-center items-center">
                <Button
                  animDirection="right"
                  label="Clear"
                  variant="ghost-reveal"
                  onClick={handleClear}
                  size="sm"
                  shortcut={{
                    keys: ["ESC"],
                    ignoreInputs: false,
                    blockers: [!focus],
                  }}
                />
              </div>
            )}

            {tooltip && (
              <div className="flex justify-center items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  Icon={QuestionMarkCircleIcon}
                  className="text-accent"
                />
              </div>
            )}
          </div>
        </div>

        <Collapsible collapsed={collapsed}>
          <div className="space-y-4 pt-4 ">
            {/* EMPTY STATE */}
            {!isValue && placeholder && (
              <div className="flex justify-start items-center gap-2">
                {placeholder && (
                  <Pill
                    label={placeholder}
                    className="w-fit bg-transparent! border-accent/40 text-secondary/20"
                  />
                )}
              </div>
            )}

            {/* SELECTED — unified single/multi render */}
            {!!selectedValues.length && (
              <div className="flex flex-wrap gap-2 transition-all">
                {selectedValues.map((option) => (
                  <SelectedOption
                    key={String(option[property])}
                    option={option}
                    property={property}
                    SelectedRenderOption={SelectedRenderOption}
                    onDeselect={handleOnDeselect}
                  />
                ))}
              </div>
            )}

            {!!localOptions.length && <div className="bg-accent h-px" />}

            {/* OPTIONS */}
            {!!localOptions.length && (
              <div className="flex flex-wrap gap-2">
                {localOptions
                  .map(
                    (option, index) =>
                      RenderOption?.(option, index) || (
                        <Button
                          key={`${String(option[property])}-${index}`}
                          variant="fill-accent"
                          size="sm"
                          onClick={() => handleOnSelect(option)}
                          label={option[property] as string}
                          shortcut={
                            localOptions.length === 1 || index === 0
                              ? {
                                  keys: ["enter"],
                                  ignoreInputs: false,
                                  blockers: [!focus],
                                }
                              : undefined
                          }
                        />
                      ),
                  )
                  .filter((_, i) => i < max)}
                {localOptions.length > max && (
                  <Button
                    variant="outline"
                    Icon={PlusIcon}
                    size="sm"
                    onClick={() => setMax(localOptions.length)}
                    label="More..."
                  />
                )}
                {localOptions.length <= max && options.length >= max && (
                  <Button
                    variant="outline"
                    Icon={MinusIcon}
                    size="sm"
                    onClick={() => setMax(maxOptions)}
                    label="Less..."
                  />
                )}
              </div>
            )}
          </div>
        </Collapsible>
      </div>
    </AnimatePresence>
  );
};

export default FormSelect;
