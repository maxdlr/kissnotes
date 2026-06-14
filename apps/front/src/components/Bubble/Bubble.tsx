"use client";

import { motion } from "motion/react";
import HtmlSanitizer from "@/components/HtmlSanitizer";
import type { BubblePosition, BubbleProps } from "./interfaces";

const positionStyles: Record<BubblePosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const originStyles: Record<BubblePosition, string> = {
  top: "origin-bottom",
  bottom: "origin-top",
  left: "origin-right",
  right: "origin-left",
};

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const Bubble = ({ content, position = "top" }: BubbleProps) => {
  return (
    <motion.div
      role="tooltip"
      className={`absolute z-50 w-max max-w-50 leading-tight border border-accent bg-accent/50 text-xs rounded-2xl p-3 font-semibold text-white ${positionStyles[position]} ${originStyles[position]}`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.15 }}
    >
      <HtmlSanitizer Tag="span" html={content} />
    </motion.div>
  );
};

export default Bubble;
