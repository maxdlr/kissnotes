"use client";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  SlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ExpressionModel } from "@kissnotes/types";
import { useParams } from "next/navigation";
import Button from "@/components/Button/Button";
import { Header } from "@/components/Header";
import { KissCodeBlock } from "@/components/KissCodeBlock";
import { LayerMockup } from "@/components/LayerMockup";
import { UserHandle } from "@/components/UserHandle";
import useAuth from "@/hooks/AuthProvider";
import useRead from "../../hooks/bread/useRead";

const ExpressionDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { data: expression } = useRead<ExpressionModel>("expressions", id);
  if (!expression) {
    return "loading";
  }

  const { title, description, author, layer, property } = expression;
  // return <Header />;

  return (
    <>
      <Header user={user} />
      <section className="grid grid-cols-5 gap-8 p-8 bg-dark">
        <p>{description}</p>
        <div className="col-span-3">
          <div className="flex flex-col col-span-3 gap-4">
            <p className="text-2xl font-bold">{title}</p>
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-4">
                <Button variant="ghost" Icon={EyeIcon} label={14} />
                <Button variant="ghost" Icon={ShareIcon} label={6} />
              </div>
              <UserHandle user={author} />
            </div>
            <LayerMockup layer={layer} property={property} />
            <KissCodeBlock className="col-span-full" expression={expression} />
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
    </>
  );
};

export default ExpressionDetails;
