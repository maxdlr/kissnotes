import useBrowse from "@/hooks/bread/useBrowse";
import { KissChangeEvent } from "@/types/form.types";
import { toRawCodeString } from "@/utils/codeUtils";
import { asTitle } from "@/utils/stringUtils";
import {
  CodeModel,
  ExpressionModel,
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
import { getRelativeTime } from "@/utils/dateUtils";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Pill from "../Pill";
import useAxios from "@/hooks/useAxios";
import ConfirmModal from "../ConfirmModal";
import { useRouter } from "next/navigation";
import useToasts from "@/contexts/ToastsContext";

const AdminEntityDetails = <T extends Model>({
  saved,
  entity,
  formData: initialData,
  onChange,
  recursive = false,
}: AdminEntityDetailsProps<T>) => {
  const { deleteData } = useAxios(
    initialData?.id ? `/${entity}/delete?id=${initialData?.id}` : null,
  );
  const [formData, setFormData] = useState<Record<string, unknown>>(
    (initialData as Record<string, unknown>) || {},
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { addToast } = useToasts();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data: users } = useBrowse<UserModel[]>("users");
  const { data: expressions } = useBrowse<ExpressionModel[]>("expressions", {
    author: {
      id: formData.id as string,
    } as UserModel,
  });

  const handleChange = ({
    target: { name, value },
  }: KissChangeEvent | KissChangeEvent<unknown>) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    onChange({ target: { name, value: value as string } });
  };

  const handleDelete = async () => {
    await deleteData().then((r) => {
      if (!r?.error) {
        addToast({
          message: `${asTitle(entity)} ${initialData?.id} deleted successfully`,
          type: "success",
        });
      }
    });
    router.back();
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
        {["author"].includes(key) && !!formData.author && (
          <div>
            <FormInput<UserModel>
              key={key}
              options={users || []}
              name={key}
              label={asTitle(key || "")}
              property="username"
              onChange={handleChange}
              value={formData[key] as UserModel | undefined}
              type="dropdown"
              EndChild={
                <Button
                  label="Edit"
                  size="sm"
                  href={`/admin/users/${(formData.author as Record<string, unknown>)?.id}`}
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
            value={userTypeOptions[formData[key] as UserType] ?? undefined}
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
            value={formData[key] as string}
            type="text"
          />
        )}

        {["email"].includes(key) && (
          <FormInput
            key={key}
            name={key}
            label={asTitle(key || "")}
            onChange={handleChange}
            value={formData[key] as string}
            type="email"
          />
        )}

        {["description"].includes(key) && (
          <FormInput
            key={key}
            name={key}
            label={asTitle(key || "")}
            onChange={handleChange}
            value={formData[key] as string}
            type="textarea"
          />
        )}

        {["code"].includes(key) && (
          <FormInput
            key={key}
            name={key}
            label={asTitle(key || "")}
            onChange={handleChange}
            value={toRawCodeString(formData[key] as CodeModel)}
            type="code"
          />
        )}

        {["layer", "property", "socials"].includes(key) && (
          <AdminEntityDetails
            saved={saved}
            key={key}
            formData={formData[key] as T}
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
    <>
      {isModalOpen && (
        <ConfirmModal onCancel={handleCloseModal} onConfirm={handleDelete} />
      )}
      <div>
        <div className="pb-8 flex justify-between items-center flex-wrap">
          <div className="flex justify-start items-center flex-wrap gap-2 sm:gap-4">
            {formData.createdAt && (
              <Pill label={`Created ${getRelativeTime(formData.createdAt)}`} />
            )}

            {formData.updatedAt && (
              <Pill label={`Updated ${getRelativeTime(formData.updatedAt)}`} />
            )}

            {formData.published && (
              <Pill
                label="Published"
                className="border-emphasis text-emphasis"
              />
            )}

            {formData.published !== undefined && !formData.published && (
              <Pill label="Draft" className="border-gray-500 text-gray-500" />
            )}

            {formData.deletedAt && (
              <Pill
                label={`Deleted ${getRelativeTime(formData.deletedAt)}`}
                className="border-danger text-danger"
              />
            )}
          </div>

          <div>
            <Button
              label="Delete"
              onClick={() => setIsModalOpen(true)}
              className="group-hover:bg-danger!"
              variant="outline"
            />
          </div>

          {saved && (
            <p className="flex justify-center items-center gap-2 text-emphasis">
              <CheckCircleIcon className="size-6" /> Saved
            </p>
          )}
        </div>
        <FormWrapper
          title={
            !recursive
              ? asTitle(
                  (formData?.title as string) ||
                    (formData?.name as string) ||
                    (formData?.username as string) ||
                    (formData?.label as string) ||
                    "",
                )
              : undefined
          }
          fieldsetClassName="space-y-4 sm:space-y-6"
        >
          {fieldSet}
        </FormWrapper>
      </div>
    </>
  );
};
export default AdminEntityDetails;
