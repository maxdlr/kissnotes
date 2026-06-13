"use client";
import Button from "@/components/Button";
import ExpressionDetailsContent from "@/components/ExpressionDetails/components/ExpressionDetailsContent";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import useAuth from "@/contexts/AuthContext/useAuth";
import useAxios from "@/hooks/useAxios";
import useDebounce from "@/hooks/useDebounce";
import type { KissChangeEvent } from "@/types/form.types";
import { toCodeModel } from "@/utils/codeUtils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  ExpressionModel,
  ExpressionSymbol,
  KissDeepPartial,
  UserModel,
} from "@kissnotes/types";
import { useEffect, useMemo, useState } from "react";

type AddExpressionFormData = {
  title: string;
  description: string;
  layerType?: { name: string; value: string };
  layerName: string;
  propertyGroup?: { name: string; value: string };
  propertyName: string;
  codeBlock: string;
  author?: UserModel;
  symbols?: ExpressionSymbol;
};

const AddExpressionPage = () => {
  const { user } = useAuth();

  const { postData: postExpression } = useAxios("expressions/add");
  const { postData: postSymbols } = useAxios(
    "expressions/cmd/generate-symbols",
  );

  const [generatedSymbols, setGeneratedSymbols] = useState<ExpressionSymbol>();
  const [formData, setFormData] = useState<AddExpressionFormData>({
    title: "",
    description: "",
    layerType: undefined,
    layerName: "",
    propertyGroup: undefined,
    propertyName: "",
    codeBlock: `const something = simthingelse();
let var = something.somethingElse();
function otherthing(some) {
  for (let i = 0; i <= var; i++) {
    dostuff()
  }
}

[y, x]`,
    author: { id: user?.id },
    symbols: undefined,
  });

  const debouncedCode = useDebounce(formData.codeBlock);

  useEffect(() => {
    if (!debouncedCode) return;
    postSymbols<ExpressionSymbol>({
      code: toCodeModel(debouncedCode),
    }).then(({ data }) => {
      if (data) setGeneratedSymbols(data);
      setFormData((prev) => ({
        ...prev,
        symbols: data,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCode]);

  const handleOnChange = (e: KissChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      return updated;
    });
  };

  const handleOnSubmit = async (publish: boolean = true) => {
    console.log(formData);
    const { data, error } = await postExpression({
      expression: {
        ...formData,
        code: toCodeModel(formData.codeBlock),
        published: publish,
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
  };

  const layerTypeOptions = [
    { name: "solid", value: "Solid" },
    { name: "shape-layer", value: "Shape layer" },
    { name: "null", value: "Null" },
    { name: "text", value: "Text layer" },
    { name: "adjustment-layer", value: "Adjustment layer" },
    { name: "precomp", value: "Pre-comp" },
    { name: "any", value: "Any layer" },
  ];

  const propertyGroupOptions = [{ name: "transform", value: "Transform" }];

  const separator = (
    <div className="h-px w-full sm:hidden md:block bg-accent/20" />
  );

  const tempExpressionMemo = useMemo((): KissDeepPartial<ExpressionModel> => {
    const temp = {
      title: formData.title,
      description: formData.description,
      layer: {
        type: formData.layerType?.name,
        name: formData.layerName,
      },
      property: {
        group: formData.propertyGroup?.name,
        name: formData.propertyName,
      },
      author: {
        username: user?.username,
      },
      symbols: generatedSymbols,
      code: toCodeModel(formData.codeBlock),
    };
    return temp;
  }, [formData, generatedSymbols, user]);

  const canSubmit: boolean =
    !!formData.title &&
    !!formData.layerType &&
    !!formData.layerName &&
    !!formData.propertyGroup &&
    !!formData.propertyName &&
    !!formData.codeBlock.length &&
    !!formData.author?.id;

  console.log({ canSubmit, formData });

  return (
    <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
      <h1 className="text-4xl flex justify-center items-baseline gap-4 pb-8 font-extrabold">
        Add{" "}
        {formData.title ? (
          <>
            <ArrowRightIcon className="inline size-6" /> {formData.title}
          </>
        ) : (
          "a new expression"
        )}
      </h1>
      <FormWrapper
        className=""
        fieldsetClassName="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8"
        animated
      >
        <FormWrapper.Layout className="grid grid-cols-2 h-fit md:grid-cols-1 gap-4 sm:gap-6">
          <div className="col-span-full flex flex-row gap-2 sm:gap-4">
            <Button
              label="Save"
              onClick={() => handleOnSubmit()}
              type="submit"
              className="w-full"
              disabled={!canSubmit}
            />
            <Button
              label="Save draft"
              onClick={() => handleOnSubmit(false)}
              type="submit"
              className="w-full"
              variant="outline-accent"
              disabled={!canSubmit}
            />
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
            <FormInput<{ name: string; value: string }>
              name="layerType"
              type="dropdown"
              label="Type of the layer"
              options={layerTypeOptions}
              onChange={handleOnChange}
              value={formData.layerType}
              property="value"
            />
            <FormInput
              name="layerName"
              onChange={handleOnChange}
              value={formData?.layerName}
              placeholder="Name of the layer"
            />
          </FormWrapper.Layout>

          <FormWrapper.Layout className="col-span-2 md:col-span-1 shrink-0 flex flex-col gap-4 sm:gap-6 items-start justify-start">
            {separator}
            <FormInput<{ name: string; value: string }>
              name="propertyGroup"
              type="dropdown"
              label="Group of the property"
              options={propertyGroupOptions}
              onChange={handleOnChange}
              value={formData.propertyGroup}
              property="name"
            />
            <FormInput
              name="propertyName"
              onChange={handleOnChange}
              value={formData?.propertyName}
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

        <FormWrapper.Layout className="col-span-2">
          <FormInput
            type="code"
            name="codeBlock"
            label="Expression"
            onChange={handleOnChange}
            value={formData?.codeBlock}
            placeholder="Your code... "
          />
          {/* TODO: tokens don't update */}
          <div className="max-md:hidden pt-4 sm:pt-8">
            <ExpressionDetailsContent
              expression={tempExpressionMemo as ExpressionModel}
            />
          </div>
        </FormWrapper.Layout>
      </FormWrapper>
    </div>
  );
};
export default AddExpressionPage;
