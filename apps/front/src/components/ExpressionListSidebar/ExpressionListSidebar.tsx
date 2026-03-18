"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type {
  ExpressionModel,
  ExpressionToken,
  UserModel,
} from "@kissnotes/types";
import useExpressions from "@/hooks/useExpressions";
import { arrayUnique } from "@/utils/arrayUtils";
import { Button } from "../Button";
import { FormSelect } from "../FormSelect";

export type SidebarValue =
  | {
      tokens: ExpressionToken[];
      author: UserModel | null;
    }
  | undefined;

interface ExpressListSideBarProps {
  className?: string;
  expressions: ExpressionModel[];
  onChange: (filters: SidebarValue) => void;
  value: SidebarValue;
}

const ExpressionListSidebar = ({
  className,
  expressions,
  onChange,
  value,
}: ExpressListSideBarProps) => {
  const { getTokens } = useExpressions(expressions);
  const tokens = arrayUnique(getTokens(), "label");
  // const [authors, setAuthors] = useState(
  //   arrayUnique(
  //     expressions.map((e) => e.author),
  //     "username",
  //   ),
  // );

  const authors = arrayUnique(
    expressions.map((e) => e.author),
    "username",
  );

  const handleOnChange = ({
    name,
    value: changeValue,
  }: {
    name: string;
    value: any;
  }) => {
    onChange({ ...value, [name]: changeValue } as SidebarValue);
  };

  return (
    <aside className={`space-y-4 ${className}`}>
      <Button
        variant="ghost"
        Icon={ArrowLeftIcon}
        className="place-self-end self-start hidden md:block"
        shortcut={{ keys: ["ctrl", "S"] }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        <FormSelect<ExpressionToken>
          name="tokens"
          label="Expression contains..."
          options={tokens}
          onChange={handleOnChange}
          value={value?.tokens || []}
          property="label"
        />
        <FormSelect<UserModel>
          name="author"
          label="Author is..."
          options={authors}
          onChange={handleOnChange}
          value={value?.author || null}
          property="username"
        />
      </div>
    </aside>
  );
};
export default ExpressionListSidebar;
