import ExpressionCard from "@/app/(public)/_components/ExpressionCard";
import ExpressionListSidebar from "@/app/(public)/_components/ExpressionListSidebar";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import MasonryGrid from "@/components/MasonryGrid";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar";
import type { ExpressionToken, UserModel } from "@kissnotes/types";
import {
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import type { ExpressionListProps } from "./interfaces";

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  hasExpressions: boolean;
  filters: SidebarValue;
  onFilterChange: (filters: SidebarValue) => void;
  tokenOptions: ExpressionToken[];
  authorOptions: UserModel[];
  ActionSlot?: ReactNode;
}

const CollapsibleSidebar = ({
  collapsed,
  onToggle,
  hasExpressions,
  filters,
  onFilterChange,
  tokenOptions,
  authorOptions,
  ActionSlot,
}: CollapsibleSidebarProps) => (
  <>
    {/* Desktop */}
    <div className="space-y-4 hidden lg:block">
      {hasExpressions && (
        <Button
          variant="ghost"
          size={collapsed ? "md" : "sm"}
          Icon={collapsed ? AdjustmentsHorizontalIcon : ChevronLeftIcon}
          shortcut={
            collapsed
              ? undefined
              : { keys: ["ctrl", "S"], ignoreInputs: false }
          }
          onClick={onToggle}
          tooltip={{ content: "Filters", showDelay: 4000 }}
        />
      )}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1, overflow: "visible" }}
            exit={{ width: 0, opacity: 0, overflow: "hidden" }}
            style={{ overflow: "hidden", flexShrink: 0 }}
          >
            <ExpressionListSidebar
              tokenOptions={tokenOptions}
              authorOptions={authorOptions}
              value={filters}
              onChange={onFilterChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Mobile */}
    <div className="block lg:hidden">
      <div
        className={`place-self-start self-start flex items-center ${hasExpressions ? "justify-between" : "justify-end"} w-full`}
      >
        {hasExpressions && (
          <Button
            variant="ghost"
            size="sm"
            Icon={collapsed ? AdjustmentsHorizontalIcon : ChevronUpIcon}
            shortcut={{ keys: ["ctrl", "S"], ignoreInputs: false }}
            onClick={onToggle}
          />
        )}
        {ActionSlot && <div>{ActionSlot}</div>}
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, overflow: "visible" }}
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
            style={{ overflow: "hidden", flexShrink: 0 }}
          >
            <ExpressionListSidebar
              tokenOptions={tokenOptions}
              authorOptions={authorOptions}
              value={filters}
              onChange={onFilterChange}
              className="pt-4"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
);

const ExpressionList = ({
  loading,
  expressions,
  filters,
  onFilterChange,
  className,
  startCollapsed = false,
  urlScope = "",
  openModals = false,
  ActionSlot,
  emptyMsg = "No expressions yet",
  tokenOptions = [],
  authorOptions = [],
}: ExpressionListProps) => {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const router = useRouter();

  return (
    <>
      {ActionSlot && (
        <div className="hidden lg:flex items-center justify-end">
          {ActionSlot}
        </div>
      )}
      <div className={`flex flex-col lg:flex-row ${className}`}>
        {filters && onFilterChange && (
          <CollapsibleSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
            hasExpressions={!!expressions?.length}
            filters={filters}
            onFilterChange={onFilterChange}
            tokenOptions={tokenOptions}
            authorOptions={authorOptions}
            ActionSlot={ActionSlot}
          />
        )}

        {loading ? (
          <Loading />
        ) : (
          <>
            {!expressions?.length && (
              <div className="w-fit mx-auto">{emptyMsg}</div>
            )}
            {expressions?.length > 0 && (
              <div className="max-lg:pt-4 lg:ps-4 w-full">
                <MasonryGrid columns={{ 0: 1, 840: 2, 1280: 3 }} stagger>
                  {expressions?.map((expression) => (
                    <ExpressionCard
                      highlightedTokens={[]}
                      key={expression.id || ""}
                      expression={expression}
                      onClick={() =>
                        router.push(
                          `${urlScope}/exp/${expression.id}${openModals ? "/m" : ""}${expression.native ? "?native" : ""}`,
                        )
                      }
                    />
                  ))}
                </MasonryGrid>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default ExpressionList;
