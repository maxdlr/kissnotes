/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import useUser from "@/app/(protected)/[handle]/hooks/UserContext";
import Button from "@/components/Button";
import { SocialItem, type SocialType } from "@/types/socials.types";
import Loading from "../Loading";

const UserHero = () => {
  const { user, loading } = useUser();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const socials: { name: SocialType; url: string }[] = Object.keys(
    SocialItem,
  ).map((k) => ({
    name: k as SocialType,
    url: "",
  }));

  const isReady = !loading && !!user;

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
            <div className="grid md:grid-cols-3 lg:w-2/3 mx-auto items-start gap-4">
              <div>
                <h2 className="text-6xl md:text-5xl font-bold text-center">
                  @{user.username}
                </h2>
              </div>
              <p className="md:col-span-2">{user.description}</p>
              <div className="md:col-span-3 flex flex-wrap justify-center items-center">
                {socials.map((s) => (
                  <Button
                    key={s.name}
                    variant="ghost-reveal"
                    Icon={SocialItem[s.name]}
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
