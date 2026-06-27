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

export type SidebarValue =
  | {
      tokens?: ExpressionToken[];
      author?: UserModel | null;
      search?: string;
    }
  | undefined;

interface ExpressListSideBarProps {
  className?: string;
  expressions: ExpressionModel[];
  onChange: (filters: SidebarValue) => void;
  value: SidebarValue;
  collapsed?: boolean;
}

const ExpressionListSidebar = ({
  className,
  expressions,
  onChange,
  value,
}: ExpressListSideBarProps) => {
  const { getTokens } = useExpressions(expressions);
  const tokens = getTokens(["functions", "methods", "properties"]);
  const authors = arrayUnique(
    expressions.map((e) => e.author),
    "username",
  );

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
            shortcut={{
              keys: value?.search ? ["ESC"] : ["cmd", "F"],
              preventDefault: true,
            }}
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
            property="label"
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
