"use client";
import Button from "@/components/Button";
import ExpressionDetailsContent from "@/components/ExpressionDetails/components/ExpressionDetailsContent";
import ExpressionForm from "@/components/ExpressionForm";
import Tabs from "@/components/Tabs";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import useRead from "@/hooks/bread/useRead";
import useAxios from "@/hooks/useAxios";
import useDebounce from "@/hooks/useDebounce";
import type { KissChangeEvent } from "@/types/form.types";
import { toCodeModel, toRawCodeString } from "@/utils/codeUtils";
import { PencilIcon } from "@heroicons/react/16/solid";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  ExpressionModel,
  ExpressionSymbol,
  KissDeepPartial,
  LayerTypeEnum,
  PropertyGroupEnum,
} from "@kissnotes/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ExpressionFormData } from "@/components/ExpressionForm/interfaces";
import useBreakpoints from "@/hooks/useBreakpoints";

const ExpressionFormPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { addToast } = useToasts();
  const router = useRouter();

  const [generatedSymbols, setGeneratedSymbols] = useState<ExpressionSymbol>();
  const [formData, setFormData] = useState<ExpressionFormData>({
    title: "",
    description: "",
    layer: { name: "", type: LayerTypeEnum.Solid },
    property: { name: "", group: PropertyGroupEnum.Transform },
    codeBlock: "",
  });

  const { postData: postExpression } = useAxios("expressions/add");
  const { putData: putExpression } = useAxios("expressions/edit");
  const { postData: postSymbols } = useAxios(
    "expressions/cmd/generate-symbols",
  );
  const { data: expression, mutate } = useRead<ExpressionModel>(
    "expressions",
    {
      id: id as string,
    },
    !!id && id !== "new",
  );

  const successToast = () =>
    addToast({
      type: "success",
      message: "Expression updated successfully",
      Icon: CheckBadgeIcon,
      duration: 1000,
    });

  useEffect(() => {
    if (!expression) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      id: expression.id,
      title: expression.title,
      description: expression.description || "",
      layer: expression.layer,
      property: expression.property,
      codeBlock: toRawCodeString(expression.code),
      author: expression.author,
      symbols: expression.symbols,
    });
  }, [expression]);

  const debouncedCode = useDebounce(formData.codeBlock);
  const debouncedFormData = useDebounce(formData, 2000);

  useEffect(() => {
    if (!debouncedCode) return;
    postSymbols<ExpressionSymbol>(toCodeModel(debouncedCode)).then(
      ({ data }) => {
        if (data) setGeneratedSymbols(data);
        setFormData((prev) => ({
          ...prev,
          symbols: data,
        }));
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCode]);

  useEffect(() => {
    if (
      user &&
      debouncedFormData &&
      id &&
      expression?.id &&
      debouncedFormData?.id
    ) {
      putExpression({
        ...debouncedFormData,
        code: toCodeModel(debouncedFormData.codeBlock),
      }).then(() => {
        successToast();
        mutate();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFormData]);

  const handleOnChange = (e: KissChangeEvent<unknown>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof ExpressionFormData] as object),
            [child]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
    if (user) {
      setFormData((prev) => ({
        ...prev,
        author: user,
      }));
    }
  };

  const handleOnSubmit = async (publish: boolean = true) => {
    await postExpression<ExpressionModel>({
      ...formData,
      code: toCodeModel(formData.codeBlock),
      published: publish,
    }).then((r) => {
      if (r.error) {
        console.error(r.error);
        return;
      }
      successToast();
      mutate();
      router.push(`/exp/${r.data?.id}`);
    });
  };

  const tempExpressionMemo = useMemo((): KissDeepPartial<ExpressionModel> => {
    const temp = {
      title: formData.title,
      description: formData.description,
      layer: formData.layer,
      property: formData.property,
      author: user,
      symbols: generatedSymbols,
      code: toCodeModel(formData.codeBlock),
      saves:
        (Array.isArray(expression?.saves)
          ? expression?.saves.length
          : expression?.saves) || 0,
      views:
        (Array.isArray(expression?.views)
          ? expression?.views.length
          : expression?.views) || 0,
      shares:
        (Array.isArray(expression?.shares)
          ? expression?.shares.length
          : expression?.shares) || 0,
    };
    return temp;
  }, [
    formData,
    generatedSymbols,
    user,
    expression?.saves,
    expression?.views,
    expression?.shares,
  ]);

  const { sm } = useBreakpoints();

  return (
    <div className="pt-8 p-2 sm:p-4 space-y-2 sm:space-y-4">
      <div className="flex justify-center items-center gap-4 pb-8">
        <h1 className="text-4xl flex max-sm:flex-col  justify-center items-baseline gap-4 font-extrabold">
          <span className="hidden sm:inline">
            {expression?.published ? "Edit" : "Add"}
          </span>
          {formData.title ? (
            <>
              <ArrowRightIcon className="size-6 hidden sm:inline" />
              {formData.title}
            </>
          ) : (
            "a new expression"
          )}
        </h1>
        {expression?.published && (
          <Button Icon={EyeIcon} href={`/exp/${expression?.id}/m`} size="sm" />
        )}
      </div>

      <Tabs.Container defaultTab="form">
        <Tabs.Tab label="Form" value="form" Icon={PencilIcon}>
          <ExpressionForm
            published={!!expression?.published}
            formData={formData}
            handleOnSubmit={handleOnSubmit}
            handleOnChange={handleOnChange}
          />
        </Tabs.Tab>

        <Tabs.Tab label="Preview" value="preview" Icon={EyeIcon}>
          <div className="pt-4 sm:pt-8 border border-dashed border-emphasis bg-dark p-2 sm:p-6 rounded-3xl">
            <ExpressionDetailsContent
              expression={tempExpressionMemo as ExpressionModel}
              preview
            />
          </div>
        </Tabs.Tab>
      </Tabs.Container>
    </div>
  );
};
export default ExpressionFormPage;
