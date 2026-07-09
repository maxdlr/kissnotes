"use client";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import MasonryGrid from "@/components/MasonryGrid";
import type { KissChangeEvent } from "@/types/form.types";
import {
  CodeBracketIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
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
    // Dropdown options come as { label, value } objects — extract the actual value
    const resolved =
      name === "native" &&
      changeValue &&
      typeof changeValue === "object" &&
      "value" in (changeValue as object)
        ? (changeValue as { value: boolean }).value
        : changeValue;
    onChange({ ...value, [name]: resolved } as SidebarValue);
  };

  return (
    <aside className={`space-y-4 w-full ${className}`}>
      <MasonryGrid>
        {value?.search !== undefined && (
          <FormInput
            label="Search"
            placeholder="wiggle linear ..."
            StartChild={<MagnifyingGlassIcon className="w-6" />}
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
            StartChild={<CodeBracketIcon className="w-6" />}
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
            value={
              value.native
                ? { label: "Native expressions only", value: true }
                : { label: "All", value: false }
            }
          />
        )}

        {value?.tokens !== undefined && (
          <FormSelect<ExpressionToken>
            Icon={TagIcon}
            name="tokens"
            placeholder="Expression contains..."
            label="Tokens"
            options={tokenOptions}
            onChange={handleOnChange}
            value={value?.tokens || []}
            property="title"
            tooltip="Filter expressions that contain specific tokens, such as functions, methods, or properties."
          />
        )}

        {value?.author !== undefined && (
          <FormSelect<UserModel>
            placeholder="Author is ..."
            Icon={UserIcon}
            name="author"
            label="Author"
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
