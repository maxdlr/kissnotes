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
import { asTitle } from "@/utils/stringUtils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  ExpressionModel,
  ExpressionSymbol,
  KissDeepPartial,
  LayerEnums,
  LayerModel,
  LayerTypeEnum,
  PropertyGroupEnum,
  PropertyModel,
  UserModel,
} from "@kissnotes/types";
import { useEffect, useMemo, useState } from "react";

type AddExpressionFormData = {
  title: string;
  description: string;
  layer?: LayerModel;
  // layerName: string;
  property?: PropertyModel;
  // propertyName: string;
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
    title: "My new expression",
    description: "The description",
    layer: { name: "the solid", type: LayerTypeEnum.Solid },
    property: { name: "position", group: PropertyGroupEnum.Transform },
    codeBlock: `const some = time * 1
wiggle()
linear()`,
    author: undefined,
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
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof AddExpressionFormData] as object),
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
    const { error } = await postExpression({
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
      saves: 0,
      views: 0,
      shares: 0,
    };
    return temp;
  }, [formData, generatedSymbols, user]);

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
              tooltip={{ content: "Save as draft and carry on later" }}
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
          />
          <div className="max-md:hidden pt-4 sm:pt-8 border border-accent p-2 sm:p-6 rounded-3xl">
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
