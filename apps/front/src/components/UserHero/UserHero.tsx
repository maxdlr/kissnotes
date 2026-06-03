/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { faker } from "@faker-js/faker";
import type { SocialLinkModel } from "@kissnotes/types";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { SocialLinkIcon } from "@/types/socials.types";
import Loading from "../Loading";
import useUser from "@/contexts/UserContext";

const UserHero = () => {
  const { user, loading } = useUser();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const socials: SocialLinkModel[] = user?.socials || [];

  const isReady = !loading;

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isReady]);

  return (
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
                {socials.map((s) => (
                  <Button
                    key={s.name}
                    variant="ghost-reveal"
                    Icon={SocialLinkIcon[s.name]}
                    href={s.url}
                    size="sm"
                    className="text-accent! hover:text-secondary! py-2!"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
export default UserHero;
