/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import Button from "@/components/Button";
import useUser from "@/contexts/UserContext";
import { SocialLinkIcon } from "@/types/socials.types";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import type { SocialLinkModel } from "@kissnotes/types";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading";
import useAuth from "@/contexts/AuthContext/useAuth";
import Modal from "../Modal";
import SignUpStepThree from "@/app/(public)/signup/_components/SignUpStepThree";
import { KissChangeEvent } from "@/types/form.types";
import useAxios from "@/hooks/useAxios";
import useForm from "../FormWrapper/hooks/useForm";
import useToasts from "@/contexts/ToastsContext";
import SignUpStepTwo from "@/app/(public)/signup/_components/SignUpStepTwo";

const UserHero = () => {
  const { user, loading, refreshUser } = useUser();
  const auth = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const { errors, setErrors } = useForm();
  const { addToast } = useToasts();

  const socials: SocialLinkModel[] = user?.socials || [];
  const description: string = user?.description || "";

  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const [socialFormData, setSocialFormData] =
    useState<SocialLinkModel[]>(socials);
  const [descriptionFormData, setDescriptionFormData] =
    useState<string>(description);

  const { putData: putSocialLinks } = useAxios("social-links/edit");
  const { putData: putDescription } = useAxios("users/edit");

  const isReady = !loading;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.socials) setSocialFormData(user.socials);
    if (user?.description) setDescriptionFormData(user.description);
  }, [user]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isReady]);

  const handleAddSocials = async () => {
    await putSocialLinks({ socials: socialFormData }).then((r) => {
      if (r?.error) {
        setErrors(r.error.errors);
        return;
      }
      addToast({
        type: "success",
        message: "Social links updated successfully!",
      });
      setErrors([]);
      setIsAddSocialModalOpen(false);
      refreshUser();
    });
  };

  const handleAddDescription = async () => {
    await putDescription({ description: descriptionFormData }).then((r) => {
      if (r?.error) {
        setErrors(r.error.errors);
        return;
      }
      addToast({
        type: "success",
        message: "Description updated successfully!",
      });
      setErrors([]);
      setIsDescriptionModalOpen(false);
      refreshUser();
    });
  };

  const handleSocialsChange = (
    e: KissChangeEvent<string | SocialLinkModel[] | null>,
  ) => {
    const socials = e.target.value as SocialLinkModel[];
    setSocialFormData(socials);
  };

  const handleDescriptionChange = (
    e: KissChangeEvent<string | SocialLinkModel[] | null>,
  ) => {
    const description = e.target.value as string;
    setDescriptionFormData(description);
  };

  return (
    <>
      {isAddSocialModalOpen && (
        <Modal
          onClose={() => setIsAddSocialModalOpen(false)}
          className="max-w-4xl bg-darker p-8"
        >
          <SignUpStepThree
            onChange={handleSocialsChange}
            onNext={handleAddSocials}
            errors={errors}
            formData={{ socials: socialFormData }}
          />
        </Modal>
      )}
      {isDescriptionModalOpen && (
        <Modal
          onClose={() => setIsDescriptionModalOpen(false)}
          className="max-w-2xl bg-darker p-8"
        >
          <SignUpStepTwo
            onChange={handleDescriptionChange}
            onNext={handleAddDescription}
            errors={errors}
            formData={{ description: descriptionFormData }}
          />
        </Modal>
      )}
      <motion.div
        className="w-full"
        animate={{ height: isReady ? contentHeight : "auto" }}
      >
        <div ref={contentRef}>
          {!isReady ? (
            <Loading />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col justify-center items-center lg:w-2/3 mx-auto gap-4">
                <div>
                  <h2 className="text-3xl sm:text-6xl md:text-5xl font-bold text-center">
                    @{user?.username}
                  </h2>
                </div>
                <p className="sm:w-2/3 lg:1/2">
                  {`${description && user?.description}`}
                  {auth?.isAuthUser(user) && (
                    <Button
                      Icon={PencilIcon}
                      size="sm"
                      variant="ghost"
                      className="text-secondary! ms-2"
                      onClick={() => setIsDescriptionModalOpen(true)}
                    />
                  )}
                </p>
                <div className="flex flex-wrap justify-center items-center">
                  {socials.map((s, index) => (
                    <Button
                      key={s.name + "-" + index}
                      variant="ghost-reveal"
                      Icon={SocialLinkIcon[s.name]}
                      href={s.url}
                      size="sm"
                      className="text-accent! hover:text-secondary! py-2!"
                    />
                  ))}
                  {auth?.isAuthUser(user) && (
                    <Button
                      key="add-social"
                      variant="ghost"
                      Icon={PlusCircleIcon}
                      onClick={() => setIsAddSocialModalOpen(true)}
                      className="text-secondary! hover:text-secondary! p-1!"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};
export default UserHero;
