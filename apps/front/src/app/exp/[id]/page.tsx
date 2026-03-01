"use client";
import {
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  SignalIcon,
  SlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ExpressionModel } from "@kissnotes/types";
import { useParams } from "next/navigation";
import Button from "@/components/Button/Button";
import { CodeBlock } from "@/components/CodeBlock";
import { UserHandle } from "@/components/UserHandle";
import useRead from "../../hooks/bread/useRead";

const ExpressionDetails = () => {
  const { id } = useParams();
  const { expression } = useRead<ExpressionModel>("expressions", id);
  if (!expression) {
    return "loading";
  }

  const { title, description, user, layer, property, code } = expression;
  return (
    <section className="grid grid-cols-5 gap-8 p-8">
      <div>{description}</div>
      <div className="col-span-3">
        <div className="flex flex-col col-span-3 gap-4">
          <p className="text-2xl font-bold">{title}</p>
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-4">
              <Button variant="ghost" Icon={EyeIcon} label={14} />
              <Button variant="ghost" Icon={ShareIcon} label={6} />
            </div>
            <UserHandle user={user} />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <p className="bg-accent p-2">
              {layer.type} - {layer.name}
            </p>
            <div className="flex">
              <div className="bg-black w-full flex justify-start items-center gap-4 p-2">
                <ClockIcon className="size-6" />
                <p>{property.name}</p>
                <SignalIcon className="size-6" />
              </div>
              <div className="bg-gray-500 w-full flex justify-center items-center gap-4 p-2">
                <div className="w-3 h-3 border-2 rounded-sm rotate-45" />
                <div className="w-3 h-3 border-2 rounded-sm rotate-45" />
              </div>
            </div>
            {/* <div className="w-36 h-36 bg-gray-500 rounded-2xl" /> */}
          </div>
          <CodeBlock className="col-span-full" code={code} />
        </div>
      </div>
      <div className="flex flex-col justify-stretch items-end gap-4">
        <Button
          shortcut={["ESC"]}
          variant="ghost"
          Icon={XMarkIcon}
          href="/exp"
        />
        <Button
          label="Search..."
          shortcut={[SlashIcon]}
          Icon={MagnifyingGlassIcon}
        />
      </div>
    </section>
  );
};

export default ExpressionDetails;
