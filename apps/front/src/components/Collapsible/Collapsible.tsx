"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CollapsibleProps } from "./interfaces";

const Collapsible = ({
  collapsed,
  horizontal = false,
  children,
  className,
  headerChild,
}: CollapsibleProps) => {
  if (horizontal) {
    return (
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="content"
            initial={{ gridTemplateColumns: "0fr", opacity: 0 }}
            animate={{ gridTemplateColumns: "1fr", opacity: 1 }}
            exit={{ gridTemplateColumns: "0fr", opacity: 0 }}
            className={`grid overflow-hidden w-full`}
          >
            <div className={`min-w-0 ${className}`}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  return (
    <>
      {headerChild && <div className="w-full">{headerChild}</div>}
      {!collapsed && (
        <motion.div
          key="content"
          initial={{ gridTemplateRows: "0fr", opacity: 0 }}
          animate={{ gridTemplateRows: "1fr", opacity: 1 }}
          exit={{ gridTemplateRows: "0fr", opacity: 0 }}
          className={`grid overflow-hidden w-full`}
        >
          <div className={`min-h-0 ${className}`}>{children}</div>
        </motion.div>
      )}
    </>
  );
};

export default Collapsible;
