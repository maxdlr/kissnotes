import {
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExpressionCard from "@/app/(public)/_components/ExpressionCard";
import ExpressionListSidebar from "@/app/(public)/_components/ExpressionListSidebar";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import MasonryGrid from "@/components/MasonryGrid";
import type { ExpressionListProps } from "./interfaces";

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
          <>
            <div className="space-y-4 hidden lg:block">
              {!!expressions?.length && (
                <Button
                  variant="ghost"
                  size={collapsed ? "md" : "sm"}
                  Icon={collapsed ? AdjustmentsHorizontalIcon : ChevronLeftIcon}
                  shortcut={collapsed ? undefined : { keys: ["ctrl", "S"] }}
                  onClick={() => setCollapsed((v) => !v)}
                  tooltip={{ content: "Filters", showDelay: 4000 }}
                />
              )}
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: collapsed ? 30 : 350,
                      opacity: collapsed ? 0 : 1,
                    }}
                    exit={{ width: 0, opacity: 0 }}
                    style={{ overflow: "hidden", flexShrink: 0 }}
                  >
                    <ExpressionListSidebar
                      expressions={expressions || []}
                      value={filters}
                      onChange={onFilterChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="block lg:hidden">
              <div
                className={`place-self-start self-start flex items-center ${!!expressions?.length ? "justify-between" : "justify-end"} w-full`}
              >
                {!!expressions?.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    Icon={collapsed ? AdjustmentsHorizontalIcon : ChevronUpIcon}
                    shortcut={{ keys: ["ctrl", "S"] }}
                    onClick={() => setCollapsed((v) => !v)}
                  />
                )}
                {ActionSlot && <div className="">{ActionSlot}</div>}
              </div>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: collapsed ? 0 : "auto",
                      opacity: collapsed ? 0 : 1,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden", flexShrink: 0 }}
                  >
                    <ExpressionListSidebar
                      expressions={expressions || []}
                      value={filters}
                      onChange={onFilterChange}
                      collapsed={false}
                      className="pt-4"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {loading ? (
          <Loading />
        ) : (
          <>
            {!expressions?.length && (
              <div className="w-fit mx-auto">
                <span>No expressions yet</span>
              </div>
            )}
            {expressions?.length > 0 && (
              <div className="max-lg:pt-4 lg:ps-4 w-full">
                <MasonryGrid columns={{ 0: 1, 840: 2, 1280: 3 }} stagger>
                  {expressions?.map((expression) => (
                    <ExpressionCard
                      highlightedTokens={[]}
                      key={expression.id}
                      expression={expression}
                      onClick={() =>
                        router.push(
                          `${urlScope}/exp/${expression.id}${openModals ? "/m" : ""}`,
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
