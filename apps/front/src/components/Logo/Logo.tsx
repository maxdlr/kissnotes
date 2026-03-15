interface LogoProps {
  className?: string;
  byLine?: boolean;
  big?: boolean;
}
const Logo = ({ className = "", byLine = true, big = false }: LogoProps) => {
  return (
    <a className={className} href="/">
      <div className="w-fit text-end">
        <div>
          <p
            className={`font-black italic ${big ? "text-5xl" : "text-3xl"} leading-none`}
          >
            Kissnotes
          </p>
        </div>
        {byLine && (
          <p className="text-sm leading-none italic">by Motiontober</p>
        )}
      </div>
    </a>
  );
};
export default Logo;
