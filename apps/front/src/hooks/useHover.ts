import { useEffect, useState } from "react";

const useHover = (ref: React.RefObject<HTMLElement | null>) => {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!ref) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const handleOn = () => setIsHovering(true);
    const handleOff = () => setIsHovering(false);

    element.addEventListener("mouseenter", handleOn);
    element.addEventListener("mouseleave", handleOff);
    element.addEventListener("touchstart", handleOn, { passive: true });
    element.addEventListener("touchend", handleOff, { passive: true });
    element.addEventListener("touchcancel", handleOff, { passive: true });

    return () => {
      element.removeEventListener("mouseenter", handleOn);
      element.removeEventListener("mouseleave", handleOff);
      element.removeEventListener("touchstart", handleOn);
      element.removeEventListener("touchend", handleOff);
      element.removeEventListener("touchcancel", handleOff);
    };
  }, [ref]);

  return isHovering;
};

export default useHover;
