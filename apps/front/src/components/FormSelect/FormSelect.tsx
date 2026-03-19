/** biome-ignore-all lint/suspicious/noArrayIndexKey: dont care */

import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import {
  type ChangeEvent,
  type ElementType,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import useOnClickOutside from "@/hooks/useClickOutside";
import { Button } from "../Button";
import InputText from "../FormInput/_components/InputText";
import Pill from "../Pill/Pill";

interface FormSelectProps<T> {
  /** The field name, used as the key in `onChange` payloads and as a fallback label. */
  name: string;

  /** Optional label displayed in the header. When `searchable` is true and no value
   *  is selected, this is also used as the search input placeholder. */
  label?: string | React.ReactNode;

  /** Additional class names applied to the root container. */
  className?: string;

  /** Full list of options to select from. */
  options: T[];

  /**
   * Current selected value(s).
   * - Pass a `T[]` to enable multi-select mode.
   * - Pass a single `T | null` to enable single-select mode.
   */
  value: T[] | T | null;

  /**
   * Called whenever the selection changes.
   * `value` will be `T[]` in multi-select mode and `T | null` in single-select mode.
   */
  onChange: (change: { name: string; value: T[] | T | null }) => void;

  /** Optional icon rendered in the header when a value is selected. */
  Icon?: ElementType;

  /** Custom renderer for each option in the dropdown list. */
  RenderOption?: (option: T, index: number) => React.ReactNode;

  /** Custom renderer for each selected value pill. */
  SelectedRenderOption?: (option: T) => React.ReactNode;

  /** The key of `T` whose value is used as the display label and for equality checks. */
  property: keyof T;

  /** Whether to show a search/filter input. Defaults to `true`. */
  searchable?: boolean;

  /** Whether to apply hover styles to unselected option pills. Defaults to `true`. */
  useHovering?: boolean;

  /**
   * Placeholder text shown when no value is selected.
   * Falls back to an empty pill if omitted — do **not** rely on `name` for user-facing copy.
   */
  placeholder?: string;

  /** When `true`, enables multi-select mode. Derived from `value` type when omitted,
   *  but providing this explicitly is safer and more readable. */
  multiple?: boolean;

  /**
   * Maximum number of options to show in the dropdown list. */
  maxOptions?: number;
}

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
}: FormSelectProps<T>) => {
  const multiple = multipleProp ?? Array.isArray(value);

  const [prompt, setPrompt] = useState("");
  const [max, setMax] = useState(10);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formSelectRef = useRef<HTMLDivElement | null>(null);
  const [focus, setFocus] = useState(false);

  const refocus = useCallback(() => {
    if (searchable) {
      inputRef.current?.focus();
      setFocus(true);
    }
  }, [searchable]);

  useOnClickOutside<HTMLDivElement>(formSelectRef, () => setFocus(false));

  const filterOptions = useCallback(
    (opts: T[]) => {
      const lowerPrompt = prompt.toLocaleLowerCase();
      return opts
        .filter((option) => {
          const optionValue = (option[property] as string).toLocaleLowerCase();
          const isPromptMatch = !prompt || optionValue.includes(lowerPrompt);
          // Use property-based equality so object references don't matter.
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

  if (!options.length) return <div>Loading...</div>;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleOnSelect = (option: T) => {
    if (multiple) {
      const alreadySelected = (value as T[])
        .map((v) => v[property])
        .includes(option[property]);
      if (!alreadySelected) {
        onChange({ name, value: [...(value as T[]), option] });
      }
    } else {
      onChange({ name, value: option });
    }
    setPrompt("");
    refocus();
  };

  const handleOnDeselect = (option: T) => {
    if (multiple) {
      onChange({
        name,
        value: (value as T[]).filter((o) => o[property] !== option[property]),
      });
    } else {
      onChange({ name, value: null });
    }
    refocus();
  };

  const handleClear = () => {
    onChange({ name, value: multiple ? [] : null });
    setPrompt("");
    refocus();
  };

  const handlePrompt = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
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
        className={`border ${focus ? "border-secondary" : "border-accent"} p-4 rounded-3xl grid grid-flow-row items-start gap-4 transition-all h-fit min-h-36 w-full ${className}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center w-full transition-all">
          <div className="font-semibold flex items-center transition-all">
            {label &&
              (showSearch ? (
                <InputText
                  value={prompt}
                  ref={inputRef}
                  name={name}
                  placeholder={label as string}
                  onChange={handlePrompt}
                  className="ps-1.5"
                  onFocus={() => setFocus(true)}
                />
              ) : (
                <p className="ps-1.5 w-full">{label}</p>
              ))}
            {searchable && !isValue ? (
              <MagnifyingGlassIcon className="ms-2 size-6" />
            ) : (
              Icon && <Icon className="ms-2 size-6" />
            )}
          </div>

          <div className="flex justify-center items-center gap-4 transition-all">
            {/* <AnimatePresence mode="popLayout"> */}
            {(isValue || prompt) && (
              <div className="flex justify-center items-center">
                <Button
                  animDirection="right"
                  label="Clear"
                  variant="ghost"
                  onClick={handleClear}
                  Icon={XMarkIcon}
                  size="sm"
                  shortcut={{
                    keys: ["ESC"],
                    ignoreInputs: false,
                    blockers: [!focus],
                  }}
                />
              </div>
            )}
            {/* </AnimatePresence> */}

            <div className="flex justify-center items-center">
              <Button
                variant="ghost"
                size="sm"
                Icon={QuestionMarkCircleIcon}
                className="text-accent"
              />
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {!isValue && placeholder && (
          <div className="flex justify-start items-center gap-2">
            {placeholder && (
              <Pill
                label={placeholder}
                className="w-fit bg-transparent border-accent/40 text-accent/40"
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

        <div className="bg-accent h-px" />

        {/* OPTIONS */}
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
          {!!localOptions.length && localOptions.length > max && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMax(localOptions.length)}
              label="More..."
              shortcut={{ keys: ["+"], blockers: [!focus] }}
            />
          )}
          {!!localOptions.length &&
            localOptions.length <= max &&
            options.length >= max && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMax(maxOptions)}
                label="Less..."
                shortcut={{ keys: ["-"], blockers: [!focus] }}
              />
            )}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default FormSelect;
