"use client";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import useAuth from "@/contexts/AuthContext/useAuth";
import useBreakpoints from "@/hooks/useBreakpoints";
import { BoltIcon, FireIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { user } = useAuth();
  const router = useRouter();

  const { sm } = useBreakpoints();

  if (!user) {
    return (
      <section className="flex flex-col justify-center items-center w-full gap-4 py-8">
        <Logo className="text-primary" big />
        <h1 className="text-center max-sm:w-2/3 text-xl font-normal">
          A free and open-source After Effects expressions sharing platform.
        </h1>
        <div className="flex flex-row justify-center items-center gap-4">
          <Button
            label="Sign up"
            Icon={!sm ? FireIcon : undefined}
            className="text-primary"
            hoverUp
            onClick={() => router.push("/signup")}
          />
          <p className="hidden sm:block">or</p>
          <Button
            Icon={!sm ? BoltIcon : undefined}
            label="Log in"
            className="text-primary"
            variant="outline"
            hoverUp
            onClick={() => router.push("/login")}
          />
        </div>
      </section>
    );
  }
  return (
    <div className="flex justify-center items-center py-8">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
        Hello, {user.username}
      </h2>
    </div>
  );
};
export default Hero;
