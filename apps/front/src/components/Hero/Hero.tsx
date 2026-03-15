"use client";
import useAuth from "@/hooks/AuthProvider";
import { Button } from "../Button";
import { Logo } from "../Logo";

const Hero = () => {
  const { user } = useAuth();
  if (!user) {
    return (
      <section className="flex flex-col justify-center items-center w-full gap-4 py-8">
        <Logo className="text-white" big />
        <p className="text-center max-sm:w-2/3">
          A free and open-source After Effects expressions sharing platform.
        </p>
        <div className="flex flex-row justify-center items-center gap-4">
          <Button label="Sign up" className="text-white" />
          <p className="hidden sm:block">or</p>
          <Button label="Log in" className="text-white" variant="outline" />
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
