/** biome-ignore-all lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the list is static and does not change order */
import { type Easing, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface LoadingProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  delaySpread?: number;
  gap?: number;
  auto?: boolean;
  className?: string;
}

const Loading = ({
  count: countProp,
  minSize: minSizeProp,
  maxSize: maxSizeProp,
  delaySpread = 30,
  gap = 3,
  auto = true,
  className,
}: LoadingProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!auto || !ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [auto]);

  let count: number;
  let minSize: number;
  let maxSize: number;

  if (auto && width > 0) {
    maxSize = maxSizeProp ?? Math.max(4, Math.min(width * 0.04, 20));
    minSize = minSizeProp ?? Math.max(2, maxSize * 0.15);
    const avgSize = (minSize + maxSize) / 2;
    count = countProp ?? Math.max(5, Math.floor(width / (avgSize + gap)));
  } else {
    count = countProp ?? 30;
    minSize = minSizeProp ?? 2;
    maxSize = maxSizeProp ?? 15;
  }

  const balls = Array.from({ length: count }).map((_, i) => {
    const t = 1 - Math.abs((2 * i) / (count - 1) - 1);
    const size = minSize + t * (maxSize - minSize);
    const delay = 0.3 * ((delaySpread * i) / 100);

    return {
      initial: false,
      animate: { y: ["-50%", "50%", "-50%"] },
      style: { width: `${size}px`, height: `${size}px` },
      transition: {
        ease: [0.5, 0, 0.5, 1] as Easing,
        duration: 0.6,
        delay: -(delay % 0.6),
        repeat: Infinity,
      },
    };
  });

  return (
    <motion.div
      key="loading"
      initial={{ width: "50%" }}
      animate={{ width: "100%" }}
      exit={{ width: "50%" }}
      style={{ minHeight: maxSize * 2 }}
      className={`mx-auto ${className}`}
    >
      <div
        ref={ref}
        className="flex items-center justify-center"
        style={{ gap }}
      >
        {width > 0 &&
          balls.map((ball, index) => (
            <motion.span
              key={index}
              className="inline-flex rounded-full my-0.75 bg-secondary"
              {...ball}
            />
          ))}
      </div>
    </motion.div>
  );
};
export default Loading;
