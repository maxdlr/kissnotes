import { ElementType, ReactNode } from "react";

export type TabsProps = {
  defaultTab: string;
  children: ReactNode;
};

export type TabProps = {
  label: string;
  value: string;
  children: ReactNode;
  Icon?: ElementType
};
