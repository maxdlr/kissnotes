interface LogoProps {
  className?: string;
  byLine?: boolean;
}
const Logo = ({ className = "", byLine = true }: LogoProps) => {
  return (
    <div className={className}>
      <div className="w-fit text-end">
        <div>
          <p className="font-black italic text-3xl leading-none">Kissnotes</p>
        </div>
        {byLine && (
          <p className="text-sm leading-none italic">by Motiontober</p>
        )}
      </div>
    </div>
  );
};
export default Logo;
