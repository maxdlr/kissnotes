import { Breakpoint } from "@/types/Breakpoints";
import { useState, useEffect } from "react";

const useBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint(Breakpoint.SM);
      } else if (width >= 640 && width < 768) {
        setBreakpoint(Breakpoint.MD);
      } else if (width >= 768 && width < 1024) {
        setBreakpoint(Breakpoint.LG);
      } else if (width >= 1024 && width < 1280) {
        setBreakpoint(Breakpoint.XL);
      } else if (width >= 1280) {
        setBreakpoint(Breakpoint.XXL);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sm = breakpoint === Breakpoint.SM;
  const md = breakpoint === Breakpoint.MD;
  const lg = breakpoint === Breakpoint.LG;
  const xl = breakpoint === Breakpoint.XL;
  const xxl = breakpoint === Breakpoint.XXL;

  return { breakpoint, sm, md, lg, xl, xxl };
};

export default useBreakpoints;
