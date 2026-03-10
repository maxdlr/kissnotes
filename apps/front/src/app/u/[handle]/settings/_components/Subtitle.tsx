interface SubtitleProps {
  subtitle: string;
  title: string;
  className?: string;
}
const Subtitle = ({ subtitle, title, className }: SubtitleProps) => {
  return (
    <div className={className}>
      <h2 className="text-xl">{title}</h2>
      <div className="w-full h-px bg-accent" />
      <p className="text-accent">{subtitle}</p>
    </div>
  );
};
export default Subtitle;
