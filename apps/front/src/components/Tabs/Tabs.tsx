"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createContext, ReactElement, useContext } from "react";
import Button from "../Button";
import { TabProps, TabsProps } from "./interfaces";

const TabsContext = createContext<{
  active: string;
  setActive: (value: string) => void;
}>({ active: "", setActive: () => {} });

const Container = ({ defaultTab, children }: TabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") || defaultTab;

  const localChildren: ReactElement<TabProps>[] = Array.isArray(children)
    ? children
    : [children];

  const setActive = (value: string) => {
    router.push(`?tab=${value}`);
  };

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="flex justify-center gap-2 mb-4 border-b">
        {localChildren.map((child) => (
          <div key={child.props.value}>
            <Button
              label={child.props.label}
              onClick={() => setActive(child.props.value)}
              data-active={active === child.props.value}
              variant="ghost-secondary"
              className={active === child.props.value ? "" : "text-accent!"}
            />
          </div>
        ))}
      </div>

      {children}
    </TabsContext.Provider>
  );
};

const Tab = ({ value, children }: TabProps) => {
  const { active } = useContext(TabsContext);
  return active === value && children;
};

const Tabs = { Container, Tab };
export default Tabs;
