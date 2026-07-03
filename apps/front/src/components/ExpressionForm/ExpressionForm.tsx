import { toCodeModel } from "@/utils/codeUtils";
import {
  LayerEnums,
  LayerModel,
  PropertyGroupEnum,
  PropertyModel,
} from "@kissnotes/types";
import Button from "../Button";
import FormInput from "../FormInput";
import FormWrapper from "../FormWrapper";
import { ExpressionFormProps } from "./interfaces";

const ExpressionForm = ({
  published,
  formData,
  handleOnSubmit,
  handleOnChange,
  className = "",
}: ExpressionFormProps) => {
  const layerTypeOptions = Object.values(LayerEnums).map((l) => ({
    name: l.name,
    type: l.type,
  }));
  const propertyGroupOptions = Object.values(PropertyGroupEnum).map((p) => ({
    name: p,
    group: p,
  }));

  const separator = (
    <div className="col-span-full h-px w-full sm:hidden md:block bg-accent/20" />
  );
  const canSubmit: boolean =
    !!formData.title &&
    !!formData.layer?.name &&
    !!formData.layer.type &&
    !!formData.property?.name &&
    !!formData.property.group &&
    !!formData.codeBlock.length &&
    !!formData.author?.id;
  return (
    <FormWrapper
      fieldsetClassName="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8"
      animated
      className={className}
    >
      <div className="col-span-1 flex gap-2 sm:gap-4 justify-center items-start h-full w-full">
        <Button
          label={`${published ? "Update" : "Publish"}`}
          onClick={() => handleOnSubmit()}
          type="submit"
          className="w-full h-full"
          disabled={!canSubmit}
        />
        {published && (
          <Button
            label="Unpublish"
            onClick={() => handleOnSubmit(false)}
            type="submit"
            className="w-full h-full"
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
        className="col-span-2"
      />

      <FormWrapper.Layout className="col-span-1 flex flex-col gap-2 sm:gap-4">
        <FormWrapper.Layout className="flex flex-col gap-2 sm:gap-4">
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
            className="col-span-1"
          />
          <FormInput
            name="layer.name"
            onChange={handleOnChange}
            value={formData?.layer?.name}
            placeholder="Name of the layer"
          />
        </FormWrapper.Layout>

        {separator}

        <FormWrapper.Layout className="flex flex-col gap-2 sm:gap-4">
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
      </FormWrapper.Layout>

      <FormWrapper.Layout className="col-span-2 space-y-8">
        <FormInput
          type="code"
          name="codeBlock"
          label="Expression"
          onChange={handleOnChange}
          value={formData?.codeBlock || "\n\n\n\n"}
          placeholder="Your code... "
          codeHeight={`${toCodeModel(formData.codeBlock || "\n\n\n\n").lines.length * 26 + 24}px`}
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
export default ExpressionForm;
