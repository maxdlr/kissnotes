"use client";
import { AnimatePresence, motion } from "framer-motion";

export interface CollapsibleProps {
  children: React.ReactNode;
  /** Whether the content is collapsed or not, should be used with a state (default: false) */
  collapsed: boolean;
  /** Additional class names applied to the root container. */
  className?: string;
}
const Collapsible = ({ collapsed, children, className }: CollapsibleProps) => {
  return (
    <AnimatePresence initial={false}>
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
    </AnimatePresence>
  );
};

export default Collapsible;
