"use client";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type {
  ExpressionModel,
  ExpressionToken,
  UserModel,
} from "@kissnotes/types";
import { useState } from "react";
import useExpressions from "@/hooks/useExpressions";
import { arrayUnique } from "@/utils/arrayUtils";
import { Button } from "../Button";
import { FormSelect } from "../FormSelect";
import Pill from "../Pill/Pill";

interface ExpressListSideBarProps {
  className?: string;
  expressions: ExpressionModel[];
}

const ExpressionListSidebar = ({
  className,
  expressions,
}: ExpressListSideBarProps) => {
  const [formData, setFormData] = useState<{
    tokens: ExpressionToken[];
    author: UserModel | null;
  }>({
    tokens: [],
    author: null,
  });

  const { getAllTokens } = useExpressions(expressions);

  const handleOnChange = ({ name, value }: { name: string; value: any }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          options={arrayUnique(getAllTokens(), "label")}
          onChange={handleOnChange}
          value={formData.tokens}
          property="label"
        />
        <FormSelect<UserModel>
          name="author"
          label="Author is..."
          options={arrayUnique(
            expressions.map((e) => e.author),
            "username",
          )}
          onChange={handleOnChange}
          value={formData.author}
          property="username"
        />
      </div>
    </aside>
  );
};
export default ExpressionListSidebar;
