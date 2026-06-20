"use client";
import Button from "@/components/Button";
import ExpressionDetailsContent from "@/components/ExpressionDetails/components/ExpressionDetailsContent";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import useRead from "@/hooks/bread/useRead";
import useAxios from "@/hooks/useAxios";
import useDebounce from "@/hooks/useDebounce";
import type { KissChangeEvent } from "@/types/form.types";
import { toCodeModel, toRawCodeString } from "@/utils/codeUtils";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  ExpressionModel,
  ExpressionSymbol,
  Id,
  KissDeepPartial,
  LayerEnums,
  LayerModel,
  LayerTypeEnum,
  PropertyGroupEnum,
  PropertyModel,
  UserModel,
} from "@kissnotes/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ExpressionFormData = {
  id?: Id;
  title: string;
  description: string;
  layer?: LayerModel;
  property?: PropertyModel;
  codeBlock: string;
  author?: UserModel;
  symbols?: ExpressionSymbol;
};

const ExpressionFormPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { addToast } = useToasts();

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
    await postExpression({
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
    });
  };

  const layerTypeOptions = Object.values(LayerEnums).map((l) => ({
    name: l.name,
    type: l.type,
  }));
  const propertyGroupOptions = Object.values(PropertyGroupEnum).map((p) => ({
    name: p,
    group: p,
  }));

  const separator = (
    <div className="h-px w-full sm:hidden md:block bg-accent/20" />
  );

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

  const canSubmit: boolean =
    !!formData.title &&
    !!formData.layer?.name &&
    !!formData.layer.type &&
    !!formData.property?.name &&
    !!formData.property.group &&
    !!formData.codeBlock.length &&
    !!formData.author?.id;

  return (
    <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
      <div className="flex justify-center items-center gap-4 pb-8">
        <h1 className="text-4xl flex justify-center items-baseline gap-4 font-extrabold">
          {expression?.published ? "Edit" : "Add"}{" "}
          {formData.title ? (
            <>
              <ArrowRightIcon className="inline size-6" /> {formData.title}
            </>
          ) : (
            "a new expression"
          )}
        </h1>
        {expression?.published && (
          <Button Icon={EyeIcon} href={`/exp/${expression?.id}/m`} size="sm" />
        )}
      </div>
      <FormWrapper
        className=""
        fieldsetClassName="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8"
        animated
      >
        <FormWrapper.Layout className="grid grid-cols-2 h-fit md:grid-cols-1 gap-4 sm:gap-6">
          <div className="col-span-full flex flex-row gap-2 sm:gap-4 justify-center items-center">
            <Button
              label={`${expression?.published ? "Update" : "Publish"}`}
              onClick={() => handleOnSubmit()}
              type="submit"
              className="w-full"
              disabled={!canSubmit}
            />
            {expression?.published && (
              <Button
                label="Unpublish"
                onClick={() => handleOnSubmit(false)}
                type="submit"
                className="w-full"
                variant="outline-accent"
                disabled={!canSubmit}
                tooltip={{ content: "Save as draft and carry on later" }}
              />
            )}
          </div>
          <FormInput
            name="title"
            label="Title"
            onChange={handleOnChange}
            value={formData?.title}
            placeholder="My new expression"
            className="col-span-full"
          />

          <FormWrapper.Layout className="col-span-2 md:col-span-1 shrink-0 flex flex-col gap-4 sm:gap-6 items-start justify-start">
            {separator}
            <FormInput<LayerModel>
              name="layer.type"
              type="dropdown"
              label="Type of the layer"
              options={layerTypeOptions}
              onChange={(e) =>
                handleOnChange({
                  target: {
                    name: "layer.type",
                    value: (e.target.value as LayerModel).type,
                  },
                })
              }
              value={layerTypeOptions.find(
                (o) => o.type === formData.layer?.type,
              )}
              property="type"
            />
            <FormInput
              name="layer.name"
              onChange={handleOnChange}
              value={formData?.layer?.name}
              placeholder="Name of the layer"
            />
          </FormWrapper.Layout>

          <FormWrapper.Layout className="col-span-2 md:col-span-1 shrink-0 flex flex-col gap-4 sm:gap-6 items-start justify-start">
            {separator}
            <FormInput<PropertyModel>
              name="property.group"
              type="dropdown"
              label="Group of the property"
              options={propertyGroupOptions}
              onChange={(e) =>
                handleOnChange({
                  target: {
                    name: "property.group",
                    value: (e.target.value as PropertyModel).group,
                  },
                })
              }
              value={propertyGroupOptions.find(
                (o) => o.group === formData.property?.group,
              )}
              property="group"
            />
            <FormInput
              name="property.name"
              onChange={handleOnChange}
              value={formData?.property?.name}
              placeholder="Name of the property"
            />
          </FormWrapper.Layout>
          <FormInput
            type="textarea"
            name="description"
            label="Description"
            onChange={handleOnChange}
            value={formData?.description}
            placeholder="Describe the expression in a few words..."
            className="col-span-full"
          />
        </FormWrapper.Layout>

        <FormWrapper.Layout className="col-span-2 space-y-8">
          <FormInput
            type="code"
            name="codeBlock"
            label="Expression"
            onChange={handleOnChange}
            value={formData?.codeBlock}
            placeholder="Your code... "
            codeHeight={`${toCodeModel(formData.codeBlock).lines.length * 26 + 24}px`}
          />
          <div className="max-md:hidden pt-4 sm:pt-8 border border-dashed border-emphasis bg-dark p-2 sm:p-6 rounded-3xl">
            <ExpressionDetailsContent
              expression={tempExpressionMemo as ExpressionModel}
              preview
            />
          </div>
        </FormWrapper.Layout>
      </FormWrapper>
    </div>
  );
};
export default ExpressionFormPage;
