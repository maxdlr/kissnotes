import type { ElementType } from "react";

export interface FormSelectProps<T> {
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
