/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import Button from "@/components/Button";
import useUser from "@/contexts/UserContext";
import { SocialLinkIcon } from "@/types/socials.types";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
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

const UserHero = () => {
  const { user, loading } = useUser();
  const auth = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const socials: SocialLinkModel[] = user?.socials || [];
  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState(false);
  const [socialFormData, setSocialFormData] =
    useState<SocialLinkModel[]>(socials);
  const { putData } = useAxios("social-links/edit");
  const { errors, setErrors } = useForm();
  const { addToast } = useToasts();

  const isReady = !loading;

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isReady]);

  const handleAddSocials = async () => {
    await putData({ socials: socialFormData }).then((r) => {
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
    });
  };

  const handleSocialsChange = (
    e: KissChangeEvent<string | SocialLinkModel[] | null>,
  ) => {
    const socials = e.target.value as SocialLinkModel[];
    console.log({ socials });
    setSocialFormData(socials);
  };

  return (
    <>
      {isAddSocialModalOpen && (
        <Modal
          onClose={() => setIsAddSocialModalOpen(false)}
          className="max-w-4xl bg-darker p-8"
        >
          <div>
            <SignUpStepThree
              onChange={handleSocialsChange}
              onNext={handleAddSocials}
              errors={errors}
            />
          </div>
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
                <p className="sm:w-2/3 lg:1/2">{`${user?.description}`}</p>
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
