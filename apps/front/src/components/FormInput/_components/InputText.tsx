import type { InputTextProps } from "../interfaces";

const InputText = ({
  ref,
  type = "text",
  placeholder = "Search...",
  value,
  name,
  className,
  onClick,
  onFocus,
  onChange,
  disabled,
  Icon,
  autoFocus = false,
}: InputTextProps) => {
  if (disabled && !value) {
    return <div className="h-px w-50 bg-accent/30 my-2" />;
  }

  return (
    <div className={`flex w-full items-center gap-2 ${className}`}>
      <input
        ref={ref}
        type={type}
        name={name}
        aria-label={name}
        autoComplete={name}
        placeholder={placeholder}
        className={`focus:ring-0 placeholder:font-normal focus:outline-none whitespace-nowrap w-full h-6 ${className}`}
        value={value}
        onClick={onClick}
        autoFocus={autoFocus}
        onChange={onChange}
        disabled={disabled}
        onFocus={onFocus}
      />
      {Icon && <Icon className="size-6 " />}
    </div>
  );
};
export default InputText;
