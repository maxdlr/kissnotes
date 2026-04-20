import { Button } from "@/components/Button";
import type { ButtonProps } from "@/components/Button/interfaces";

interface SubtitleProps {
  subtitle: string;
  title: string;
  className?: string;
  action?: ButtonProps;
  children?: React.ReactNode;
}
const SettingsSection = ({
  subtitle,
  title,
  className,
  action,
  children,
}: SubtitleProps) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-xl">{title}</h2>
        <Button variant="ghost" {...action} />
      </div>
      <div className="w-full h-px bg-accent" />
      <p className="text-accent">{subtitle}</p>
      <div className="grid grid-cols-2 gap-8 py-8">{children}</div>
    </div>
  );
};
export default SettingsSection;
