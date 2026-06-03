"use client";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormWrapper from "@/components/FormWrapper";
import useAxios from "@/hooks/useAxios";
import type { KissChangeEvent } from "@/types/form.types";
import { useState } from "react";

type AddExpressionFormData = {
  title: string;
  description: string;
  layerType: { name: string } | null;
  layerName: string;
  propertyGroup: { name: string } | null;
  propertyName: "";
};

const AddExpressionPage = () => {
  const { postData } = useAxios("expressions/add");
  const [formData, setFormData] = useState<AddExpressionFormData>({
    title: "",
    description: "",
    layerType: null,
    layerName: "",
    propertyGroup: null,
    propertyName: "",
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

  const layerTypeOptions = [
    { name: "Solid" },
    { name: "Shape layer" },
    { name: "Null" },
    { name: "Text layer" },
  ];

  const propertyGroupOptions = [{ name: "transform" }];

  return (
    <FormWrapper
      title="Add Expression"
      className="p-4 sm:p-8"
      submit={{ label: "Add", onClick: handleOnSubmit }}
      fieldsetClassName="flex gap-4 sm:gap-8"
      animated
    >
      <FormWrapper.Layout className="shrink-0 flex flex-col gap-4 sm:gap-6 items-start justify-start">
        <FormInput
          name="title"
          label="Title"
          onChange={handleOnChange}
          value={formData?.title}
          placeholder="My new expression"
        />
        <FormSelect<{ name: string }>
          name="layerType"
          label="Type of the layer"
          options={layerTypeOptions}
          onChange={handleOnChange}
          value={formData.layerType}
          property="name"
        />
        <FormInput
          name="layerName"
          onChange={handleOnChange}
          value={formData?.layerName}
          placeholder="Name of the layer"
        />
        <FormSelect<{ name: string }>
          name="propertyGroup"
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
      <FormWrapper.Layout className="w-full">
        <FormInput
          type="textarea"
          name="description"
          label="Description"
          onChange={handleOnChange}
          value={formData?.description}
          placeholder="Describe the expression in a few words..."
        />
        <FormInput
          type="textarea"
          name="description"
          label="Description"
          onChange={handleOnChange}
          value={formData?.description}
          placeholder="Describe the expression in a few words..."
        />
      </FormWrapper.Layout>
    </FormWrapper>
  );
};
export default AddExpressionPage;
