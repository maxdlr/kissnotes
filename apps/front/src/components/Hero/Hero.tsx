"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import useAuth from "@/contexts/AuthContext/useAuth";
import { BoltIcon, FireIcon } from "@heroicons/react/24/solid";

const Hero = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <section className="flex flex-col justify-center items-center w-full gap-4 py-8">
        <Logo className="text-primary" big />
        <p className="text-center max-sm:w-2/3">
          A free and open-source After Effects expressions sharing platform.
        </p>
        <div className="flex flex-row justify-center items-center gap-4">
          <Button
            label="Sign up"
            Icon={FireIcon}
            className="text-primary"
            hoverUp
            onClick={() => router.push("/signup")}
          />
          <p className="hidden sm:block">or</p>
          <Button
            Icon={BoltIcon}
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
    <div className="flex justify-center items-center">
      <h2 className="text-lg sm:text-3xl md:text-5xl font-bold">
        Hello, {user.username}
      </h2>
    </div>
  );
};
export default Hero;
