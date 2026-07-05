"use client";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import MasonryGrid from "@/components/MasonryGrid";
import type { KissChangeEvent } from "@/types/form.types";
import type { ExpressionToken, UserModel } from "@kissnotes/types";
import { ExpressListSideBarProps, SidebarValue } from "./interfaces";

const ExpressionListSidebar = ({
  className,
  tokenOptions,
  authorOptions,
  onChange,
  value,
}: ExpressListSideBarProps) => {
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
            value={value.search}
          />
        )}

        {value?.native !== undefined && value?.native !== null && (
          <FormInput<{
            label: "All" | "Native expressions only";
            value: boolean;
          }>
            label="Expression type"
            placeholder="All"
            property="label"
            name="native"
            type="dropdown"
            onChange={handleOnChange}
            options={[
              { label: "All", value: false },
              { label: "Native expressions only", value: true },
            ]}
            value={value.native}
          />
        )}

        {value?.tokens !== undefined && (
          <FormSelect<ExpressionToken>
            name="tokens"
            label="Expression contains..."
            options={tokenOptions}
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
            options={authorOptions}
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
