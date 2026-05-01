"use client";

import { motion } from "motion/react";
import useUser from "@/app/(protected)/[handle]/hooks/UserContext";
import Button from "@/components/Button";
import { SocialItem, type SocialType } from "@/types/socials.types";
import Loading from "../Loading";

const UserHero = () => {
  const { user } = useUser();
  const socials: { name: SocialType; url: string }[] = Object.keys(
    SocialItem,
  ).map((k) => ({
    name: k as SocialType,
    url: "",
  }));

  if (!user) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
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
  );
};
export default UserHero;
