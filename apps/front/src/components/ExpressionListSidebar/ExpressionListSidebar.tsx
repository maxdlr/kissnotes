"use client";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type { ExpressionModel, ExpressionToken } from "@kissnotes/types";
import { useState } from "react";
import { Button } from "../Button";
import TokenPill from "../ExpressionToken/ExpressionToken";
import { FormSelect } from "../FormSelect";
import useSidebar from "./hooks/useSidebar";

interface ExpressListSideBarProps {
  className?: string;
  list: ExpressionModel[];
}

const ExpressionListSidebar = ({
  className,
  list,
}: ExpressListSideBarProps) => {
  const { getUniqueLabels } = useSidebar(list);
  const [formData, setFormData] = useState({
    tokens: [] as ExpressionToken[],
  });

  const handleOnChange = ({ name, value }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //get unique labels list from tokens[label]

  return (
    <aside className={`grid grid-flow-row ${className}`}>
      <Button
        variant="ghost"
        Icon={ArrowLeftIcon}
        className="place-self-end self-start hidden md:block"
      />
      <FormSelect<ExpressionToken>
        name="tokens"
        label="Expression contains..."
        options={getUniqueLabels}
        onChange={handleOnChange}
        value={formData.tokens}
        RenderOption={(option) => <TokenPill token={option} />}
        SelectedRenderOption={(option) => (
          <TokenPill
            token={option}
            className="bg-accent! text-white! border-0! py-2! px-3!"
          />
        )}
        Icon={MagnifyingGlassIcon}
      />
    </aside>
  );
};
export default ExpressionListSidebar;
