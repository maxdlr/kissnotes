"use client";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import MasonryGrid from "@/components/MasonryGrid";
import useExpressions from "@/hooks/useExpressions";
import type { KissChangeEvent } from "@/types/form.types";
import { arrayUnique } from "@/utils/arrayUtils";
import type {
  ExpressionModel,
  ExpressionToken,
  UserModel,
} from "@kissnotes/types";
import { useMemo } from "react";
import { ExpressListSideBarProps, SidebarValue } from "./interfaces";

const ExpressionListSidebar = ({
  className,
  expressions,
  onChange,
  value,
  native = false,
}: ExpressListSideBarProps) => {
  const { getTokens } = useExpressions(
    native ? undefined : (expressions as ExpressionModel[]),
  );

  const tokens = useMemo(
    () => getTokens(["functions", "methods", "properties"]),
    [getTokens],
  );
  const authors = useMemo(() => {
    if (!expressions || native) return [];
    return arrayUnique(
      expressions.map((e) => (e as ExpressionModel).author),
      "username",
    );
  }, [expressions, native]);

  const handleOnChange = ({
    target: { name, value: changeValue },
  }: KissChangeEvent<unknown>) => {
    onChange({ ...value, [name]: changeValue } as SidebarValue);
  };

  return (
    <aside className={`space-y-4 w-full ${className}`}>
      <MasonryGrid>
        {value?.search !== undefined && (
          <FormInput
            name="search"
            onChange={handleOnChange}
            inputClassName="py-1 ps-1.5"
          />
        )}
        {value?.tokens !== undefined && (
          <FormSelect<ExpressionToken>
            name="tokens"
            label="Expression contains..."
            options={tokens}
            onChange={handleOnChange}
            value={value?.tokens || []}
            property="title"
            tooltip="Filter expressions that contain specific tokens, such as functions, methods, or properties."
          />
        )}
        {value?.author !== undefined && (
          <FormSelect<UserModel>
            name="author"
            label="Author is..."
            options={authors}
            onChange={handleOnChange}
            value={value?.author || null}
            property="username"
            tooltip="Filter expressions created by a specific author."
          />
        )}
      </MasonryGrid>
    </aside>
  );
};
export default ExpressionListSidebar;
