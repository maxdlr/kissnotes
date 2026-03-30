"use client";
import useUser from "@/app/(protected)/[handle]/hooks/UserContext";
import { SocialItem, type SocialType } from "@/types/socials.types";
import { Button } from "../Button";

const UserHero = () => {
  const { user } = useUser();
  const socials: { name: SocialType; url: string }[] = Object.keys(
    SocialItem,
  ).map((k) => ({
    name: k as SocialType,
    url: "",
  }));

  return (
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
  );
};
export default UserHero;
