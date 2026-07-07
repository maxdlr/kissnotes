import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormWrapper from "@/components/FormWrapper";
import type { KissChangeEvent } from "@/types/form.types";
import { SocialLinkIcon } from "@/types/socials.types";
import { asTitle } from "@/utils/stringUtils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SocialType, type SocialLinkModel } from "@kissnotes/types";
import { useState } from "react";
import type { SignUpStepProps } from "../page";

const SignUpStepThree = ({
  loading,
  onNext,
  onChange,
  errors,
  formData,
}: SignUpStepProps) => {
  const [selectedSocials, setSelectedSocials] = useState<SocialLinkModel[]>(
    formData?.socials || [],
  );
  const socialOptions: Pick<SocialLinkModel, "name" | "url">[] = Object.values(
    SocialType,
  ).map((type) => ({
    name: type,
    url: "",
  }));

  const handleSelectSocials = ({
    target: { value },
  }: KissChangeEvent<unknown>) => {
    const updated = value as SocialLinkModel[];
    setSelectedSocials(updated);

    onChange({ target: { name: "socials", value: updated } });
  };

  const handleSocialUrlChange = ({
    target: { name, value },
  }: KissChangeEvent<string>) => {
    const updated = selectedSocials.map((s) =>
      s.name === name ? { ...s, url: value } : s,
    );
    setSelectedSocials(updated);
    onChange({ target: { name: "socials", value: updated } });
  };

  return (
    <FormWrapper
      title="Connect Your Socials"
      submit={{ label: "Save", onClick: onNext }}
      className="mt-20 sm:mt-36 md:w-3xl mx-auto"
      fieldsetClassName="grid sm:grid-cols-2 gap-x-8"
      loading={loading}
      animated
      errors={errors}
    >
      <FormSelect<Pick<SocialLinkModel, "name" | "url">>
        property="name"
        label="Social Media Profiles"
        name="socials"
        options={socialOptions}
        value={selectedSocials}
        onChange={handleSelectSocials}
        tooltip="Add your social media profiles to let others find you there! You can add as many as you want, just make sure to fill in the URL for each selected platform."
        className={`${selectedSocials.length ? "row-span-12" : "col-span-full"} max-sm:pb-4`}
      />
      {selectedSocials.map(({ name, url }) => (
        <FormInput
          StartChild={
            SocialLinkIcon[name]({ className: "size-6" }) as React.ReactNode
          }
          key={name}
          name={name}
          onChange={handleSocialUrlChange}
          value={url}
          placeholder={asTitle(name)}
          className="pb-2"
          EndChild={
            <Button
              variant="ghost-reveal"
              Icon={XMarkIcon}
              onClick={() =>
                handleSelectSocials({
                  target: {
                    name: "socials",
                    value: selectedSocials.filter((s) => s.name !== name),
                  },
                })
              }
              size="sm"
              className="aspect-square"
            />
          }
        />
      ))}
    </FormWrapper>
  );
};
export default SignUpStepThree;
