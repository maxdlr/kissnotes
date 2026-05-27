"use client";
import type { ExpressionModel, Id, LayerModel } from "@kissnotes/types";
import { useState } from "react";
import FormInput from "@/components/FormInput";
import FormWrapper from "@/components/FormWrapper";
import type { KissChangeEvent } from "@/types/form.types";
import useAxios from "@/hooks/useAxios";
import FormSelect from "@/components/FormSelect";
import { formatDate } from "@/utils/dateUtils";
import useBrowse from "@/hooks/bread/useBrowse";

type AddExpressionFormData = Pick<
  ExpressionModel,
  "title" | "description" | "layer"
>;

const AddExpressionPage = () => {
  const { postData } = useAxios("expressions/add");
  const { data: layers } = useBrowse<LayerModel[]>("layers");
  const [formData, setFormData] = useState<AddExpressionFormData>({
    title: "",
    description: "",
    layer: {} as LayerModel,
  });

  const handleOnChange = (e: KissChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async () => {
    console.log(formData);
    const { data, error } = await postData({ expression: formData });

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
  };

  return (
    <FormWrapper
      title="Add Expression"
      className="p-4 sm:p-8"
      submit={{ label: "Add", onClick: handleOnSubmit }}
      fieldsetClassName="grid gap-4 sm:gap-8"
    >
      <FormInput
        name="title"
        label="Title"
        labelBg="bg-dark"
        onChange={handleOnChange}
        value={formData?.title}
        placeholder="My new expression"
      />
      <FormInput
        type="textarea"
        name="description"
        label="Description"
        labelBg="bg-dark"
        onChange={handleOnChange}
        value={formData?.description}
        placeholder="Describe the expression in a few words..."
      />
      <FormSelect<LayerModel>
        property="name"
        name="layer"
        options={(layers as LayerModel[]) || []}
        value={formData?.layer}
        onChange={handleOnChange}
      />
    </FormWrapper>
  );
};
export default AddExpressionPage;
