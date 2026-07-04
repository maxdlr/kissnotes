import useBrowse from "@/hooks/bread/useBrowse";
import { KissChangeEvent } from "@/types/form.types";
import { toRawCodeString } from "@/utils/codeUtils";
import { asTitle } from "@/utils/stringUtils";
import {
  CodeModel,
  ExpressionModel,
  KissDeepPartial,
  Model,
  UserModel,
  UserType,
} from "@kissnotes/types";
import { useState } from "react";
import AdminList from "../AdminList";
import Button from "../Button";
import FormInput from "../FormInput";
import FormWrapper from "../FormWrapper";
import { AdminEntityDetailsProps } from "./interfaces";

const AdminEntityDetails = <T extends Model>({
  entity,
  formData: initialData,
  onChange,
  recursive = false,
}: AdminEntityDetailsProps<T>) => {
  const [formData, setFormData] = useState<KissDeepPartial<T>>(
    initialData || {},
  );

  const { data: users } = useBrowse<UserModel[]>("users");
  const { data: expressions } = useBrowse<ExpressionModel[]>("expressions", {
    author: {
      id: formData.id,
    },
  });

  const handleChange = ({
    target: { name, value },
  }: KissChangeEvent<T> | KissChangeEvent) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    onChange({ target: { name, value: value as string } });
  };

  const userTypeOptions: Record<UserType, { label: string; value: UserType }> =
    {
      user: { label: "User", value: "user" },
      admin: { label: "Admin", value: "admin" },
    };

  const keys = Object.keys(formData || {});
  const fieldSet = keys
    .filter((k) => !["id", "createdAt", "updatedAt", "deletedAt"].includes(k))
    .map((key) => (
      <FormWrapper.Layout key={key}>
        {["author"].includes(key) && formData.author && (
          <div>
            <FormInput<UserModel>
              key={key}
              options={users || []}
              name={key}
              label={asTitle(key || "")}
              property="username"
              onChange={handleChange}
              value={formData[key as keyof T] as KissDeepPartial<T>[keyof T]}
              type="dropdown"
              EndChild={
                <Button
                  label="Edit"
                  size="sm"
                  href={`/admin/users/${formData.author.id}`}
                />
              }
            />
          </div>
        )}

        {entity === "users" && key === "type" && (
          <FormInput<{ label: string; value: UserType }>
            key={key}
            options={Object.values(userTypeOptions)}
            name={key}
            label={asTitle(key || "")}
            property="value"
            onChange={handleChange}
            value={
              userTypeOptions[
                formData[key as keyof T] as KissDeepPartial<T>[keyof T]
              ]
            }
            type="dropdown"
          />
        )}

        {(["name", "username", "title", "label", "group"].includes(key) ||
          (entity !== "users" && key === "type")) && (
          <FormInput
            key={key}
            name={key}
            label={asTitle(key || "")}
            onChange={handleChange}
            value={
              formData[key as keyof T] as KissDeepPartial<T>[keyof T] as string
            }
            type="text"
          />
        )}

        {["email"].includes(key) && (
          <FormInput
            key={key}
            name={key}
            label={asTitle(key || "")}
            onChange={handleChange}
            value={
              formData[key as keyof T] as KissDeepPartial<T>[keyof T] as string
            }
            type="email"
          />
        )}

        {["description"].includes(key) && (
          <FormInput
            key={key}
            name={key}
            label={asTitle(key || "")}
            onChange={handleChange}
            value={
              formData[key as keyof T] as KissDeepPartial<T>[keyof T] as string
            }
            type="textarea"
          />
        )}

        {["code"].includes(key) && (
          <FormInput
            key={key}
            name={key}
            label={asTitle(key || "")}
            onChange={handleChange}
            value={toRawCodeString(formData[key as keyof T] as CodeModel)}
            type="code"
          />
        )}

        {["layer", "property", "socials"].includes(key) && (
          <AdminEntityDetails
            key={key}
            formData={formData[key as keyof T] as T}
            onChange={handleChange}
            recursive
          />
        )}

        {["expressions"].includes(key) && (
          <div>
            <p className="ps-4 pb-4 font-bold text-accent">Expressions</p>
            {expressions?.length ? (
              <AdminList entities={expressions} entity="expressions" dense />
            ) : (
              "No expressions found for this user."
            )}
          </div>
        )}
      </FormWrapper.Layout>
    ));

  if (recursive) return fieldSet;

  return (
    <FormWrapper
      title={
        !recursive
          ? asTitle(
              (formData as Record<string, string>)?.title ||
                (formData as Record<string, string>)?.name ||
                (formData as Record<string, string>)?.username ||
                (formData as Record<string, string>)?.label ||
                "",
            )
          : undefined
      }
      fieldsetClassName="space-y-4 sm:space-y-6"
    >
      {fieldSet}
    </FormWrapper>
  );
};
export default AdminEntityDetails;
