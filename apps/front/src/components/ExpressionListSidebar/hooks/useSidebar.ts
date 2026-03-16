import { useEffect, useState } from "react";

const useSidebar = () => {
  const [hovering, setHovering] = useState<string>("");

  useEffect(() => {
    console.log(hovering);
  }, [hovering]);

  return { hovering, setHovering };
};
export default useSidebar;
