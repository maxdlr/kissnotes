interface SubtitleProps {
  subtitle: string;
  className?: string;
}
const Subtitle = ({ subtitle, className }: SubtitleProps) => {
  return (
    <div className={className}>
      <h2 className="text-xl">{subtitle}</h2>
      <div className="w-full h-px bg-accent" />
    </div>
  );
};
export default Subtitle;
