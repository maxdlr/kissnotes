"use client";
import { ArrowTurnDownRightIcon } from "@heroicons/react/24/outline";
import type { ExpressionModel } from "@kissnotes/types";
import { Button } from "@/components/Button";
import useBrowse from "../../hooks/bread/useBrowse";

const Expressions = () => {
  const { data: expressions } = useBrowse<ExpressionModel[]>("expressions");
  return (
    <div className="flex flex-col gap-2 p-8">
      {expressions?.map(({ title, id }) => (
        <Button
          key={id}
          href={`/exp/${id}`}
          label={title}
          variant="ghost"
          Icon={ArrowTurnDownRightIcon}
        />
      ))}
    </div>
  );
};
export default Expressions;
